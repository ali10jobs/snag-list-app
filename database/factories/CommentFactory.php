<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Snag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'snag_id' => Snag::factory(),
            'author' => $this->faker->randomElement([
                'Ahmed Al-Saud (Site Engineer)',
                'Sarah Khan (QS Consultant)',
                'Omar Al-Harbi (Project Manager)',
                'Fatima Al-Ghamdi (MEP Lead)',
                'David Lin (Resident Engineer)',
            ]),
            'body' => $this->faker->randomElement([
                'Site visit completed. Awaiting subcontractor response.',
                'Photo attached to RFI #142. Forwarded to MEP team.',
                'Closed after re-inspection on site walk.',
                'Trade contractor disputes scope — escalating to PM.',
                'Materials on order, ETA 5 working days.',
                'Re-test after rectification confirmed compliance.',
            ]),
        ];
    }
}
