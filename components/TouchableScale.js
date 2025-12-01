// components/TouchableScale.js
import React, { useRef } from 'react';
import { Animated, Pressable, View, Text, StyleSheet } from 'react-native';

// custom Touchable with scale animation on press (different from standard examples)
export default function TouchableScale({ children, onPress, style, disabled }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(0.96)}
      onPressOut={() => animateTo(1)}
      disabled={disabled}
      style={({ pressed }) => [
        style,
        pressed && { opacity: 0.95 },
      ]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {typeof children === 'string' ? <Text style={styles.label}>{children}</Text> : children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});
