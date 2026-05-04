<?php

namespace Database\Factories;

use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement([
                'Riyadh Metro Station Fit-Out',
                'Dammam Corniche Tower Phase 2',
                'Jeddah Waterfront Mall Refurbishment',
                'NEOM Site Office Block A',
            ]),
            'client' => $this->faker->randomElement([
                'Royal Commission for Riyadh City',
                'Eastern Province Municipality',
                'Red Sea Development Co.',
                'Saudi Aramco Facilities',
            ]),
            'location' => $this->faker->randomElement([
                'King Abdullah Financial District, Riyadh',
                'Corniche Road, Dammam',
                'Al Hamra District, Jeddah',
                'NEOM, Tabuk Province',
            ]),
            'start_date' => $this->faker->dateTimeBetween('-9 months', '-1 month'),
            'status' => ProjectStatus::Active,
        ];
    }
}
