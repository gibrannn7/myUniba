<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kosongkan tabel users terlebih dahulu
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $users = [
            [
                'username' => 'calonmahasiswa',
                'password' => Hash::make('password'),
                'role' => 'calon_mahasiswa',
            ],
            [
                'username' => 'mahasiswa',
                'password' => Hash::make('password'),
                'role' => 'mahasiswa',
            ],
            [
                'username' => 'dosen',
                'password' => Hash::make('password'),
                'role' => 'dosen',
            ],
            [
                'username' => 'adminakademik',
                'password' => Hash::make('password'),
                'role' => 'admin_akademik',
            ],
            [
                'username' => 'adminkeuangan',
                'password' => Hash::make('password'),
                'role' => 'admin_keuangan',
            ],
            [
                'username' => 'lppm',
                'password' => Hash::make('password'),
                'role' => 'lppm',
            ],
        ];

        // Masukkan data ke dalam tabel
        foreach ($users as $user) {
            User::create($user);
        }
    }
}
