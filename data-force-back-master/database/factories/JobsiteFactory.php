<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Company\Models\Company;
use Src\Domain\Jobsite\Models\Jobsite;

class JobsiteFactory extends Factory
{

    protected $model = Jobsite::class;

    public function definition()
    {
        return [
            'name'            => $this->faker->name,
            'address_street'  => $this->faker->streetAddress,
            'state'           => $this->faker->countryCode,
            'city'            => $this->faker->city,
            'zip_code'        => $this->faker->countryCode,
            'company_id'      => Company::factory()->create()->id
        ];
    }

}
