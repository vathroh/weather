import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithRetry, APIError, NetworkError } from './api';

// Save the original fetch
const originalFetch = globalThis.fetch;

describe('fetchWithRetry Service', () => {
  beforeEach(() => {
    // Mock global fetch
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    // Restore fetch
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns data successfully on first try', async () => {
    const mockResponse = { data: 'success' };
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchWithRetry('https://api.test/data');
    expect(result).toEqual(mockResponse);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('retries on network failure and succeeds', async () => {
    const mockResponse = { data: 'success' };
    
    (globalThis.fetch as any)
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

    // Reduce delay for fast tests
    const result = await fetchWithRetry('https://api.test/data', {}, { retries: 2, delayMs: 10 });
    
    expect(result).toEqual(mockResponse);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('throws NetworkError when retries are exhausted on fetch failure', async () => {
    (globalThis.fetch as any).mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(
      fetchWithRetry('https://api.test/data', {}, { retries: 1, delayMs: 10 })
    ).rejects.toThrow(NetworkError);

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('throws APIError when response status is not ok (e.g. 500)', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(
      fetchWithRetry('https://api.test/data', {}, { retries: 1, delayMs: 10 })
    ).rejects.toThrow(APIError);
    
    // It should retry for 500 errors
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('does not retry and immediately throws APIError on 4xx client errors', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(
      fetchWithRetry('https://api.test/data', {}, { retries: 3, delayMs: 10 })
    ).rejects.toThrow(APIError);
    
    // Should NOT retry on 4xx errors based on our implementation logic
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles external AbortSignal', async () => {
    const controller = new AbortController();
    
    (globalThis.fetch as any).mockImplementationOnce(() => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          const domException = new DOMException('Aborted', 'AbortError');
          reject(domException);
        }, 50);
      });
    });

    const fetchPromise = fetchWithRetry('https://api.test/data', { signal: controller.signal });
    
    // Trigger abort manually
    setTimeout(() => controller.abort(), 10);
    
    await expect(fetchPromise).rejects.toThrow(DOMException);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
