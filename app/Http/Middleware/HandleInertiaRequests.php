<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();
        $direction = in_array($locale, ['ar', 'he', 'fa', 'ur'], true) ? 'rtl' : 'ltr';

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'locale' => $locale,
            'direction' => $direction,
            'translations' => fn () => $this->translations($locale),
            'demoMode' => (bool) env('DEMO_MODE', false),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Load the JSON translation bundle for the active locale (resources/lang/{locale}.json or lang/{locale}.json).
     *
     * @return array<string, string>
     */
    private function translations(string $locale): array
    {
        $path = base_path("lang/{$locale}.json");

        if (! is_file($path)) {
            return [];
        }

        return json_decode((string) file_get_contents($path), true) ?: [];
    }
}
