export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export interface RetryConfig {
  retries?: number;
  delayMs?: number;
}

export class APIError extends Error {
  status?: number;
  statusText?: string;

  constructor(message: string, status?: number, statusText?: string) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.statusText = statusText;
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Network connection failed") {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor(message: string = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Perform a fetch request with support for request timeout and simple retry on failures.
 */
export async function fetchWithRetry<T>(
  url: string,
  options: RequestOptions = {},
  retryConfig: RetryConfig = {}
): Promise<T> {
  const { retries = 3, delayMs = 1000 } = retryConfig;
  const { timeoutMs = 10000, signal: externalSignal, ...fetchOptions } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    
    // We use a custom flag to differentiate between manual aborts and timeouts
    let isTimeout = false;
    const id = setTimeout(() => {
      isTimeout = true;
      controller.abort();
    }, timeoutMs);

    // Merge external signal with timeout signal
    if (externalSignal) {
      if (externalSignal.aborted) {
        clearTimeout(id);
        throw new DOMException("Aborted", "AbortError");
      }
      externalSignal.addEventListener('abort', () => {
        // Only abort if it wasn't a timeout
        if (!isTimeout) controller.abort();
      }, { once: true });
    }

    try {
      if (attempt > 0) {
        // Wait before retrying
        await sleep(delayMs * attempt);
      }

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        throw new APIError(
          `API request failed with status ${response.status}`,
          response.status,
          response.statusText
        );
      }

      return (await response.json()) as T;
    } catch (error: unknown) {
      clearTimeout(id);
      
      const err = error instanceof Error ? error : new Error(String(error));

      // Handle aborts
      if (err.name === "AbortError") {
        if (isTimeout) {
          lastError = new TimeoutError();
          console.warn(`[API Client] Request timed out on attempt ${attempt + 1}/${retries + 1}`);
        } else {
          // Manual abort - don't retry, just bubble up standard DOMException
          throw err;
        }
      } else if (err.name === "TypeError" && err.message.includes("fetch")) {
        // Network errors (e.g., DNS lookup failed, CORS, offline) usually throw TypeError
        lastError = new NetworkError();
        console.warn(`[API Client] Network failure on attempt ${attempt + 1}/${retries + 1}: ${err.message}`);
      } else {
        lastError = err;
        console.warn(`[API Client] Attempt ${attempt + 1}/${retries + 1} failed: ${err.message}`);
      }

      // If we've exhausted all retries or it's a client 4xx error, break loop
      if (attempt === retries || (lastError instanceof APIError && lastError.status && lastError.status >= 400 && lastError.status < 500)) {
        break;
      }
    }
  }

  throw lastError || new Error(`Request failed after ${retries} retries`);
}
