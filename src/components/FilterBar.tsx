import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { setGender, setStatus } from '../store/filterSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { CharacterGender, CharacterStatus } from '../types/api.types';

const STATUS_OPTIONS: Array<{ label: string; value: CharacterStatus | '' }> = [
  { label: 'All', value: '' },
  { label: 'Alive', value: 'Alive' },
  { label: 'Dead', value: 'Dead' },
  { label: 'Unknown', value: 'unknown' },
];

const GENDER_OPTIONS: Array<{ label: string; value: CharacterGender | '' }> = [
  { label: 'All', value: '' },
  { label: 'Female', value: 'Female' },
  { label: 'Male', value: 'Male' },
  { label: 'Genderless', value: 'Genderless' },
  { label: 'Unknown', value: 'unknown' },
];

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

function FilterLabel({ text }: { text: string }) {
  return <Text style={styles.groupLabel}>{text}</Text>;
}

export function FilterBar() {
  const dispatch = useAppDispatch();
  const { status, gender } = useAppSelector(state => state.filters);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}>
      <FilterLabel text="Status" />
      {STATUS_OPTIONS.map(option => (
        <FilterChip
          key={`status-${option.label}`}
          label={option.label}
          selected={status === option.value}
          onPress={() => dispatch(setStatus(option.value))}
        />
      ))}
      <Text style={styles.divider}>|</Text>
      <FilterLabel text="Gender" />
      {GENDER_OPTIONS.map(option => (
        <FilterChip
          key={`gender-${option.label}`}
          label={option.label}
          selected={gender === option.value}
          onPress={() => dispatch(setGender(option.value))}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    padding:5, 
    paddingVertical: 8,
  },
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    marginRight: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginRight: 6,
  },
  chipSelected: {
    backgroundColor: '#2563eb',
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  divider: {
    marginRight: 8,
    color: '#d1d5db',
  },
});
