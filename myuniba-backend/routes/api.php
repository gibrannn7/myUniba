<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PmbController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\AdminAkademikController;
use App\Http\Controllers\AdminKeuanganController;
use App\Http\Controllers\LppmController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);

// PMB routes (public)
Route::get('/pmb/prodi-list', [PmbController::class, 'getProdiList']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pmb/step1', [PmbController::class, 'storeStep1']);
    Route::post('/pmb/step2', [PmbController::class, 'storeStep2']);
    Route::post('/pmb/upload-photo', [PmbController::class, 'uploadPhoto']);
    Route::get('/pmb/check-payment-status', [PmbController::class, 'checkPaymentStatus']);
});

// Mahasiswa routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mahasiswa/dashboard', [MahasiswaController::class, 'dashboard']);
    Route::get('/profile', [MahasiswaController::class, 'getProfile']);
    Route::post('/profile/update', [MahasiswaController::class, 'updateProfile']);
    Route::post('/profile/change-password', [MahasiswaController::class, 'changePassword']);
    Route::get('/krs/available-courses', [MahasiswaController::class, 'getAvailableCourses']);
    Route::get('/krs/current', [MahasiswaController::class, 'getCurrentKrs']);
    Route::post('/krs/submit', [MahasiswaController::class, 'submitKrs']);
    Route::post('/krs/request-approval', [MahasiswaController::class, 'requestApproval']);
    Route::post('/krs/cancel-request', [MahasiswaController::class, 'cancelRequest']);
    Route::get('/exam-card', [MahasiswaController::class, 'getExamCard']);
    Route::get('/grades', [MahasiswaController::class, 'getGrades']);
    Route::get('/bills', [MahasiswaController::class, 'getBills']);
    Route::get('/payment-history', [MahasiswaController::class, 'getPaymentHistory']);
    Route::post('/setup-payment-plan', [MahasiswaController::class, 'setupPaymentPlan']);
    Route::post('/attendance/record', [MahasiswaController::class, 'recordAttendance']);
});

// Dosen routes
Route::middleware('auth:sanctum')->prefix('dosen')->group(function () {
    Route::get('/dashboard', [DosenController::class, 'dashboard']);
    Route::get('/krs-pending', [DosenController::class, 'getPendingKrs']);
    Route::post('/krs/approve/{krs_id}', [DosenController::class, 'approveKrs']);
    Route::post('/krs/reject/{krs_id}', [DosenController::class, 'rejectKrs']);
    Route::get('/my-classes', [DosenController::class, 'getMyClasses']);
    Route::get('/class/{jadwal_id}/students', [DosenController::class, 'getClassStudents']);
    Route::post('/grades/submit', [DosenController::class, 'submitGrades']);
});

// Admin Akademik routes
Route::middleware('auth:sanctum')->prefix('admin-akademik')->group(function () {
    // Fakultas
    Route::get('/fakultas', [AdminAkademikController::class, 'getFakultas']);
    Route::post('/fakultas', [AdminAkademikController::class, 'createFakultas']);
    Route::put('/fakultas/{id}', [AdminAkademikController::class, 'updateFakultas']);
    Route::delete('/fakultas/{id}', [AdminAkademikController::class, 'deleteFakultas']);
    
    // Program Studi
    Route::get('/program-studi', [AdminAkademikController::class, 'getProgramStudi']);
    Route::post('/program-studi', [AdminAkademikController::class, 'createProgramStudi']);
    
    // Mata Kuliah
    Route::get('/mata-kuliah', [AdminAkademikController::class, 'getMataKuliah']);
    Route::post('/mata-kuliah', [AdminAkademikController::class, 'createMataKuliah']);
    
    // Mahasiswa
    Route::get('/mahasiswa', [AdminAkademikController::class, 'getMahasiswa']);
    Route::post('/mahasiswa', [AdminAkademikController::class, 'createMahasiswa']);
    
    // Dosen
    Route::get('/dosen', [AdminAkademikController::class, 'getDosen']);
    Route::post('/dosen', [AdminAkademikController::class, 'createDosen']);
    
    // Jadwal Kuliah
    Route::get('/jadwal-kuliah', [AdminAkademikController::class, 'getJadwalKuliah']);
    Route::post('/jadwal-kuliah', [AdminAkademikController::class, 'createJadwalKuliah']);
});

// Admin Keuangan routes
Route::middleware('auth:sanctum')->prefix('admin-keuangan')->group(function () {
    Route::post('/generate-bills', [AdminKeuanganController::class, 'generateBills']);
    Route::get('/bills', [AdminKeuanganController::class, 'getBills']);
    Route::get('/bills/{status}', [AdminKeuanganController::class, 'getBillsByStatus']);
    Route::post('/verify-payment/{pembayaran_id}', [AdminKeuanganController::class, 'verifyPayment']);
    Route::get('/payment-history', [AdminKeuanganController::class, 'getPaymentHistory']);
    Route::get('/payment-history/{mahasiswa_id}', [AdminKeuanganController::class, 'getStudentPaymentHistory']);
});

// LPPM routes
Route::middleware('auth:sanctum')->prefix('lppm')->group(function () {
    // KKM Programs
    Route::get('/kkm-programs', [LppmController::class, 'getKkmPrograms']);
    Route::post('/kkm-programs', [LppmController::class, 'createKkmProgram']);
    Route::put('/kkm-programs/{id}', [LppmController::class, 'updateKkmProgram']);
    Route::delete('/kkm-programs/{id}', [LppmController::class, 'deleteKkmProgram']);
    
    // KKM Kelompok
    Route::get('/kkm-kelompok', [LppmController::class, 'getKkmKelompoks']);
    Route::post('/kkm-kelompok', [LppmController::class, 'createKkmKelompok']);
    
    // KKM Peserta
    Route::post('/kkm-peserta', [LppmController::class, 'addKkmPeserta']);
    Route::delete('/kkm-peserta/{id}', [LppmController::class, 'removeKkmPeserta']);
    Route::get('/kkm-peserta/kelompok/{kelompok_id}', [LppmController::class, 'getKkmPesertaByKelompok']);
    
    // KKM Dokumen
    Route::get('/kkm-dokumen/peserta/{peserta_id}', [LppmController::class, 'getKkmDokumenByPeserta']);
    Route::post('/kkm-dokumen/{dokumen_id}/status', [LppmController::class, 'updateKkmDokumenStatus']);
});