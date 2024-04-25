import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import ApiService from '../../services/ApiService'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const MovieDetailsScreen = ({ route }) => {
  const { imdbID } = route.params;
  const [movieDetail, setMovieDetail] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); 

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const movieDetailData = await ApiService.getMovieDetail(imdbID);
        setMovieDetail(movieDetailData);
        const favorites = await AsyncStorage.getItem('favorites');
        if (favorites) {
          const parsedFavorites = JSON.parse(favorites);
          setIsFavorite(parsedFavorites.includes(imdbID));
        }
      } catch (error) {
        console.error('Error al obtener el detalle de las peliculas:', error);
      }
    };

    fetchMovieDetail();

    return () => {
    
    };
  }, [imdbID]);


  const handleFavoritePress = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let parsedFavorites = [];
      if (favorites) {
        parsedFavorites = JSON.parse(favorites);
      }
      if (isFavorite) {        
        const updatedFavorites = parsedFavorites.filter(id => id !== imdbID);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(false);
      } else {        
        const updatedFavorites = [...parsedFavorites, imdbID];
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error favorites:', error);
      
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {movieDetail ? (
        <>
          <Text style={styles.title}>Título: {movieDetail.Title}</Text>
          <Text style={styles.label}>Año: {movieDetail.Year}</Text>
          <Text style={styles.label}>Rated: {movieDetail.Rated}</Text>
          <Text style={styles.label}>Género: {movieDetail.Genre}</Text>
          <Text style={styles.label}>Director: {movieDetail.Director}</Text>
          <Text style={styles.label}>Actores: {movieDetail.Actors}</Text>
          <Text style={styles.label}>Sinopsis:</Text>
          <Text style={styles.plot}>{movieDetail.Plot}</Text>       
          <TouchableOpacity onPress={handleFavoritePress}>
            <MaterialIcons name={isFavorite ? 'favorite' : 'favorite-border'} size={30} color={isFavorite ? 'red' : 'gray'} />
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  plot: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default MovieDetailsScreen;
