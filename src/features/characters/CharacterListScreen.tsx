import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
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
import { CharacterCard } from '../../components/CharacterCard';
import { EmptyState } from '../../components/EmptyState';
import { FilterBar } from '../../components/FilterBar';
import { SearchBar } from '../../components/SearchBar';
import { useHideHeaderOnScroll } from '../../hooks/useHideHeaderOnScroll';
import { CharactersStackParamList } from '../../navigation/types';
import { setSearch } from '../../store/filterSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Character } from '../../types/api.types';
import { useCharacterList } from './useCharacterQueries';

type Props = NativeStackScreenProps<CharactersStackParamList, 'CharacterList'>;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Character>);

export function CharacterListScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const search = useAppSelector(state => state.filters.search);
  const { onScroll, headerTranslateY, headerHeight } = useHideHeaderOnScroll();
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useCharacterList();

  const characters = useMemo(
    () => data?.pages.flatMap(page => page.results) ?? [],
    [data],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Character }) => (
      <CharacterCard
        character={item}
        onPress={() =>
          navigation.navigate('CharacterDetail', { characterId: item.id })
        }
      />
    ),
    [navigation],
  );

  const showInitialLoading = isLoading && characters.length === 0;

  const listHeader = (
    <View>
      <SearchBar
        value={search}
        onChangeText={text => dispatch(setSearch(text))}
      />
      <FilterBar />
    </View>
  );

  const listEmptyComponent = useMemo(() => {
    if (showInitialLoading) {
      return (
        <View style={styles.inlineCenter}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.inlineCenter}>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Failed to load characters'}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <EmptyState message="No characters found. Clear search or change filters." />
    );
  }, [showInitialLoading, isError, error, refetch]);

  return (
    <View style={styles.container}>
      <AnimatedScreenHeader
        title="Characters"
        translateY={headerTranslateY}
      />

      <AnimatedFlatList
        data={isError ? [] : characters}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.footer} color="#2563eb" />
          ) : null
        }
        onScroll={onScroll}
        scrollEventThrottle={16}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={[
          { paddingTop: headerHeight },
          characters.length === 0 && !showInitialLoading
            ? styles.listContentEmpty
            : styles.listContent,
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
  listContent: {
    paddingBottom: 8,
  },
  listContentEmpty: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  inlineCenter: {
    alignItems: 'center',
    justifyContent: 'center',
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
  footer: {
    paddingVertical: 16,
  },
});
