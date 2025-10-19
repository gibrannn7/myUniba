import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dosen related services
export const getDosenDashboard = async () => {
  try {
    const response = await api.get('/dosen/dashboard');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data dashboard dosen');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const getPendingKrs = async () => {
  try {
    const response = await api.get('/dosen/krs-pending');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data KRS pending');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const approveKrs = async (krsId: number) => {
  try {
    const response = await api.post(`/dosen/krs/approve/${krsId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal menyetujui KRS');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const rejectKrs = async (krsId: number, reason: string) => {
  try {
    const response = await api.post(`/dosen/krs/reject/${krsId}`, { catatan_penolakan: reason });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal menolak KRS');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const getMyClasses = async () => {
  try {
    const response = await api.get('/dosen/my-classes');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data kelas');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const getClassStudents = async (jadwalId: number) => {
  try {
    const response = await api.get(`/dosen/class/${jadwalId}/students`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data mahasiswa');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const submitGrades = async (data: {
  class_id: number;
  grades: {
    student_id: number;
    nilai_huruf: string;
    nilai_angka: number;
  }[];
}) => {
  try {
    const response = await api.post('/dosen/grades/submit', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal menyimpan nilai');
    }
    throw new Error('Network error. Please try again.');
  }
};