import {
  Character,
  CharacterFilters,
  Episode,
  EpisodeFilters,
  Location,
  LocationFilters,
  PaginatedResponse,
} from '../types/api.types';
import { apiClient } from './apiClient';

function buildParams(
  filters: CharacterFilters | EpisodeFilters | LocationFilters,
): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') {
      params[key] = value;
    }
  }

  return params;
}

export async function fetchCharacters(
  filters: CharacterFilters = {},
): Promise<PaginatedResponse<Character>> {
  try {
    const response = await apiClient.get<PaginatedResponse<Character>>(
      '/character',
      { params: buildParams(filters) },
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message === 'No results found.') {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    throw error;
  }
}

export async function fetchCharacterById(id: number): Promise<Character> {
  const response = await apiClient.get<Character>(`/character/${id}`);
  return response.data;
}

export async function fetchEpisodes(
  filters: EpisodeFilters = {},
): Promise<PaginatedResponse<Episode>> {
  const response = await apiClient.get<PaginatedResponse<Episode>>('/episode', {
    params: buildParams(filters),
  });
  return response.data;
}

export async function fetchEpisodeById(id: number): Promise<Episode> {
  const response = await apiClient.get<Episode>(`/episode/${id}`);
  return response.data;
}

export async function fetchLocations(
  filters: LocationFilters = {},
): Promise<PaginatedResponse<Location>> {
  const response = await apiClient.get<PaginatedResponse<Location>>(
    '/location',
    { params: buildParams(filters) },
  );
  return response.data;
}

export async function fetchLocationById(id: number): Promise<Location> {
  const response = await apiClient.get<Location>(`/location/${id}`);
  return response.data;
}
