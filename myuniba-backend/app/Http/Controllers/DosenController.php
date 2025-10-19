<?php

namespace App\Http\Controllers;

use App\Models\DosenProfile;
use App\Models\Krs;
use App\Models\JadwalKuliah;
use App\Models\KrsDetail;
use App\Models\KhsDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DosenController extends Controller
{
    /**
     * Get dashboard for dosen
     */
    public function dashboard()
    {
        $user = Auth::user();
        $dosen = $user->dosenProfile;

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

        $jadwalHariIni = JadwalKuliah::where('dosen_id', $dosen->id)
            ->where('hari', $todayIndo)
            ->with(['mataKuliah', 'krsDetails' => function($query) {
                $query->with('krs.mahasiswaProfile');
            }])
            ->get();

        // Get number of students needing KRS approval
        $pendingKrsCount = Krs::whereHas('krsDetails.jadwalKuliah', function($query) use ($dosen) {
                $query->where('dosen_id', $dosen->id);
            })
            ->where('status', 'pending_approval')
            ->count();

        return response()->json([
            'jadwal_hari_ini' => $jadwalHariIni,
            'mahasiswa_bimbingan_count' => $dosen->kkmKelompoks->count(), // If they're a supervisor
            'pending_krs_count' => $pendingKrsCount,
        ]);
    }

    /**
     * Get pending KRS for approval
     */
    public function getPendingKrs()
    {
        $user = Auth::user();
        $dosen = $user->dosenProfile;

        $pendingKrs = Krs::whereHas('krsDetails.jadwalKuliah', function($query) use ($dosen) {
                $query->where('dosen_id', $dosen->id);
            })
            ->where('status', 'pending_approval')
            ->with(['mahasiswaProfile', 'krsDetails.jadwalKuliah.mataKuliah'])
            ->get();

        return response()->json([
            'pending_krs' => $pendingKrs
        ]);
    }

    /**
     * Approve KRS
     */
    public function approveKrs(Request $request, $krs_id)
    {
        $krs = Krs::findOrFail($krs_id);

        // Verify that the KRS contains courses taught by this dosen
        $hasCourseByDosen = $krs->krsDetails->contains(function($detail) use ($dosen) {
            return $detail->jadwalKuliah->dosen_id === $dosen->id;
        });

        if (!$hasCourseByDosen) {
            return response()->json([
                'message' => 'You are not authorized to approve this KRS'
            ], 403);
        }

        $krs->status = 'approved';
        $krs->save();

        return response()->json([
            'message' => 'KRS approved successfully',
            'krs' => $krs
        ]);
    }

    /**
     * Reject KRS
     */
    public function rejectKrs(Request $request, $krs_id)
    {
        $request->validate([
            'catatan_penolakan' => 'required|string'
        ]);

        $krs = Krs::findOrFail($krs_id);

        // Verify that the KRS contains courses taught by this dosen
        $hasCourseByDosen = $krs->krsDetails->contains(function($detail) use ($dosen) {
            return $detail->jadwalKuliah->dosen_id === $dosen->id;
        });

        if (!$hasCourseByDosen) {
            return response()->json([
                'message' => 'You are not authorized to reject this KRS'
            ], 403);
        }

        $krs->status = 'rejected';
        $krs->catatan_penolakan = $request->catatan_penolakan;
        $krs->save();

        return response()->json([
            'message' => 'KRS rejected successfully',
            'krs' => $krs
        ]);
    }

    /**
     * Get classes taught by the dosen
     */
    public function getMyClasses()
    {
        $user = Auth::user();
        $dosen = $user->dosenProfile;

        $classes = JadwalKuliah::where('dosen_id', $dosen->id)
            ->with('mataKuliah')
            ->get();

        return response()->json([
            'classes' => $classes
        ]);
    }

    /**
     * Get students in a specific class
     */
    public function getClassStudents($jadwal_id)
    {
        $jadwal = JadwalKuliah::findOrFail($jadwal_id);

        // Verify that this dosen teaches this class
        $user = Auth::user();
        $dosen = $user->dosenProfile;

        if ($jadwal->dosen_id !== $dosen->id) {
            return response()->json([
                'message' => 'You are not authorized to access this class'
            ], 403);
        }

        $students = KrsDetail::where('jadwal_kuliah_id', $jadwal_id)
            ->with('krs.mahasiswaProfile')
            ->get();

        return response()->json([
            'students' => $students->map(function($detail) {
                return [
                    'id' => $detail->krs->mahasiswaProfile->id,
                    'nim' => $detail->krs->mahasiswaProfile->nim,
                    'nama' => $detail->krs->mahasiswaProfile->nama_lengkap,
                    'current_grade' => $this->getCurrentGrade($detail->krs->mahasiswaProfile->id, $jadwal->mataKuliah->id)
                ];
            })
        ]);
    }

    /**
     * Submit grades for students
     */
    public function submitGrades(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:jadwal_kuliahs,id',
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|exists:mahasiswa_profiles,id',
            'grades.*.nilai_huruf' => 'required|string|in:A,A-,B+,B,B-,C+,C,D,E',
            'grades.*.nilai_angka' => 'required|numeric|min:0|max:4',
        ]);

        $jadwal = JadwalKuliah::findOrFail($request->class_id);

        // Verify that this dosen teaches this class
        $user = Auth::user();
        $dosen = $user->dosenProfile;

        if ($jadwal->dosen_id !== $dosen->id) {
            return response()->json([
                'message' => 'You are not authorized to submit grades for this class'
            ], 403);
        }

        foreach($request->grades as $gradeData) {
            // Find the student's KRS for this semester
            $currentSemester = date('Y') . '1'; // Example: 20251 for odd semester
            $krs = Krs::where('mahasiswa_profile_id', $gradeData['student_id'])
                ->where('tahun_akademik', $currentSemester)
                ->first();

            if ($krs) {
                // If there's no KHS for this semester yet, create one
                $khs = \App\Models\Khs::firstOrCreate([
                    'mahasiswa_profile_id' => $gradeData['student_id'],
                    'krs_id' => $krs->id,
                    'tahun_akademik' => $currentSemester,
                    'semester' => $krs->semester,
                ]);

                // Create or update the grade in KHS details
                \App\Models\KhsDetail::updateOrCreate([
                    'khs_id' => $khs->id,
                    'mata_kuliah_id' => $jadwal->mata_kuliah_id,
                ], [
                    'nilai_huruf' => $gradeData['nilai_huruf'],
                    'nilai_angka' => $gradeData['nilai_angka'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Grades submitted successfully'
        ]);
    }

    /**
     * Get current grade for a student in a specific course
     */
    private function getCurrentGrade($studentId, $courseId)
    {
        $currentSemester = date('Y') . '1'; // Example: 20251 for odd semester
        
        $khsDetail = KhsDetail::whereHas('khs', function($query) use ($studentId, $currentSemester) {
                $query->where('mahasiswa_profile_id', $studentId)
                      ->where('tahun_akademik', $currentSemester);
            })
            ->where('mata_kuliah_id', $courseId)
            ->first();

        return $khsDetail ? [
            'nilai_huruf' => $khsDetail->nilai_huruf,
            'nilai_angka' => $khsDetail->nilai_angka
        ] : null;
    }
}
