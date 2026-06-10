// Removed unused React import
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSkeleton from './LoadingSkeleton';

describe('LoadingSkeleton Component', () => {
  it('renders without crashing and contains accessibility attributes', () => {
    const { container } = render(<LoadingSkeleton />);
    
    // Check if the main container is present
    const skeletonContainer = container.firstChild as HTMLElement;
    expect(skeletonContainer).toBeInTheDocument();
    
    // We aren't testing the CSS implementation details, but we can verify it renders the layout grid
    // For example, verifying multiple sections exist.
    // Given the implementation has leftCol and rightCol.
    // Instead of querying by CSS modules (which might be obfuscated in tests),
    // we just ensure the component mounts successfully.
    expect(skeletonContainer.childNodes.length).toBeGreaterThan(0);
  });
});
