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

// Get list of study programs
export const getProdiList = async () => {
  try {
    const response = await api.get('/pmb/prodi-list');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengambil daftar program studi');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Register step 1 - personal data
export const registerPmbStep1 = async (data: {
  username: string;
  password: string;
  password_confirmation: string;
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  program_studi_id: string;
}) => {
  try {
    const response = await api.post('/pmb/step1', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal menyimpan data pendaftaran');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Register step 2 - family data
export const registerPmbStep2 = async (data: {
  nama_ayah: string;
  pekerjaan_ayah: string;
  penghasilan_ayah: string;
  nama_ibu: string;
  pekerjaan_ibu: string;
  penghasilan_ibu: string;
  alamat_orang_tua: string;
}) => {
  try {
    const response = await api.post('/pmb/step2', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal menyimpan data keluarga');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Upload photo
export const uploadPmbPhoto = async (photo: File) => {
  const formData = new FormData();
  formData.append('photo', photo);

  try {
    const response = await api.post('/pmb/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal mengupload foto');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Check payment status
export const checkPaymentStatus = async () => {
  try {
    const response = await api.get('/pmb/check-payment-status');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Gagal memeriksa status pembayaran');
    }
    throw new Error('Network error. Please try again.');
  }
};