import { useQueries, useQuery } from '@tanstack/react-query';
import {
  fetchCharacterById,
  fetchLocationById,
  fetchLocations,
} from '../../services/rickMortyApi';

export function useLocations(page: number) {
  return useQuery({
    queryKey: ['locations', page],
    queryFn: () => fetchLocations({ page }),
    enabled: page > 0,
  });
}

export function useLocationDetail(locationId: number) {
  return useQuery({
    queryKey: ['location', locationId],
    queryFn: () => fetchLocationById(locationId),
    enabled: locationId > 0,
  });
}

function parseCharacterId(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

export function useLocationResidents(residentUrls: string[]) {
  const characterIds = residentUrls
    .map(parseCharacterId)
    .filter(id => id > 0);

  return useQueries({
    queries: characterIds.map(id => ({
      queryKey: ['character', id],
      queryFn: () => fetchCharacterById(id),
      staleTime: 1000 * 60 * 10,
    })),
  });
}
