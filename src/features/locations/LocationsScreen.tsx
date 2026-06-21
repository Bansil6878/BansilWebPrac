import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AnimatedScreenHeader } from '../../components/AnimatedScreenHeader';
import { EmptyState } from '../../components/EmptyState';
import { LocationCard } from '../../components/LocationCard';
import { useHideHeaderOnScroll } from '../../hooks/useHideHeaderOnScroll';
import { LocationsStackParamList } from '../../navigation/types';
import { Location } from '../../types/api.types';
import { useLocations } from './useLocationQueries';

type Props = NativeStackScreenProps<LocationsStackParamList, 'LocationList'>;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Location>);

export function LocationsScreen({ navigation }: Props) {
  const { onScroll, headerTranslateY, headerHeight } = useHideHeaderOnScroll();
  const [page, setPage] = useState(1);
  const [locations, setLocations] = useState<Location[]>([]);
  const { data, isLoading, isError, error, isFetching, refetch } =
    useLocations(page);

  const totalPages = data?.info.pages ?? 1;
  const hasNextPage = page < totalPages;
  const isFetchingNextPage = isFetching && page > 1;

  useEffect(() => {
    if (!data?.results) {
      return;
    }

    setLocations(prev => {
      if (page === 1) {
        return data.results;
      }
      const existingIds = new Set(prev.map(item => item.id));
      const newItems = data.results.filter(item => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });
  }, [data, page]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetching) {
      setPage(current => current + 1);
    }
  }, [hasNextPage, isFetching]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    setLocations([]);
    refetch();
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: Location }) => (
      <LocationCard
        location={item}
        onPress={() =>
          navigation.navigate('LocationDetail', { locationId: item.id })
        }
      />
    ),
    [navigation],
  );

  if (isLoading && locations.length === 0) {
    return (
      <View style={styles.container}>
        <AnimatedScreenHeader title="Locations" translateY={headerTranslateY} />
        <View style={[styles.center, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </View>
    );
  }

  if (isError && locations.length === 0) {
    return (
      <View style={styles.container}>
        <AnimatedScreenHeader title="Locations" translateY={headerTranslateY} />
        <View style={[styles.center, { paddingTop: headerHeight }]}>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Failed to load locations'}
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
      <AnimatedScreenHeader title="Locations" translateY={headerTranslateY} />

      <AnimatedFlatList
        data={locations}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState message="No locations found." />}
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
          locations.length === 0 ? styles.emptyList : undefined,
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
