import axios from 'axios';

const OMDB_API_URL = 'http://www.omdbapi.com/';
const API_KEY = '622c33c5';
const problematicIMDbIDs = []; 

const ApiService = {
  

  async advancedSearchMovies(searchTerm, yearFilter, page) {
    try {
    
      const response = await axios.get(`${OMDB_API_URL}?apikey=${API_KEY}&s=${searchTerm}&y=${yearFilter}&type=movie&r=json&page=${page}`);
      //console.log(`${OMDB_API_URL}?apikey=${API_KEY}&s=${searchTerm}&y=${yearFilter}&type=movie&r=json&page=${page}`);

  
      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'Error desconocido en la respuesta de la API');
      }
  
      const searchResults = response.data.Search || [];
  
    
      return response.data.Search || [];
    } catch (error) {
      console.error('Error al buscar películas avanzado:', error.message);
      throw error;
    }
  },

  async getMovieDetail(movieId) {
    try {
     
      const response = await axios.get(`${OMDB_API_URL}?apikey=${API_KEY}&i=${movieId}`);
      //console.log(`${OMDB_API_URL}?apikey=${API_KEY}&i=${movieId}`);
    
      
      if (response.data.Error) {
        throw new Error(response.data.Error);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error al obtener el detalle de las peliculas:', error.message);
      throw error;
    }
  }
};

export default ApiService;
