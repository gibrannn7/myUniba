<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MataKuliah;
use App\Models\ProgramStudi;

class MataKuliahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get program studi IDs
        $informatika = ProgramStudi::where('kode_prodi', 'FI01')->first();
        $sistemInformasi = ProgramStudi::where('kode_prodi', 'FI02')->first();
        
        if ($informatika) {
            // Informatika curriculum
            $informatikaMataKuliah = [
                ['kode_mk' => 'IF101', 'nama_mk' => 'Algoritma dan Pemrograman', 'sks' => 3, 'semester_mk' => 1],
                ['kode_mk' => 'IF102', 'nama_mk' => 'Matematika Diskrit', 'sks' => 3, 'semester_mk' => 1],
                ['kode_mk' => 'IF103', 'nama_mk' => 'Kalkulus', 'sks' => 3, 'semester_mk' => 1],
                ['kode_mk' => 'IF201', 'nama_mk' => 'Struktur Data', 'sks' => 3, 'semester_mk' => 2],
                ['kode_mk' => 'IF202', 'nama_mk' => 'Objek Orinted Programming', 'sks' => 3, 'semester_mk' => 2],
                ['kode_mk' => 'IF203', 'nama_mk' => 'Sistem Digital', 'sks' => 3, 'semester_mk' => 2],
                ['kode_mk' => 'IF301', 'nama_mk' => 'Aljabar Linear', 'sks' => 3, 'semester_mk' => 3],
                ['kode_mk' => 'IF302', 'nama_mk' => 'Basis Data', 'sks' => 3, 'semester_mk' => 3],
                ['kode_mk' => 'IF303', 'nama_mk' => 'Arsitektur dan Organisasi Komputer', 'sks' => 3, 'semester_mk' => 3],
                ['kode_mk' => 'IF401', 'nama_mk' => 'Jaringan Komputer', 'sks' => 3, 'semester_mk' => 4],
                ['kode_mk' => 'IF402', 'nama_mk' => 'Sistem Operasi', 'sks' => 3, 'semester_mk' => 4],
                ['kode_mk' => 'IF403', 'nama_mk' => 'Pemrograman Web', 'sks' => 3, 'semester_mk' => 4],
            ];
            
            foreach ($informatikaMataKuliah as $mk) {
                MataKuliah::create([
                    'program_studi_id' => $informatika->id,
                    'kode_mk' => $mk['kode_mk'],
                    'nama_mk' => $mk['nama_mk'],
                    'sks' => $mk['sks'],
                    'semester_mk' => $mk['semester_mk'],
                ]);
            }
        }
        
        if ($sistemInformasi) {
            // Sistem Informasi curriculum
            $sistemInformasiMataKuliah = [
                ['kode_mk' => 'SI101', 'nama_mk' => 'Pengantar Sistem Informasi', 'sks' => 3, 'semester_mk' => 1],
                ['kode_mk' => 'SI102', 'nama_mk' => 'Matematika Diskrit', 'sks' => 3, 'semester_mk' => 1],
                ['kode_mk' => 'SI103', 'nama_mk' => 'Algoritma dan Pemrograman', 'sks' => 3, 'semester_mk' => 1],
                ['kode_mk' => 'SI201', 'nama_mk' => 'Analisis dan Desain Sistem', 'sks' => 3, 'semester_mk' => 2],
                ['kode_mk' => 'SI202', 'nama_mk' => 'Struktur Data', 'sks' => 3, 'semester_mk' => 2],
                ['kode_mk' => 'SI203', 'nama_mk' => 'Statistika', 'sks' => 3, 'semester_mk' => 2],
                ['kode_mk' => 'SI301', 'nama_mk' => 'Manajemen Proyek Sistem', 'sks' => 3, 'semester_mk' => 3],
                ['kode_mk' => 'SI302', 'nama_mk' => 'Basis Data', 'sks' => 3, 'semester_mk' => 3],
                ['kode_mk' => 'SI303', 'nama_mk' => 'Audit Sistem Informasi', 'sks' => 3, 'semester_mk' => 3],
                ['kode_mk' => 'SI401', 'nama_mk' => 'E-Bisnis', 'sks' => 3, 'semester_mk' => 4],
                ['kode_mk' => 'SI402', 'nama_mk' => 'Sistem Pendukung Keputusan', 'sks' => 3, 'semester_mk' => 4],
                ['kode_mk' => 'SI403', 'nama_mk' => 'Teknologi Cloud Computing', 'sks' => 3, 'semester_mk' => 4],
            ];
            
            foreach ($sistemInformasiMataKuliah as $mk) {
                MataKuliah::create([
                    'program_studi_id' => $sistemInformasi->id,
                    'kode_mk' => $mk['kode_mk'],
                    'nama_mk' => $mk['nama_mk'],
                    'sks' => $mk['sks'],
                    'semester_mk' => $mk['semester_mk'],
                ]);
            }
        }
    }
}
