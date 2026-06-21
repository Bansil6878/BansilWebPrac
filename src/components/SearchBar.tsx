import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search by name...',
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {value.length > 0 ? (
          <Pressable
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={8}
            accessibilityLabel="Clear search">
            <XMarkIcon size={20} color="#6b7280" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    color: '#111827',
  },
  clearButton: {
    padding: 6,
  },
});
