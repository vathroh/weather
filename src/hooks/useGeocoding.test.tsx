import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGeocoding } from './useGeocoding';
import * as geocodingService from '../services/geocodingService';
import type { GeocodingLocation } from '../types/weather';

vi.mock('../services/geocodingService');

const mockLocations: GeocodingLocation[] = [
  { id: 1, name: 'London', latitude: 51.5, longitude: -0.1, country: 'UK', country_code: 'GB', admin1: 'England' },
];

describe('useGeocoding hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializes with empty results and loading false', () => {
    const { result } = renderHook(() => useGeocoding(''));
    
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('does not fetch if query is less than 2 characters', async () => {
    const { result } = renderHook(() => useGeocoding('a'));
    
    expect(geocodingService.searchCities).not.toHaveBeenCalled();
    expect(result.current.results).toEqual([]);
  });

  it('fetches locations and sets results on valid query', async () => {
    vi.mocked(geocodingService.searchCities).mockResolvedValue(mockLocations);

    const { result } = renderHook(() => useGeocoding('London'));
    
    // It should immediately set loading to true
    expect(result.current.loading).toBe(true);

    // Wait for the promise to resolve
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.results).toEqual(mockLocations);
    expect(result.current.error).toBeNull();
    expect(geocodingService.searchCities).toHaveBeenCalledWith('London', 10, 'en', expect.any(Object));
  });

  it('sets friendly error message on failure', async () => {
    vi.mocked(geocodingService.searchCities).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGeocoding('London'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe("We're having trouble finding locations. Please try again.");
  });

  it('clears results when clearResults is called', async () => {
    vi.mocked(geocodingService.searchCities).mockResolvedValue(mockLocations);
    const { result } = renderHook(() => useGeocoding('London'));

    await waitFor(() => {
      expect(result.current.results.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.clearResults();
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
