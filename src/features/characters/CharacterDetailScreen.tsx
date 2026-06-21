import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CharactersStackParamList } from '../../navigation/types';
import {
  addFavouriteToDb,
  removeFavouriteFromDb,
  selectIsFavourite,
} from '../../store/favouritesSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Episode } from '../../types/api.types';
import {
  useCharacterDetail,
  useCharacterEpisodes,
} from './useCharacterQueries';

type Props = NativeStackScreenProps<
  CharactersStackParamList,
  'CharacterDetail'
>;

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function EpisodeItem({ episode }: { episode: Episode }) {
  return (
    <View style={styles.episodeCard}>
      <Text style={styles.episodeCode}>{episode.episode}</Text>
      <Text style={styles.episodeName} numberOfLines={2}>
        {episode.name}
      </Text>
      <Text style={styles.episodeDate}>{episode.air_date}</Text>
    </View>
  );
}

export function CharacterDetailScreen({ route, navigation }: Props) {
  const { characterId } = route.params;
  const dispatch = useAppDispatch();
  const favourites = useAppSelector(state => state.favourites.items);
  const { data: character, isLoading, isError, error } =
    useCharacterDetail(characterId);
  const episodeQueries = useCharacterEpisodes(character?.episode ?? []);
  const isFavourite = selectIsFavourite(favourites, characterId);

  useEffect(() => {
    if (character) {
      navigation.setOptions({ title: character.name });
    }
  }, [character, navigation]);

  const episodes = episodeQueries
    .map(query => query.data)
    .filter((episode): episode is Episode => episode !== undefined);

  const toggleFavourite = () => {
    if (!character) {
      return;
    }
    if (isFavourite) {
      dispatch(removeFavouriteFromDb(characterId));
    } else {
      dispatch(addFavouriteToDb(character));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isError || !character) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : 'Character not found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <Pressable style={styles.favButton} onPress={toggleFavourite}>
        <Text style={styles.favButtonText}>
          {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
        </Text>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>
        <InfoRow label="Status" value={character.status} />
        <InfoRow label="Species" value={character.species} />
        <InfoRow label="Type" value={character.type || 'Unknown'} />
        <InfoRow label="Gender" value={character.gender} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Origin</Text>
        <Text style={styles.locationText}>{character.origin.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.locationText}>{character.location.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Episodes ({character.episode.length})
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.episodeList}>
          {episodes.map(episode => (
            <EpisodeItem key={episode.id} episode={episode} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#e5e7eb',
  },
  favButton: {
    margin: 16,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  favButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
  },
  episodeList: {
    paddingRight: 8,
  },
  episodeCard: {
    width: 140,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
  },
  episodeCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },
  episodeName: {
    fontSize: 13,
    color: '#111827',
    marginBottom: 4,
  },
  episodeDate: {
    fontSize: 11,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 15,
    color: '#ef4444',
    textAlign: 'center',
    padding: 24,
  },
});
