import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Import semua halaman publik
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Import semua halaman terproteksi
import DashboardPage from './pages/DashboardPage';
import DosenDashboardPage from './pages/DosenDashboardPage';
import PMBPage from './pages/PMBPage';
import ProfilePage from './pages/ProfilePage';
import FinancePage from './pages/FinancePage';
import AttendancePage from './pages/AttendancePage';
import ExamCardPage from './pages/ExamCardPage';
import GradesPage from './pages/GradesPage';
import KRSPage from './pages/KRSPage';
import GradeInputPage from './pages/GradeInputPage';
import KRSApprovalPage from './pages/KRSApprovalPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ====================================================== */}
          {/* RUTE PUBLIK (Tidak Perlu Login)                       */}
          {/* ====================================================== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ====================================================== */}
          {/* RUTE TERPROTEKSI (Harus Login)                         */}
          {/* ====================================================== */}

          {/* Rute Root (/) - Mengarahkan ke dashboard yang sesuai */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {/* Di sini Anda bisa menambahkan logika untuk redirect berdasarkan role,
                  tapi ProtectedRoute sudah melakukannya. 
                  Sebagai fallback, kita arahkan ke /dashboard.
                  LoginPage akan mengarahkan ke dashboard yang benar saat login.
                */}
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* Rute Dashboard Umum (Mahasiswa, Admin, LPPM) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['mahasiswa', 'admin_akademik', 'admin_keuangan', 'lppm']}>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Rute Profil Pengguna (Semua Role) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* --- Rute Spesifik Mahasiswa --- */}
          <Route
            path="/keuangan"
            element={
              <ProtectedRoute allowedRoles={['mahasiswa', 'admin_keuangan']}>
                <MainLayout>
                  <FinancePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/krs"
            element={
              <ProtectedRoute allowedRoles={['mahasiswa']}>
                <MainLayout>
                  <KRSPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/khs" // Halaman GradesPage digunakan untuk KHS/Nilai
            element={
              <ProtectedRoute allowedRoles={['mahasiswa']}>
                <MainLayout>
                  <GradesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kartu-ujian"
            element={
              <ProtectedRoute allowedRoles={['mahasiswa']}>
                <MainLayout>
                  <ExamCardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/absensi"
            element={
              <ProtectedRoute allowedRoles={['mahasiswa', 'dosen']}>
                <MainLayout>
                  <AttendancePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* --- Rute Spesifik Dosen --- */}
          <Route
            path="/dosen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['dosen']}>
                <MainLayout>
                  <DosenDashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dosen/input-nilai"
            element={
              <ProtectedRoute allowedRoles={['dosen']}>
                <MainLayout>
                  <GradeInputPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dosen/approve-krs"
            element={
              <ProtectedRoute allowedRoles={['dosen']}>
                <MainLayout>
                  <KRSApprovalPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* --- Rute Spesifik Calon Mahasiswa (PMB) --- */}
          <Route
            path="/pmb"
            element={
              <ProtectedRoute allowedRoles={['calon_mahasiswa']}>
                {/* PMBPage mungkin tidak memerlukan MainLayout, tergantung desain */}
                {/* <MainLayout> */}
                  <PMBPage />
                {/* </MainLayout> */}
              </ProtectedRoute>
            }
          />

          {/* ====================================================== */}
          {/* RUTE LAINNYA                                         */}
          {/* ====================================================== */}

          {/* Halaman Unauthorized (Jika Role Tidak Sesuai) */}
          <Route
            path="/unauthorized"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
                  <p className="mt-2">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                  <a href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
                    Kembali ke Login
                  </a>
                </div>
              </div>
            }
          />

          {/* Fallback Route (Halaman Tidak Ditemukan) - Arahkan ke root */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;