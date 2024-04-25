import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, ActivityIndicator, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import ApiService from '../../services/ApiService';
import { useNavigation } from '@react-navigation/native';


const renderItem = ({ item, handleMoviePress }) => (
  <TouchableOpacity onPress={() => handleMoviePress(item.imdbID)}>
    <ListItem containerStyle={styles.listItemContainer}>
      <ListItem.Content style={styles.listItemContent}>
        {item.Poster !== 'N/A' ? (
          <View style={styles.posterContainer}>
            <Image source={{ uri: item.Poster }} style={styles.posterImage} />
          </View>
        ) : (
          <View style={styles.posterContainer}>
            <Text style={styles.noPosterText}>No disponible</Text>
          </View>
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.Title}</Text>
          <Text style={styles.year}>{item.Year}</Text>
        </View>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  </TouchableOpacity>
);

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMoreResults, setNoMoreResults] = useState(false);
  const [yearFilter, setYearFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({}); 

  const navigation = useNavigation();

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      fetchMovies();
    }
  }, [page]);

  
  const [searching, setSearching] = useState(false);

  const fetchMovies = async () => {
   
    if (searching) {
      return;
    }
    
    try {
      setSearching(true); 
      setLoading(true);
      const newResults = await ApiService.advancedSearchMovies(searchTerm, yearFilter, page);
     
      const filteredResults = newResults.filter(newMovie => newMovie.Poster !== 'N/A');
      
      if (filteredResults.length > 0) {
      
        const uniqueResults = filteredResults.filter(newMovie => !searchResults.some(oldMovie => oldMovie.imdbID === newMovie.imdbID));
        setSearchResults(prevResults => [...prevResults, ...uniqueResults]);
        setPage(prevPage => prevPage + 1);
      } else if (newResults.length === 0) {
        
        setNoMoreResults(true);
        setError('No hay más resultados');
      }
      
      setError(null);
    } catch (error) {
      console.error('Error al obtener películas:', error);
      let errorMessage = 'Hubo un error al buscar películas. Por favor, inténtalo de nuevo más tarde.';
      if (error.response && error.response.data && error.response.data.Error) {
        errorMessage = error.response.data.Error;
        if (error.response.data.Error === "Pelicula no encontrada!") {
          
          errorMessage = 'No existen más resultados para la búsqueda';
          setNoMoreResults(true);
          setError(errorMessage);
        }
      } else if (error.message === 'Pelicula no encontrada!') {
        errorMessage = 'No existen mas resultados para esta búsqueda.';
        
        setNoMoreResults(true);
        setError(errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
        setError(errorMessage);
      }
    } finally {
      setSearching(false); 
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearchResults([]);
    setNoMoreResults(false);
    if (searchTerm.trim() !== '') {
      fetchMovies();
    } else {
      setError('Ingrese un término de búsqueda válido');
    }
  };

  const handleMoviePress = async (imdbID) => {
    try {
      setLoading(true);
      
      if (cache[imdbID]) {
      
        navigation.navigate('MovieDetailsScreen', { imdbID }); 
      } else {        
        const movieDetail = await ApiService.getMovieDetail(imdbID);       
        
        setCache(prevCache => ({ ...prevCache, [imdbID]: movieDetail }));
        navigation.navigate('MovieDetailsScreen', { imdbID }); 
      }
    } catch (error) {
      console.error('Error al obtener el detalle de las peliculas:', error);
      setError('Error al obtener los detalles de la película. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar películas..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.input}
        autoFocus={true} 
      />
      <TextInput
        placeholder="Año (opcional)"
        value={yearFilter}
        onChangeText={setYearFilter}
        style={styles.input}
      />
      <Button
        title="Buscar"
        onPress={handleSearch}
        color="#007bff"
        disabled={loading} 
      />
      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
      <FlatList
        data={searchResults}
        renderItem={({ item }) => renderItem({ item, handleMoviePress })} 
        keyExtractor={(item, index) => `${item.imdbID}_${index}`}
        onEndReached={() => !loading && !noMoreResults && setPage(prevPage => prevPage + 1)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => loading && <LoadingIndicator />}
      />
    </View>
  );
};

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="small" color="#0000ff" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterContainer: {
    marginRight: 10,
  },
  posterImage: {
    width: 100,
    height: 150,
  },
  noPosterText: {
    fontSize: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  year: {
    fontSize: 16,
  },
  loadingContainer: {
    padding: 10,
  },
});

export default SearchScreen;
