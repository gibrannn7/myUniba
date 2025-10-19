<?php

namespace App\Http\Controllers;

use App\Models\Fakultas;
use App\Models\ProgramStudi;
use App\Models\MataKuliah;
use App\Models\MahasiswaProfile;
use App\Models\DosenProfile;
use App\Models\JadwalKuliah;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAkademikController extends Controller
{
    // Fakultas CRUD
    public function getFakultas()
    {
        $fakultas = Fakultas::all();
        return response()->json(['fakultas' => $fakultas]);
    }

    public function createFakultas(Request $request)
    {
        $request->validate([
            'kode_fakultas' => 'required|unique:fakultas,kode_fakultas',
            'nama_fakultas' => 'required|string|max:255',
        ]);

        $fakultas = Fakultas::create($request->all());

        return response()->json([
            'message' => 'Fakultas created successfully',
            'fakultas' => $fakultas
        ]);
    }

    public function updateFakultas(Request $request, $id)
    {
        $request->validate([
            'kode_fakultas' => 'required|unique:fakultas,kode_fakultas,' . $id,
            'nama_fakultas' => 'required|string|max:255',
        ]);

        $fakultas = Fakultas::findOrFail($id);
        $fakultas->update($request->all());

        return response()->json([
            'message' => 'Fakultas updated successfully',
            'fakultas' => $fakultas
        ]);
    }

    public function deleteFakultas($id)
    {
        $fakultas = Fakultas::findOrFail($id);
        $fakultas->delete();

        return response()->json([
            'message' => 'Fakultas deleted successfully'
        ]);
    }

    // Program Studi CRUD
    public function getProgramStudi()
    {
        $prodi = ProgramStudi::with('fakultas')->get();
        return response()->json(['program_studi' => $prodi]);
    }

    public function createProgramStudi(Request $request)
    {
        $request->validate([
            'fakultas_id' => 'required|exists:fakultas,id',
            'kode_prodi' => 'required|unique:program_studis,kode_prodi',
            'nama_prodi' => 'required|string|max:255',
            'jenjang' => 'required|in:S1,S2,Profesi',
            'biaya_pendaftaran' => 'required|numeric',
        ]);

        $prodi = ProgramStudi::create($request->all());

        return response()->json([
            'message' => 'Program Studi created successfully',
            'program_studi' => $prodi
        ]);
    }

    // Mata Kuliah CRUD
    public function getMataKuliah()
    {
        $mataKuliah = MataKuliah::with('programStudi')->get();
        return response()->json(['mata_kuliah' => $mataKuliah]);
    }

    public function createMataKuliah(Request $request)
    {
        $request->validate([
            'program_studi_id' => 'required|exists:program_studis,id',
            'kode_mk' => 'required|unique:mata_kuliahs,kode_mk',
            'nama_mk' => 'required|string|max:255',
            'sks' => 'required|integer|min:1|max:6',
            'semester_mk' => 'required|integer|min:1|max:14',
        ]);

        $mataKuliah = MataKuliah::create($request->all());

        return response()->json([
            'message' => 'Mata Kuliah created successfully',
            'mata_kuliah' => $mataKuliah
        ]);
    }

    // Mahasiswa Management
    public function getMahasiswa()
    {
        $mahasiswa = MahasiswaProfile::with(['user', 'programStudi'])->get();
        return response()->json(['mahasiswa' => $mahasiswa]);
    }

    public function createMahasiswa(Request $request)
    {
        $request->validate([
            'nim' => 'required|unique:mahasiswa_profiles,nim',
            'nama_lengkap' => 'required|string|max:255',
            'program_studi_id' => 'required|exists:program_studis,id',
            'username' => 'required|unique:users,username',
            'password' => 'required|min:8',
        ]);

        // Create user
        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => 'mahasiswa',
        ]);

        // Create mahasiswa profile
        $mahasiswa = MahasiswaProfile::create([
            'user_id' => $user->id,
            'nim' => $request->nim,
            'nama_lengkap' => $request->nama_lengkap,
            'program_studi_id' => $request->program_studi_id,
            // Set other required fields as per your model
        ]);

        return response()->json([
            'message' => 'Mahasiswa created successfully',
            'mahasiswa' => $mahasiswa->load('user')
        ]);
    }

    // Dosen Management
    public function getDosen()
    {
        $dosen = DosenProfile::with('user')->get();
        return response()->json(['dosen' => $dosen]);
    }

    public function createDosen(Request $request)
    {
        $request->validate([
            'nidn' => 'required|unique:dosen_profiles,nidn',
            'nama_lengkap' => 'required|string|max:255',
            'username' => 'required|unique:users,username',
            'password' => 'required|min:8',
        ]);

        // Create user
        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => 'dosen',
        ]);

        // Create dosen profile
        $dosen = DosenProfile::create([
            'user_id' => $user->id,
            'nidn' => $request->nidn,
            'nama_lengkap' => $request->nama_lengkap,
            'email' => $request->email,
            'no_telepon' => $request->no_telepon,
        ]);

        return response()->json([
            'message' => 'Dosen created successfully',
            'dosen' => $dosen->load('user')
        ]);
    }

    // Jadwal Kuliah Management
    public function getJadwalKuliah()
    {
        $jadwal = JadwalKuliah::with(['mataKuliah', 'dosen'])->get();
        return response()->json(['jadwal_kuliah' => $jadwal]);
    }

    public function createJadwalKuliah(Request $request)
    {
        $request->validate([
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'dosen_id' => 'required|exists:dosen_profiles,id',
            'tahun_akademik' => 'required|string',
            'kelas' => 'required|string|max:10',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'ruang' => 'required|string|max:50',
            'kuota' => 'required|integer|min:1',
        ]);

        $jadwal = JadwalKuliah::create($request->all());

        return response()->json([
            'message' => 'Jadwal Kuliah created successfully',
            'jadwal_kuliah' => $jadwal
        ]);
    }
}