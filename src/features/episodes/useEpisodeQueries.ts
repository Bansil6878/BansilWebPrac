import { useQuery } from '@tanstack/react-query';
import { fetchEpisodes } from '../../services/rickMortyApi';

export function useEpisodes(page: number) {
  return useQuery({
    queryKey: ['episodes', page],
    queryFn: () => fetchEpisodes({ page }),
    enabled: page > 0,
  });
}
