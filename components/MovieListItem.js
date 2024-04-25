import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MovieListItem = ({ movie }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.Title}</Text>
      <Text>{movie.Year}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MovieListItem;
