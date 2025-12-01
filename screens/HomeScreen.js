// screens/HomeScreen.js
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  FlatList,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import TouchableScale from '../components/TouchableScale';

const GENRES = [
  { key: 'action', label: 'Action' },
  { key: 'animation', label: 'Animation' },
  { key: 'comedy', label: 'Comedy' },
  { key: 'drama', label: 'Drama' },
  { key: 'horror', label: 'Horror' },
  { key: 'family', label: 'Family' },
];

const buildUrl = (genre) => `https://api.sampleapis.com/movies/${genre}`;

export default function HomeScreen({ navigation }) {
  const [genre, setGenre] = useState(GENRES[0].key);
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter(
      (m) =>
        (m.title || '').toLowerCase().includes(q) 
        // || (m.plot || '').toLowerCase().includes(q)
    );
  }, [movies, query]);

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start();
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      startProgress();
      const res = await fetch(buildUrl(genre));
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((item, idx) => ({
        id: item.id ?? `${genre}-${idx}`,
        title: item.title ?? 'Untitled',
        // plot: item.plot ?? '',
        posterURL:
          item.posterURL ||
          item.poster ||
          item.imageURL ||
          'https://via.placeholder.com/300x450.png?text=No+Poster',
      }));
      setMovies(normalized);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
      Animated.timing(progress, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => progress.setValue(0));
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderItem = ({ item }) => (
    <TouchableScale
      onPress={() => navigation.navigate('Details', { movie: item })}
      style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: item.posterURL }} style={styles.poster} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{item.title}</Text>
          // <Text style={styles.sub}>{item.year}</Text>
          // <Text numberOfLines={2} style={styles.plot}>
          //   {item.plot}
          // </Text>
        </View>
      </View>
    </TouchableScale>
  );



  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎬 Movie Finder</Text>

      <TouchableScale
        style={styles.navBtn}
        onPress={() => navigation.navigate('Favourites')}>
        View Favourites
      </TouchableScale>

      {/* Genre buttons in a 6x2 grid */}
      <View style={styles.genreGrid}>
        {GENRES.map((g) => {
          const active = genre === g.key;
          return (
            <View key={g.key} style={styles.genreCell}>
              <TouchableScale
                onPress={() => setGenre(g.key)}
                style={[styles.genreBtn, active && styles.genreBtnActive]}>
                {g.label}
              </TouchableScale>
            </View>
          );
        })}
      </View>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search or filter (e.g., Batman)"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        <TouchableScale
          onPress={fetchMovies}
          style={[styles.searchBtn, loading && { opacity: 0.8 }]}
          disabled={loading}>
          {loading ? '...' : 'Search'}
        </TouchableScale>
      </View>

      {loading && (
        <View style={styles.progressWrap}>
          <Animated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No results yet. Choose a genre and tap Search.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f172a' },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  navBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 16,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genreCell: {
    width: '30%', // 3 per row
    marginBottom: 12,
    alignItems: 'center',
  },
  genreBtn: {
    backgroundColor: '#1f2937',
    paddingVertical: 10,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  genreBtnActive: { backgroundColor: '#2563eb' },
  searchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: '#111827',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginRight: 8,
  },
  searchBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    textAlign: 'center',
  },
  progressWrap: {
    height: 6,
    backgroundColor: '#1f2937',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: { height: '100%', backgroundColor: '#22d3ee' },
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  poster: {
    width: 72,
    height: 108,
    borderRadius: 8,
    backgroundColor: '#0b1220',
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sub: { color: '#cbd5e1', marginTop: 2 },
  // plot: { color: '#94a3b8', marginTop: 6 },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 24 },
});
