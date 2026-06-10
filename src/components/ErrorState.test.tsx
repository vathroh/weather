// Removed unused React import
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorState from './ErrorState';

describe('ErrorState Component', () => {
  it('renders default message when no message is provided', () => {
    render(<ErrorState onRetry={() => {}} />);
    
    expect(screen.getByText('Unable to Load Data')).toBeInTheDocument();
    expect(
      screen.getByText(/We encountered a problem retrieving the weather forecast/i)
    ).toBeInTheDocument();
  });

  it('renders custom error message', () => {
    const customMessage = 'Network connection lost.';
    render(<ErrorState message={customMessage} onRetry={() => {}} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('calls onRetry when the button is clicked', () => {
    const onRetryMock = vi.fn();
    render(<ErrorState onRetry={onRetryMock} />);
    
    const retryButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryButton);
    
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });
});
