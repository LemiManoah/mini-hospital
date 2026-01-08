<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CountryService;
use Inertia\Inertia;

class CountryController extends Controller
{
    protected CountryService $countryService;
    public function __construct(CountryService $countryService)
    {
        $this->countryService = $countryService;
    }
    public function index()
    {
        $countries = $this->countryService->getAllCountries();
        return Inertia::render('Countries/Index', [
            'countries' => $countries,
        ]);
    }
}
