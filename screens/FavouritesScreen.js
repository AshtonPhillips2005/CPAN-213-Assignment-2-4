// screens/FavouritesScreen.js
import React, { useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Alert,
} from 'react-native';
import { FavouritesContext } from '../App';
import TouchableScale from '../components/TouchableScale';

export default function FavouritesScreen() {
  const { favourites, removeFavourite } = useContext(FavouritesContext);

  // Simple list enter animation (third animated value)
  const listOpacity = useRef(new Animated.Value(0)).current;

  // Same animation as above ^^^ for Header
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const confirmRemove = (id, title) => {
    Alert.alert(
      'Remove favourite?',
      `Do you want to remove "${title}" from your Favourites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFavourite(id),
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Animated.View style={{ opacity: listOpacity }}>
      <View style={styles.card}>
        <Image source={{ uri: item.posterURL }} style={styles.poster} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{item.title}</Text>
          // <Text style={styles.sub}>{item.year}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableScale
              onPress={() => confirmRemove(item.id, item.title)}
              style={[styles.btn, { backgroundColor: '#ef4444' }]}>
              Remove
            </TouchableScale>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.heading, { opacity: headerOpacity }]}>
        Your favourites
      </Animated.Text>
      <FlatList
        data={favourites}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No favourites yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f172a' },
  heading: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    width: 64,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#0b1220',
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sub: { color: '#cbd5e1', marginTop: 2 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 24 },
});
