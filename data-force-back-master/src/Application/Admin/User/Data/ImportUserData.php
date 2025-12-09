<?php

namespace Src\Application\Admin\User\Data;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Log;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Position\Models\Position;
use Src\Domain\User\Models\User;

class ImportUserData implements SkipsEmptyRows, toCollection, WithHeadingRow, WithValidation
{
    public function collection(Collection $rows): void
    {
        DB::beginTransaction();

        $errores = collect([]);
        $jobsites = Jobsite::all();
        $positions = Position::currentCompany()->get();
        $company = auth()->user()->company;

        foreach ($rows as $user) {
            $x = StoreUserTask::run(
                $user['firstname'],
                $user['lastname'],
                $user['email'],
                $user['phone_number'],
                $user['driver_amazon_id'],
                $user['position_name'],
                $user['jobsite_name'],
                $user['rol'],
                $jobsites,
                $positions
            );
        }

        \SubscriptionService::updateSeats($company, User::currentCompany()->whereIsNotBosmetricUser()->count());

        DB::commit();
        Log::error('errores', $errores->unique()->toArray());

    }

    public function rules(): array
    {
        return [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|unique:users',
            'phone_number' => 'required',
            'driver_amazon_id' => 'required|unique:users',
            'position_name' => 'required',
            'jobsite_name' => 'required',
            'rol' => 'required',
        ];
    }
}
