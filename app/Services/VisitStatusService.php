<?php

namespace App\Services;
use App\Models\VisitStatus;

class VisitStatusService
{
    public function searchVisitStatuses($query)
    {
        return VisitStatus::where('code', 'like', "%$query%")
            ->orWhere('name', 'like', "%$query%");
    }

    public function getAllVisitStatuses()
    {
        return VisitStatus::ordered()->paginate(10);
    }

    public function getTerminalVisitStatuses()
    {
        return VisitStatus::terminal()->ordered()->get();
    }

    public function getNonTerminalVisitStatuses()
    {
        return VisitStatus::nonTerminal()->ordered()->get();
    }

    public function getVisitStatusById($id)
    {
        return VisitStatus::find($id);
    }

    public function getVisitStatusByCode($code)
    {
        return VisitStatus::where('code', $code)->first();
    }

    public function createVisitStatus(array $data): VisitStatus
    {
        return VisitStatus::create($data);
    }

    public function updateVisitStatus(string $id, array $data): VisitStatus
    {
        $visitStatus = VisitStatus::findOrFail($id);
        $visitStatus->update($data);
        return $visitStatus;
    }

    public function deleteVisitStatus(string $id): void
    {
        VisitStatus::findOrFail($id)->delete();
    }

    public function restoreVisitStatus(string $id): void
    {
        VisitStatus::withTrashed()->findOrFail($id)->restore();
    }

    public function getTrashedVisitStatuses()
    {
        return VisitStatus::onlyTrashed()->get();
    }

    public function toggleTerminalStatus(string $id): VisitStatus
    {
        $visitStatus = VisitStatus::findOrFail($id);
        $visitStatus->is_terminal = !$visitStatus->is_terminal;
        $visitStatus->save();
        return $visitStatus;
    }

    public function getNextSequence(): int
    {
        return VisitStatus::max('sequence') + 1;
    }

    public function reorderSequences(array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            VisitStatus::where('id', $id)->update(['sequence' => $index + 1]);
        }
    }
}
