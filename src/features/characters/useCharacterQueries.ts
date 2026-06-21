import { useInfiniteQuery, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { isRateLimitError } from '../../services/apiClient';
import { useDebounce } from '../../hooks/useDebounce';
import {
  fetchCharacterById,
  fetchCharacters,
  fetchEpisodeById,
} from '../../services/rickMortyApi';
import { useAppSelector } from '../../store/hooks';
import {
  CharacterFilters,
  CharacterGender,
  CharacterStatus,
} from '../../types/api.types';

function buildCharacterFilters(
  search: string,
  status: CharacterStatus | '',
  gender: CharacterGender | '',
  page: number,
): CharacterFilters {
  const filters: CharacterFilters = { page };

  if (search.trim()) {
    filters.name = search.trim();
  }
  if (status) {
    filters.status = status;
  }
  if (gender) {
    filters.gender = gender;
  }

  return filters;
}

export function useCharacterList() {
  const queryClient = useQueryClient();
  const { search, status, gender } = useAppSelector(state => state.filters);
  const debouncedSearch = useDebounce(search, 300);
  const queryKey = ['characters', debouncedSearch, status, gender] as const;

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchCharacters(
        buildCharacterFilters(debouncedSearch, status, gender, pageParam),
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.info.next) {
        return undefined;
      }
      return allPages.length + 1;
    },
    retry: false,
  });

  const resetToFirstPage = useCallback(async () => {
    await queryClient.resetQueries({ queryKey });
  }, [queryClient, queryKey]);

  const fetchNextPageSafe = useCallback(async () => {
    try {
      await query.fetchNextPage();
    } catch (error) {
      if (isRateLimitError(error)) {
        await resetToFirstPage();
      }
    }
  }, [query, resetToFirstPage]);

  const refetchFromStart = useCallback(async () => {
    if (query.isError && isRateLimitError(query.error)) {
      await resetToFirstPage();
      return;
    }
    await query.refetch();
  }, [query, resetToFirstPage]);

  return {
    ...query,
    fetchNextPage: fetchNextPageSafe,
    refetch: refetchFromStart,
  };
}

export function useCharacterDetail(characterId: number) {
  return useQuery({
    queryKey: ['character', characterId],
    queryFn: () => fetchCharacterById(characterId),
    enabled: characterId > 0,
  });
}

function parseEpisodeId(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

/** Fetch episode details for a character's episode URLs */
export function useCharacterEpisodes(episodeUrls: string[]) {
  const episodeIds = episodeUrls.map(parseEpisodeId);

  return useQueries({
    queries: episodeIds.map(id => ({
      queryKey: ['episode', id],
      queryFn: () => fetchEpisodeById(id),
      enabled: id > 0,
      staleTime: 1000 * 60 * 10,
    })),
  });
}
