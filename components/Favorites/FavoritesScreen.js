import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ApiService from '../../services/ApiService';
import MovieListItem from '../../components/MovieListItem'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useNavigation } from '@react-navigation/native'; 

const FavoritesScreen = () => {
  const navigation = useNavigation(); 
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        if (favorites) {
          const parsedFavorites = JSON.parse(favorites);
          const movies = await Promise.all(parsedFavorites.map(async id => {
            return await ApiService.getMovieDetail(id);
          }));
          setFavoriteMovies(movies);
        }
      } catch (error) {
        console.error('Error al obtener las peliculasd:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFavoriteMovies();
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Películas Favoritas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.moviesContainer}>
          {favoriteMovies.length > 0 ? (
            favoriteMovies.map(movie => (
              <MovieListItem key={movie.imdbID} movie={movie} />
            ))
          ) : (
            <Text style={styles.emptyText}>No existen favoritos.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  moviesContainer: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FavoritesScreen;
