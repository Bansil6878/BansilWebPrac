import { useRef } from 'react';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HEADER_CONTENT_HEIGHT = 60;

export function useHideHeaderOnScroll() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const totalHeaderHeight = insets.top + HEADER_CONTENT_HEIGHT;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true },
  );

  const clampedScroll = Animated.diffClamp(
    scrollY,
    0,
    HEADER_CONTENT_HEIGHT,
  );

  const headerTranslateY = clampedScroll.interpolate({
    inputRange: [0, HEADER_CONTENT_HEIGHT],
    outputRange: [0, -totalHeaderHeight],
    extrapolate: 'clamp',
  });

  return {
    onScroll,
    headerTranslateY,
    headerHeight: totalHeaderHeight,
  };
}
