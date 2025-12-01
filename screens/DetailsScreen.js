// screens/DetailsScreen.js
import React, { useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Linking,
} from 'react-native';
import TouchableScale from '../components/TouchableScale';
import { FavouritesContext } from '../App';

export default function DetailsScreen({ route, navigation }) {
  const { movie } = route.params;
  const { favourites, addFavourite, removeFavourite } =
    useContext(FavouritesContext);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const responder = PanResponder.create({
    //listen for gestures (kinda like event listeners)
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: drag.x, dy: drag.y }], {
      //view follows finger
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gesture) => {
      //if dragged right, go to prev screen
      if (gesture.dx > 120 && Math.abs(gesture.dy) < 60) {
        navigation.goBack();
      } else {
        Animated.spring(drag, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          speed: 20,
          bounciness: 8,
        }).start();
      }
    },
  });

  // Check if movie is already in favourites
  const isFavourite = favourites.some((f) => f.id === movie.id);

  const toggleFavourite = () => {
    if (isFavourite) {
      removeFavourite(movie.id);
    } else {
      addFavourite(movie);
    }
  };

  const openImdb = () => {
    if (movie.imdbId) {
      Linking.openURL(`https://www.imdb.com/title/${movie.imdbId}`);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.header, { opacity: headerOpacity }]}>
        {movie.title}
      </Animated.Text>
      <Animated.View
        style={[
          styles.posterWrap,
          { transform: [{ translateX: drag.x }, { translateY: drag.y }] },
        ]}
        {...responder.panHandlers}>
        <Image source={{ uri: movie.posterURL }} style={styles.poster} />
        <Text style={styles.dragHint}>Drag me →right→ to go back</Text>
      </Animated.View>
      <View style={styles.actions}>
        <TouchableScale
          onPress={toggleFavourite}
          style={[
            styles.actionBtn,
            { backgroundColor: isFavourite ? '#ef4444' : '#10b981' },
          ]}>
          {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
        </TouchableScale>
        <TouchableScale
          onPress={() => navigation.navigate('Favourites')}
          style={[styles.actionBtn, { backgroundColor: '#64748b' }]}>
          View Favourites
        </TouchableScale>
      </View>
      {movie.imdbId && (
        <TouchableScale
          onPress={openImdb}
          style={[
            styles.singleBtn,
            { backgroundColor: '#facc15', marginTop: 12 },
          ]}>
          View on IMDb
        </TouchableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f172a' },
  header: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  posterWrap: { alignSelf: 'center', alignItems: 'center', marginVertical: 8 },
  poster: {
    width: 220,
    height: 330,
    borderRadius: 12,
    backgroundColor: '#121a2a',
  },
  dragHint: { color: '#93c5fd', marginTop: 8 },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  singleBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actions: { flexDirection: 'row', marginTop: 20 },
});
