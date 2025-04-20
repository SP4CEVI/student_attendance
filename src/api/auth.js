import axios from 'axios';

export const login = async (username, password) => {
  try {
    const response = await axios.get('http://localhost:3001/users');
    
    const user = response.data.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Неверный логин или пароль');
    }

    return user;
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    throw new Error('Сервер недоступен. Попробуйте позже.');
  }
};