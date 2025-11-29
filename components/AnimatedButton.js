import React, { useRef } from "react";
import {
  Animated,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
} from "react-native";

export default function AnimatedButton({ title, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start(() => onPress());
  };

  return (
    <TouchableWithoutFeedback onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[styles.btn, { transform: [{ scale }] }]}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  text: { color: "white", textAlign: "center", fontWeight: "bold" },
});