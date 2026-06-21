import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AnimatedScreenHeader } from '../../components/AnimatedScreenHeader';
import { EmptyState } from '../../components/EmptyState';
import { EpisodeRow } from '../../components/EpisodeRow';
import { useHideHeaderOnScroll } from '../../hooks/useHideHeaderOnScroll';
import { Episode } from '../../types/api.types';
import { groupEpisodesBySeason } from './episodeUtils';
import { useEpisodes } from './useEpisodeQueries';

type EpisodeSection = ReturnType<typeof groupEpisodesBySeason>[number];

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList<Episode, EpisodeSection>,
);

export function EpisodesScreen() {
  const { onScroll, headerTranslateY, headerHeight } = useHideHeaderOnScroll();
  const [page, setPage] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const { data, isLoading, isError, error, isFetching, refetch } =
    useEpisodes(page);

  const totalPages = data?.info.pages ?? 1;
  const hasNextPage = page < totalPages;
  const isFetchingNextPage = isFetching && page > 1;

  useEffect(() => {
    if (!data?.results) {
      return;
    }

    setEpisodes(prev => {
      if (page === 1) {
        return data.results;
      }
      const existingIds = new Set(prev.map(item => item.id));
      const newItems = data.results.filter(item => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });
  }, [data, page]);

  const sections = useMemo(
    () => groupEpisodesBySeason(episodes),
    [episodes],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) {
      setPage(current => current + 1);
    }
  }, [hasNextPage, isFetching]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    setEpisodes([]);
    refetch();
  }, [refetch]);

  if (isLoading && episodes.length === 0) {
    return (
      <View style={styles.container}>
        <AnimatedScreenHeader title="Episodes" translateY={headerTranslateY} />
        <View style={[styles.center, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </View>
    );
  }

  if (isError && episodes.length === 0) {
    return (
      <View style={styles.container}>
        <AnimatedScreenHeader title="Episodes" translateY={headerTranslateY} />
        <View style={[styles.center, { paddingTop: headerHeight }]}>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Failed to load episodes'}
          </Text>
          <Pressable style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedScreenHeader title="Episodes" translateY={headerTranslateY} />

      <AnimatedSectionList
        sections={sections}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <EpisodeRow episode={item} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState message="No episodes found." />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footer} color="#2563eb" />
          ) : null
        }
        onScroll={onScroll}
        scrollEventThrottle={16}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshing={isFetching && page === 1}
        onRefresh={handleRefresh}
        contentContainerStyle={[
          { paddingTop: headerHeight },
          episodes.length === 0 ? styles.emptyList : undefined,
        ]}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  list: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sectionHeader: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  footer: {
    paddingVertical: 16,
  },
  errorText: {
    fontSize: 15,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyList: {
    flexGrow: 1,
  },
});
