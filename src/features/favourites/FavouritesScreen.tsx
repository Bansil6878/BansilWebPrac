import { useCallback } from 'react';
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
import { useHideHeaderOnScroll } from '../../hooks/useHideHeaderOnScroll';
import { removeFavouriteFromDb } from '../../store/favouritesSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Character } from '../../types/api.types';

interface FavouriteItemProps {
  character: Character;
  onRemove: () => void;
}

function FavouriteItem({ character, onRemove }: FavouriteItemProps) {
  return (
    <View style={styles.item}>
      <CharacterCard character={character} />
      <Pressable style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeText}>Remove</Text>
      </Pressable>
    </View>
  );
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Character>);

export function FavouritesScreen() {
  const dispatch = useAppDispatch();
  const { onScroll, headerTranslateY, headerHeight } = useHideHeaderOnScroll();
  const { items, isLoading, isLoaded } = useAppSelector(
    state => state.favourites,
  );

  const handleRemove = useCallback(
    (characterId: number) => {
      dispatch(removeFavouriteFromDb(characterId));
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item }: { item: Character }) => (
      <FavouriteItem
        character={item}
        onRemove={() => handleRemove(item.id)}
      />
    ),
    [handleRemove],
  );

  const listHeader = (
    <Text style={styles.subtitle}>
      Saved on this device. Works offline with no API calls.
    </Text>
  );

  if (isLoading && !isLoaded) {
    return (
      <View style={styles.container}>
        <AnimatedScreenHeader title="Favourites" translateY={headerTranslateY} />
        <View style={[styles.center, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedScreenHeader title="Favourites" translateY={headerTranslateY} />

      <AnimatedFlatList
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <EmptyState message="No favourites yet. Add characters from the detail screen." />
        }
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          { paddingTop: headerHeight },
          items.length === 0 ? styles.emptyList : undefined,
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
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  item: {
    marginBottom: 4,
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  removeText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyList: {
    flexGrow: 1,
  },
});
