import { Episode } from '../../types/api.types';

export interface EpisodeSection {
  title: string;
  data: Episode[];
}

export function getSeasonLabel(episodeCode: string): string {
  const match = episodeCode.match(/^S(\d+)E/i);
  if (match) {
    return `Season ${Number(match[1])}`;
  }
  return 'Other';
}

export function groupEpisodesBySeason(episodes: Episode[]): EpisodeSection[] {
  const groups = new Map<string, Episode[]>();

  for (const episode of episodes) {
    const title = getSeasonLabel(episode.episode);
    const existing = groups.get(title) ?? [];
    existing.push(episode);
    groups.set(title, existing);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const numA = Number(a.replace(/\D/g, '')) || 0;
      const numB = Number(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    })
    .map(([title, data]) => ({ title, data }));
}
