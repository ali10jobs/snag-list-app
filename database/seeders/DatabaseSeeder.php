<?php

namespace Database\Seeders;

use App\Enums\ProjectStatus;
use App\Enums\Severity;
use App\Enums\SnagStatus;
use App\Enums\Trade;
use App\Models\Comment;
use App\Models\Project;
use App\Models\Snag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Demo Inspector',
            'email' => 'demo@snags.test',
            'password' => bcrypt('password'),
        ]);

        $riyadh = Project::create([
            'name' => 'Riyadh Metro Station Fit-Out',
            'client' => 'Royal Commission for Riyadh City',
            'location' => 'King Abdullah Financial District, Riyadh',
            'start_date' => Carbon::parse('2025-09-15'),
            'status' => ProjectStatus::Active,
        ]);

        $dammam = Project::create([
            'name' => 'Dammam Corniche Tower Phase 2',
            'client' => 'Eastern Province Municipality',
            'location' => 'Corniche Road, Dammam',
            'start_date' => Carbon::parse('2025-11-01'),
            'status' => ProjectStatus::Active,
        ]);

        $this->seedRiyadhSnags($riyadh);
        $this->seedDammamSnags($dammam);
    }

    private function seedRiyadhSnags(Project $project): void
    {
        $snags = [
            ['Cracked tile at WC-3 entrance, Level 2', 'Concourse Level, Public WC-3', Trade::Finishing, Severity::Medium, SnagStatus::Open, 'Almabani Finishing Works'],
            ['Exposed conduit above false ceiling in Meeting Room 4B', 'Level 4, Meeting Room 4B', Trade::Electrical, Severity::High, SnagStatus::InProgress, 'ABC Electrical Contractors'],
            ['Misaligned gypsum ceiling grid, corridor C-12', 'Level 3, Corridor C-12', Trade::Finishing, Severity::Low, SnagStatus::Open, 'Almabani Finishing Works'],
            ['Chilled water pipe insulation missing — AHU-04', 'Roof, AHU Plant Area', Trade::Hvac, Severity::High, SnagStatus::Open, 'Drake & Scull MEP'],
            ['Door closer not adjusted on staff entrance', 'Ground Floor, Staff Entrance', Trade::Finishing, Severity::Low, SnagStatus::Closed, null],
            ['Fire damper interlock fails commissioning test', 'Level 5, Mechanical Riser', Trade::Hvac, Severity::Critical, SnagStatus::InProgress, 'Drake & Scull MEP'],
            ['Concrete spalling at column C-7 base', 'Basement 1, Column C-7', Trade::Structural, Severity::Critical, SnagStatus::Open, 'Saudi Binladin Civil'],
            ['Sanitary waste line slope below specification', 'Level 2, WC-3 Riser', Trade::Plumbing, Severity::High, SnagStatus::Open, 'Drake & Scull Plumbing'],
            ['Lighting fixture wattage mismatch with submittal', 'Level 1, Concourse Lobby', Trade::Electrical, Severity::Medium, SnagStatus::Open, 'ABC Electrical Contractors'],
            ['Floor screed level out of tolerance (8mm over 3m)', 'Level 3, Unit 304 lobby', Trade::Civil, Severity::Medium, SnagStatus::InProgress, 'Saudi Binladin Civil'],
            ['Cable tray support spacing exceeds 1.5m', 'Level 4, Service Corridor', Trade::Electrical, Severity::Low, SnagStatus::Closed, 'ABC Electrical Contractors'],
            ['Glass partition gasket cut short — air leak', 'Level 2, Operations Room', Trade::Finishing, Severity::Medium, SnagStatus::Open, 'Almabani Finishing Works'],
            ['Earthing continuity reading 1.4Ω above limit', 'Basement 2, MV Switchgear Room', Trade::Electrical, Severity::High, SnagStatus::Open, 'ABC Electrical Contractors'],
            ['HVAC supply diffuser missing balancing damper', 'Level 5, Server Room', Trade::Hvac, Severity::Medium, SnagStatus::Open, 'Drake & Scull MEP'],
            ['Wet trap on cleaner sink vents to wrong stack', 'Level 1, Cleaner Cupboard', Trade::Plumbing, Severity::Low, SnagStatus::Rejected, null],
        ];

        foreach ($snags as [$title, $location, $trade, $severity, $status, $assigned]) {
            $snag = Snag::factory()->create([
                'project_id' => $project->id,
                'title' => $title,
                'location' => $location,
                'trade' => $trade,
                'severity' => $severity,
                'status' => $status,
                'assigned_to' => $assigned,
            ]);

            Comment::factory()
                ->count(fake()->numberBetween(0, 2))
                ->create(['snag_id' => $snag->id]);
        }
    }

    private function seedDammamSnags(Project $project): void
    {
        $snags = [
            ['Marble cladding hairline crack at podium entrance', 'Podium Level, Main Lobby', Trade::Finishing, Severity::Medium, SnagStatus::Open, 'Almabani Finishing Works'],
            ['Smoke detector test reports 2× false alarms', 'Level 12, Office Floor', Trade::Electrical, Severity::Critical, SnagStatus::InProgress, 'ABC Electrical Contractors'],
            ['Chiller condenser water flow 18% below design', 'Roof, Mechanical Penthouse', Trade::Hvac, Severity::High, SnagStatus::Open, 'Drake & Scull MEP'],
            ['Curtain wall sealant skipped at typical floor mullion', 'Levels 6–9, North Façade', Trade::Finishing, Severity::High, SnagStatus::Open, 'Almabani Finishing Works'],
            ['Drainage gully flooded during pressure test', 'Basement 2, Car Park', Trade::Plumbing, Severity::High, SnagStatus::InProgress, 'Drake & Scull Plumbing'],
            ['Light fitting flickering on emergency circuit', 'Stair Core SC-2, Level 8', Trade::Electrical, Severity::Medium, SnagStatus::Open, 'ABC Electrical Contractors'],
            ['Anchor bolt projection short for steel canopy', 'Ground Floor, North Entrance', Trade::Structural, Severity::High, SnagStatus::Open, 'Saudi Binladin Civil'],
            ['Skirting tile gap >3mm in residential corridor', 'Level 14, Corridor', Trade::Finishing, Severity::Low, SnagStatus::Closed, null],
            ['Fan coil unit drip tray not draining', 'Level 7, Unit 712', Trade::Hvac, Severity::Medium, SnagStatus::Open, 'Drake & Scull MEP'],
            ['Cable colour-coding incorrect on lighting subcircuit', 'Level 10, DB-L10A', Trade::Electrical, Severity::Medium, SnagStatus::InProgress, 'ABC Electrical Contractors'],
            ['Gypsum board joint cracked above corridor doorway', 'Level 5, Corridor', Trade::Finishing, Severity::Low, SnagStatus::Open, 'Almabani Finishing Works'],
            ['MV cable termination torque check pending', 'Basement 1, Substation', Trade::Electrical, Severity::Critical, SnagStatus::Open, 'ABC Electrical Contractors'],
            ['Floor drain centerline offset 40mm from spec', 'Level 9, Pantry', Trade::Plumbing, Severity::Low, SnagStatus::Rejected, 'Drake & Scull Plumbing'],
            ['Painted surface holiday detected after primer coat', 'Level 11, Lift Lobby', Trade::Finishing, Severity::Medium, SnagStatus::Open, 'Almabani Finishing Works'],
            ['Steel fire escape balustrade welds incomplete', 'Stair Core SC-1, Level 13', Trade::Structural, Severity::High, SnagStatus::InProgress, 'Saudi Binladin Civil'],
        ];

        foreach ($snags as [$title, $location, $trade, $severity, $status, $assigned]) {
            $snag = Snag::factory()->create([
                'project_id' => $project->id,
                'title' => $title,
                'location' => $location,
                'trade' => $trade,
                'severity' => $severity,
                'status' => $status,
                'assigned_to' => $assigned,
            ]);

            Comment::factory()
                ->count(fake()->numberBetween(0, 2))
                ->create(['snag_id' => $snag->id]);
        }
    }
}
