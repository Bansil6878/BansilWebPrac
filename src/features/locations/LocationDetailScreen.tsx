import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { LocationsStackParamList } from '../../navigation/types';
import { Character } from '../../types/api.types';
import {
  useLocationDetail,
  useLocationResidents,
} from './useLocationQueries';

type Props = NativeStackScreenProps<
  LocationsStackParamList,
  'LocationDetail'
>;

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ResidentRow({ character }: { character: Character }) {
  return (
    <View style={styles.residentRow}>
      <Image source={{ uri: character.image }} style={styles.residentImage} />
      <View style={styles.residentContent}>
        <Text style={styles.residentName}>{character.name}</Text>
        <Text style={styles.residentMeta}>
          {character.status} · {character.species}
        </Text>
      </View>
    </View>
  );
}

export function LocationDetailScreen({ route, navigation }: Props) {
  const { locationId } = route.params;
  const { data: location, isLoading, isError, error } =
    useLocationDetail(locationId);
  const residentQueries = useLocationResidents(location?.residents ?? []);

  useEffect(() => {
    if (location) {
      navigation.setOptions({ title: location.name });
    }
  }, [location, navigation]);

  const residents = residentQueries
    .map(query => query.data)
    .filter((character): character is Character => character !== undefined);

  const isLoadingResidents = residentQueries.some(query => query.isLoading);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isError || !location) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : 'Location not found'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <InfoRow label="Type" value={location.type} />
        <InfoRow label="Dimension" value={location.dimension} />
        <InfoRow
          label="Residents"
          value={String(location.residents.length)}
        />
      </View>

      {location.residents.length === 0 ? (
        <EmptyState message="No residents at this location." />
      ) : (
        <>
          {isLoadingResidents && residents.length === 0 ? (
            <ActivityIndicator style={styles.loadingResidents} color="#2563eb" />
          ) : null}
          <FlatList
            data={residents}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <ResidentRow character={item} />}
            contentContainerStyle={styles.residentList}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  loadingResidents: {
    paddingVertical: 16,
  },
  residentList: {
    paddingBottom: 24,
  },
  residentRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  residentImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#e5e7eb',
  },
  residentContent: {
    flex: 1,
    justifyContent: 'center',
  },
  residentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  residentMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 15,
    color: '#ef4444',
    textAlign: 'center',
    padding: 24,
  },
});
