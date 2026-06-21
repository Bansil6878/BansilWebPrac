import { StyleSheet, Text, View } from 'react-native';
import { Episode } from '../types/api.types';

interface EpisodeRowProps {
  episode: Episode;
}

export function EpisodeRow({ episode }: EpisodeRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.code}>{episode.episode}</Text>
      <View style={styles.content}>
        <Text style={styles.name}>{episode.name}</Text>
        <Text style={styles.date}>{episode.air_date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  code: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
    width: 56,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#6b7280',
  },
});
