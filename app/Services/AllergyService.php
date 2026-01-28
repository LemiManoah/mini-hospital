<?php

namespace App\Services;
use App\Models\Allergy;

class AllergyService
{
    public function searchAllergies($query)
    {
        return Allergy::where('name', 'like', "%$query%")
            ->orWhere('description', 'like', "%$query%")
            ->orWhere('reaction_type', 'like', "%$query%");
    }
    
    public function getAllAllergies()
    {
        return Allergy::paginate(10);
    }

    public function getActiveAllergies()
    {
        return Allergy::active()->get();
    }

    public function getAllergyById($id)
    {
        return Allergy::find($id);
    }

    public function createAllergy(array $data): Allergy
    {
        return Allergy::create($data);
    }

    public function updateAllergy(string $id, array $data): Allergy
    {
        $allergy = Allergy::findOrFail($id);
        $allergy->update($data);
        return $allergy;
    }

    public function deleteAllergy(string $id): void
    {
        Allergy::findOrFail($id)->delete();
    }

    public function restoreAllergy(string $id): void
    {
        Allergy::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedAllergies()
    {
        return Allergy::onlyTrashed()->get();
    }
}
