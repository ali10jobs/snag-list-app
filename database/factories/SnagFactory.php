<?php

namespace Database\Factories;

use App\Enums\Severity;
use App\Enums\SnagStatus;
use App\Enums\Trade;
use App\Models\Project;
use App\Models\Snag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Snag>
 */
class SnagFactory extends Factory
{
    protected $model = Snag::class;

    public function definition(): array
    {
        $trade = $this->faker->randomElement(Trade::cases());

        return [
            'project_id' => Project::factory(),
            'title' => 'Generic snag — please override via state()',
            'description' => $this->faker->sentence(14),
            'location' => $this->faker->randomElement([
                'Level 1, Lobby',
                'Level 2, Corridor C-12',
                'Level 3, Unit 304, Master Bathroom',
                'Level 4, Mechanical Room',
                'Level 5, Meeting Room 4B',
                'Roof, AHU Plant Area',
                'Basement 1, Pump Room',
            ]),
            'trade' => $trade,
            'severity' => $this->faker->randomElement(Severity::cases()),
            'status' => $this->faker->randomElement([
                SnagStatus::Open,
                SnagStatus::Open,
                SnagStatus::Open,
                SnagStatus::InProgress,
                SnagStatus::Closed,
            ]),
            'photo_path' => null,
            'assigned_to' => $this->faker->randomElement([
                null,
                'ABC Electrical Contractors',
                'Al-Bawani MEP',
                'Saudi Binladin Civil',
                'Drake & Scull Plumbing',
                'Almabani Finishing Works',
            ]),
            'due_date' => $this->faker->optional(0.6)->dateTimeBetween('+1 week', '+2 months'),
        ];
    }
}
