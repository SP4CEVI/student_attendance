import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../Shared/Button';
import './LoginForm.css';

/* Это компонент LoginForm для аутентификации пользователей. Он позволяет пользователю ввести логин и пароль, 
  отправляет эти данные на сервер для проверки, и, в случае успешной аутентификации, перенаправляет 
  пользователя на соответствующую страницу (студент или преподаватель).
 */
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); /* Получает функцию navigate для перенаправления пользователя после успешной аутентификации */

    const handleSubmit = async (e) => { /* Вызывается при отправке формы */
    e.preventDefault();
    setError('');
    
    const result = await login(username, password);
    
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'student') {
        navigate('/student');
      } else if (user.role === 'teacher') {
        navigate('/teacher');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Вход в систему</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Логин:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="login-button">
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;