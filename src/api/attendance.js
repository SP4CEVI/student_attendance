import axios from 'axios';

const API_URL = '/api/attendance';

export const getStudentAttendance = async (studentId, date) => {
  try {
    const response = await axios.get(`${API_URL}/student/${studentId}?date=${date}`);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении данных о посещаемости');
  }
};

export const updateStudentAttendance = async (studentId, date, attendance) => {
  try {
    await axios.put(`${API_URL}/student/${studentId}`, { date, attendance });
  } catch (error) {
    throw new Error('Ошибка при обновлении данных о посещаемости');
  }
};

export const getGroupAttendance = async (groupId, date) => {
    try {
      const response = await axios.get(`/attendance?groupId=${groupId}&date=${date}`);
      return response.data;
    } catch (error) {
      throw new Error('Ошибка при получении данных группы');
    }
  };