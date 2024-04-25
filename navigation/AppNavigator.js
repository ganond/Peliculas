import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import SearchScreen from '../components/Search/SearchScreen';
import FavoritesScreen from '../components/Favorites/FavoritesScreen';
import MovieDetailScreen from '../components/MovieDetails/MovieDetailsScreen';

const SearchStack = createStackNavigator();
const FavoritesStack = createStackNavigator();
const Tab = createBottomTabNavigator();


const SearchStackNavigator = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
    <SearchStack.Screen name="MovieDetailsScreen" component={MovieDetailScreen} /> 
  </SearchStack.Navigator>
);


const FavoritesStackNavigator = () => (
  <FavoritesStack.Navigator>
    <FavoritesStack.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
    <SearchStack.Screen name="MovieDetailsScreen" component={MovieDetailScreen} /> 
  </FavoritesStack.Navigator>
);

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'SearchStack') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'FavoritesStack') {
              iconName = focused ? 'heart' : 'heart-outline';
            }
          
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="SearchStack" component={SearchStackNavigator} options={{ title: 'Búsqueda' }} />
        <Tab.Screen name="FavoritesStack" component={FavoritesStackNavigator} options={{ title: 'Favoritos' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
