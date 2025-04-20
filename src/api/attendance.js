import axios from 'axios';

const API_URL = '/api';

export const getGroups = async () => {
  try {
    const response = await axios.get('/api/groups');
    return response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export const getGroupAttendance = async (groupId, date) => {
  try {
    const response = await axios.get(`${API_URL}/attendance`, {
      params: { 
        groupId,
        date
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении данных группы');
  }
};

export const updateAttendance = async (attendanceRecords) => {
  try {
    const promises = attendanceRecords.map(record => {
      if (record.id) {
        return axios.put(`${API_URL}/attendance/${record.id}`, record);
      } else {
        return axios.post(`${API_URL}/attendance`, record);
      }
    });
    
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error saving attendance:', error);
    throw new Error('Ошибка при сохранении посещаемости');
  }
};

export const getSubjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/subjects`);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении списка предметов');
  }
};

export const getGroupStudents = async (groupId) => {
  try {
    const response = await axios.get(`${API_URL}/students`, {
      params: { groupId }
    });
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при загрузке студентов группы');
  }
};