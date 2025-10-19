<?php

namespace App\Http\Controllers;

use App\Models\MahasiswaProfile;
use App\Models\Tagihan;
use App\Models\JadwalKuliah;
use App\Models\Absensi;
use App\Models\Krs;
use App\Models\Khs;
use App\Models\KrsDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MahasiswaController extends Controller
{
    /**
     * Get dashboard data for the student
     */
    public function dashboard()
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        // Get today's schedule
        $today = now()->format('l'); // e.g., "Monday"
        $dayMap = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa', 
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu'
        ];
        $todayIndo = $dayMap[$today] ?? $today;

        $jadwalHariIni = JadwalKuliah::whereHas('krsDetails.krs', function($query) use ($mahasiswa) {
                $query->where('mahasiswa_profile_id', $mahasiswa->id);
            })
            ->where('hari', $todayIndo)
            ->with(['mataKuliah', 'dosen'])
            ->get();

        // Get total unpaid bills
        $totalTagihan = Tagihan::where('mahasiswa_profile_id', $mahasiswa->id)
            ->where('status', 'belum_dibayar')
            ->sum('jumlah_tagihan');

        // Get latest KHS (if any)
        $latestKhs = Khs::where('mahasiswa_profile_id', $mahasiswa->id)
            ->latest('tahun_akademik')
            ->first();

        return response()->json([
            'jadwal_hari_ini' => $jadwalHariIni,
            'total_tagihan' => $totalTagihan,
            'latest_khs' => $latestKhs,
        ]);
    }

    /**
     * Get student profile
     */
    public function getProfile()
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;
        $keluarga = $mahasiswa->keluargaProfile;

        return response()->json([
            'mahasiswa' => $mahasiswa,
            'keluarga' => $keluarga,
        ]);
    }

    /**
     * Update student profile
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'sometimes|string|max:255',
            'tempat_lahir' => 'sometimes|string|max:255',
            'tanggal_lahir' => 'sometimes|date',
            'alamat_lengkap' => 'sometimes|string|max:500',
            // Add other updatable fields as needed
        ]);

        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        $mahasiswa->update($request->only([
            'nama_lengkap', 'tempat_lahir', 'tanggal_lahir', 'alamat_lengkap'
            // Add other fields as needed
        ]));

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $mahasiswa
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (!\Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 422);
        }

        $user->update([
            'password' => \Hash::make($request->new_password)
        ]);

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }

    /**
     * Get available courses for KRS
     */
    public function getAvailableCourses(Request $request)
    {
        $semester = $request->query('semester');
        $kelas = $request->query('kelas');

        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        // Get courses for the student's program that are available in the specified semester
        $courses = JadwalKuliah::whereHas('mataKuliah', function($query) use ($mahasiswa, $semester) {
                $query->where('program_studi_id', $mahasiswa->program_studi_id)
                      ->where('semester_mk', $semester);
            })
            ->where('kelas', $kelas)
            ->where('sisa_kuota', '>', 0) // Only courses with available quota
            ->with(['mataKuliah', 'dosen'])
            ->get();

        return response()->json([
            'courses' => $courses
        ]);
    }

    /**
     * Get current KRS
     */
    public function getCurrentKrs()
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        $krs = Krs::where('mahasiswa_profile_id', $mahasiswa->id)
            ->where('status', 'approved')
            ->latest()
            ->with(['krsDetails.jadwalKuliah.mataKuliah'])
            ->first();

        return response()->json([
            'krs' => $krs
        ]);
    }

    /**
     * Submit KRS
     */
    public function submitKrs(Request $request)
    {
        $request->validate([
            'jadwal_ids' => 'required|array',
            'jadwal_ids.*' => 'exists:jadwal_kuliahs,id',
        ]);

        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        // Check if there's already a KRS for this semester
        $currentSemester = date('Y') . '1'; // Example: 20251 for odd semester
        $existingKrs = Krs::where('mahasiswa_profile_id', $mahasiswa->id)
            ->where('tahun_akademik', $currentSemester)
            ->first();

        if ($existingKrs && $existingKrs->status !== 'draft') {
            return response()->json([
                'message' => 'KRS for this semester already exists and is not in draft status'
            ], 400);
        }

        $totalSks = 0;
        foreach($request->jadwal_ids as $jadwalId) {
            $jadwal = JadwalKuliah::find($jadwalId);
            $totalSks += $jadwal->mataKuliah->sks;
        }

        // Create or update KRS
        if ($existingKrs) {
            $krs = $existingKrs;
        } else {
            $krs = new Krs();
            $krs->mahasiswa_profile_id = $mahasiswa->id;
            $krs->tahun_akademik = $currentSemester;
            $krs->semester = 1; // Example, should be dynamic
        }

        $krs->total_sks = $totalSks;
        $krs->status = 'pending_approval';
        $krs->save();

        // Clear existing KRS details and add new ones
        $krs->krsDetails()->delete();
        foreach($request->jadwal_ids as $jadwalId) {
            KrsDetail::create([
                'krs_id' => $krs->id,
                'jadwal_kuliah_id' => $jadwalId,
            ]);

            // Reduce quota
            $jadwal = JadwalKuliah::find($jadwalId);
            $jadwal->decrement('sisa_kuota');
        }

        return response()->json([
            'message' => 'KRS submitted successfully',
            'krs' => $krs->load('krsDetails.jadwalKuliah.mataKuliah')
        ]);
    }

    /**
     * Request KRS approval
     */
    public function requestApproval()
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        $currentSemester = date('Y') . '1'; // Example: 20251 for odd semester
        $krs = Krs::where('mahasiswa_profile_id', $mahasiswa->id)
            ->where('tahun_akademik', $currentSemester)
            ->where('status', 'draft')
            ->first();

        if (!$krs) {
            return response()->json([
                'message' => 'No draft KRS found for approval'
            ], 404);
        }

        $krs->status = 'pending_approval';
        $krs->save();

        return response()->json([
            'message' => 'KRS approval requested successfully',
            'krs' => $krs
        ]);
    }

    /**
     * Cancel KRS request
     */
    public function cancelRequest()
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        $currentSemester = date('Y') . '1'; // Example: 20251 for odd semester
        $krs = Krs::where('mahasiswa_profile_id', $mahasiswa->id)
            ->where('tahun_akademik', $currentSemester)
            ->where('status', 'pending_approval')
            ->first();

        if (!$krs) {
            return response()->json([
                'message' => 'No pending KRS approval found'
            ], 404);
        }

        $krs->status = 'draft';
        $krs->save();

        return response()->json([
            'message' => 'KRS request canceled successfully',
            'krs' => $krs
        ]);
    }

    /**
     * Get exam card
     */
    public function getExamCard()
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        // Check if KRS is approved and payments are settled
        $currentSemester = date('Y') . '1'; // Example: 20251 for odd semester
        $approvedKrs = Krs::where('mahasiswa_profile_id', $mahasiswa->id)
            ->where('tahun_akademik', $currentSemester)
            ->where('status', 'approved')
            ->first();

        $unpaidBills = Tagihan::where('mahasiswa_profile_id', $mahasiswa->id)
            ->where('status', 'belum_dibayar')
            ->exists();

        if (!$approvedKrs || $unpaidBills) {
            return response()->json([
                'message' => 'Cannot generate exam card. KRS not approved or bills unpaid.'
            ], 400);
        }

        // Return exam card data
        return response()->json([
            'exam_card' => [
                'nim' => $mahasiswa->nim,
                'nama' => $mahasiswa->nama_lengkap,
                'program_studi' => $mahasiswa->programStudi->nama_prodi,
                'courses' => $approvedKrs->krsDetails->map(function($detail) {
                    return [
                        'kode_mk' => $detail->jadwalKuliah->mataKuliah->kode_mk,
                        'nama_mk' => $detail->jadwalKuliah->mataKuliah->nama_mk,
                        'kelas' => $detail->jadwalKuliah->kelas,
                        'dosen' => $detail->jadwalKuliah->dosen->nama_lengkap,
                    ];
                })
            ]
        ]);
    }

    /**
     * Get grades for a semester
     */
    public function getGrades(Request $request)
    {
        $semester = $request->query('semester', null);
        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        $query = Khs::where('mahasiswa_profile_id', $mahasiswa->id);

        if ($semester) {
            $query->where('semester', $semester);
        }

        $khs = $query->with(['khsDetails.mataKuliah'])->get();

        return response()->json([
            'grades' => $khs
        ]);
    }

    /**
     * Get bills
     */
    public function getBills()
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        $bills = Tagihan::where('mahasiswa_profile_id', $mahasiswa->id)
            ->get();

        return response()->json([
            'bills' => $bills
        ]);
    }

    /**
     * Get payment history
     */
    public function getPaymentHistory()
    {
        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        $payments = Pembayaran::where('mahasiswa_profile_id', $mahasiswa->id)
            ->with('tagihan')
            ->get();

        return response()->json([
            'payments' => $payments
        ]);
    }

    /**
     * Setup payment plan
     */
    public function setupPaymentPlan(Request $request)
    {
        $request->validate([
            'tagihan_id' => 'required|exists:tagihans,id',
            'jumlah_cicilan' => 'required|integer|min:1',
            'tanggal_pembayaran' => 'required|array',
            'jumlah_pembayaran' => 'required|array',
        ]);

        // Implementation for setting up payment plan would go here
        // This would integrate with a payment gateway in a real application
        
        return response()->json([
            'message' => 'Payment plan setup functionality would be implemented here'
        ]);
    }

    /**
     * Record attendance
     */
    public function recordAttendance(Request $request)
    {
        $request->validate([
            'jadwal_id' => 'required|exists:jadwal_kuliahs,id',
            'latitude' => 'required|string',
            'longitude' => 'required|string',
            'image_data' => 'required|string', // Base64 encoded image
        ]);

        $user = Auth::user();
        $mahasiswa = $user->mahasiswaProfile;

        // Check if this is a valid time for attendance (within 30 minutes of class)
        $jadwal = JadwalKuliah::find($request->jadwal_id);
        $now = now();
        $classTime = \Carbon\Carbon::createFromTimeString($jadwal->jam_mulai);
        
        if ($now->diffInMinutes($classTime) > 30) {
            return response()->json([
                'message' => 'Attendance can only be recorded within 30 minutes of class start time'
            ], 400);
        }

        // Check if attendance already recorded for this date
        $today = now()->toDateString();
        $existingAttendance = Absensi::where('jadwal_kuliah_id', $request->jadwal_id)
            ->where('mahasiswa_profile_id', $mahasiswa->id)
            ->whereDate('tanggal_perkuliahan', $today)
            ->first();

        if ($existingAttendance) {
            return response()->json([
                'message' => 'Attendance already recorded for this class today'
            ], 400);
        }

        // Create attendance record
        $absensi = Absensi::create([
            'jadwal_kuliah_id' => $request->jadwal_id,
            'mahasiswa_profile_id' => $mahasiswa->id,
            'tanggal_perkuliahan' => $today,
            'status_kehadiran' => 'hadir',
            'metode_absensi' => 'face_geo',
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'face_recognition_data' => $request->image_data, // In real app, this would be processed
        ]);

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'attendance' => $absensi
        ]);
    }
}
