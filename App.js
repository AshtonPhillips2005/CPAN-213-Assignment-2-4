// App.js
import { StyleSheet, Text, View } from 'react-native';
// You can import supported modules from npm
import { Card } from 'react-native-paper';
// or any files within the Snack
import AssetExample from './components/AssetExample';
import React, { useEffect, useRef, useState, createContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import FavouritesScreen from './screens/FavouritesScreen';

export const FavouritesContext = createContext({
  favourites: [],
  addFavourite: () => {},
  removeFavourite: () => {},
});

const Stack = createStackNavigator();

export default function App() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    // Inform the user when the app starts (first confirmation/notification)
    setTimeout(() => {
      Alert.alert(
        'Welcome!',
        'Search for a genre and tap a movie for details. Add favourites from the details page.'
      );
    }, 400);
  }, []);

  const addFavourite = (item) => {
    setFavourites((prev) => {
      if (prev.find((f) => f.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFavourite = (id) => {
    setFavourites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Movie Finder' }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{ title: 'Details' }}
          />
          <Stack.Screen
            name="Favourites"
            component={FavouritesScreen}
            options={{ title: 'Favourites' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavouritesContext.Provider>
  );
}