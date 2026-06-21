import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HEADER_CONTENT_HEIGHT } from '../hooks/useHideHeaderOnScroll';

interface AnimatedScreenHeaderProps {
  title: string;
  translateY: Animated.AnimatedInterpolation<number>;
}

export function AnimatedScreenHeader({
  title,
  translateY,
}: AnimatedScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + HEADER_CONTENT_HEIGHT;

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          transform: [{ translateY }],
        },
      ]}>
      <View
        pointerEvents="none"
        style={[
          styles.titleWrapper,
          { top: insets.top, height: HEADER_CONTENT_HEIGHT },
        ]}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2563eb',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1d4ed8',
  },
  titleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    width: '100%',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
});
