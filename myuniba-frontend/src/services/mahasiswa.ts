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

// Mahasiswa profile related services
export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data profil');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const updateUserProfile = async (data: {
  nama_lengkap?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  alamat_lengkap?: string;
  email?: string;
  no_whatsapp?: string;
}) => {
  try {
    const response = await api.post('/profile/update', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal memperbarui profil');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const changePassword = async (data: {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}) => {
  try {
    const response = await api.post('/profile/change-password', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengganti password');
    }
    throw new Error('Network error. Please try again.');
  }
};

// KRS related services
export const getAvailableCourses = async (semester: number, kelas: string) => {
  try {
    const response = await api.get('/krs/available-courses', {
      params: { semester, kelas }
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data matakuliah');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const getCurrentKrs = async () => {
  try {
    const response = await api.get('/krs/current');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data KRS');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const submitKrs = async (jadwalIds: number[]) => {
  try {
    const response = await api.post('/krs/submit', { jadwal_ids: jadwalIds });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal menyimpan KRS');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const requestKrsApproval = async () => {
  try {
    const response = await api.post('/krs/request-approval');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengajukan persetujuan KRS');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const cancelKrsRequest = async () => {
  try {
    const response = await api.post('/krs/cancel-request');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal membatalkan permintaan KRS');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Exam card service
export const getExamCard = async () => {
  try {
    const response = await api.get('/exam-card');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data kartu ujian');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Grades related services
export const getGrades = async (semester?: number) => {
  try {
    const response = await api.get('/grades', {
      params: { semester }
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data nilai');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Financial services
export const getBills = async () => {
  try {
    const response = await api.get('/bills');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data tagihan');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/payment-history');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil riwayat pembayaran');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const setupPaymentPlan = async (data: {
  tagihan_id: number;
  jumlah_cicilan: number;
  tanggal_pembayaran: string[];
  jumlah_pembayaran: number[];
}) => {
  try {
    const response = await api.post('/setup-payment-plan', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal membuat rencana pembayaran');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Attendance service
export const recordAttendance = async (data: {
  jadwal_id: number;
  latitude: string;
  longitude: string;
  image_data: string;
}) => {
  try {
    const response = await api.post('/attendance/record', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mencatat kehadiran');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Dashboard service
export const getDashboardData = async () => {
  try {
    const response = await api.get('/mahasiswa/dashboard');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil data dashboard');
    }
    throw new Error('Network error. Please try again.');
  }
};