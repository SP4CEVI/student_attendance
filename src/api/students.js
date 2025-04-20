import axios from 'axios';

const API_URL = '/api/students';

export const getGroups = async () => {
    try {
      const response = await axios.get('/groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      return []; // Возвращаем пустой массив при ошибке
    }
  };