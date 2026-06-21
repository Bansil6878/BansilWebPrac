import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Character } from '../types/api.types';

interface CharacterCardProps {
  character: Character;
  onPress?: () => void;
}

function getStatusColor(status: Character['status']): string {
  if (status === 'Alive') {
    return '#22c55e';
  }
  if (status === 'Dead') {
    return '#ef4444';
  }
  return '#9ca3af';
}

export function CharacterCard({ character, onPress }: CharacterCardProps) {
  const content = (
    <>
      <Image source={{ uri: character.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{character.name}</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(character.status) },
            ]}
          />
          <Text style={styles.meta}>
            {character.status} - {character.species}
          </Text>
        </View>
        <Text style={styles.location} numberOfLines={1}>
          {character.location.name}
        </Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={styles.card}
        onPress={onPress}
        android_ripple={{ color: '#e5e7eb' }}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  image: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  meta: {
    fontSize: 13,
    color: '#4b5563',
  },
  location: {
    fontSize: 13,
    color: '#6b7280',
  },
});
