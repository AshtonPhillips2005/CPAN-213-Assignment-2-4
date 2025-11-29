import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function MovieDetails({ route }) {
  const { movie } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    Alert.alert("Movie Selected", movie.Title);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.Title}</Text>

      <TouchableOpacity onPress={showAlert}>
        <Image
          source={{ uri: movie.Poster }}
          style={{ width: 200, height: 300, borderRadius: 10 }}
        />
      </TouchableOpacity>

      <Button title="Show More Info" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>IMDB ID: {movie.imdbID}</Text>

          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  modalContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalText: { fontSize: 20 },
});