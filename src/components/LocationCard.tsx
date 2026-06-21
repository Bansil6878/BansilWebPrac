import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Location } from '../types/api.types';

interface LocationCardProps {
  location: Location;
  onPress: () => void;
}

export function LocationCard({ location, onPress }: LocationCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: '#e5e7eb' }}>
      <Text style={styles.name}>{location.name}</Text>
      <Text style={styles.meta}>
        {location.type} · {location.dimension}
      </Text>
      <Text style={styles.residents}>
        {location.residents.length} resident
        {location.residents.length === 1 ? '' : 's'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  residents: {
    fontSize: 12,
    color: '#6b7280',
  },
});
