<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\VisitOrderService;
use App\Models\VisitOrder;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class VisitOrderController extends Controller
{
    public function __construct(
        protected VisitOrderService $visitOrderService
    ) {}

    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'visit_id' => 'required|exists:patient_visits,id',
            'order_type' => 'required|in:lab,pharmacy,radiology',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:lab_services,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        try {
            if ($validated['order_type'] === 'lab') {
                $order = $this->visitOrderService->createLabOrder($validated);
            } else {
                // Handle other order types (pharmacy, radiology) in future
                if ($request->wantsJson()) {
                    return response()->json(['message' => 'Order type not yet supported'], 422);
                }

                return back()->with('error', 'Order type not yet supported');
            }

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Lab order placed successfully', 'order_id' => $order->id]);
            }

            return back()->with('success', 'Lab order placed successfully');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Failed to place order', 'error' => $e->getMessage()], 500);
            }

            return back()->with('error', 'Failed to place order: ' . $e->getMessage());
        }
    }

    public function labQueue()
    {
        $search = request()->get('search');
        $status = request()->get('status');

        $query = VisitOrder::where('order_type', 'lab')
            ->whereIn('status', ['requested', 'processing'])
            ->with(['visit.patient', 'items.service', 'items.labSample'])
            ->orderBy('created_at', 'asc');

        // Apply filters
        if (!empty($search)) {
            $query = $query->where(function($q) use ($search) {
                $q->whereHas('visit.patient', function($subQuery) use ($search) {
                    $subQuery->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('name', 'like', "%{$search}%");
                })->orWhere('visit_number', 'like', "%{$search}%");
            });
        }

        if (!empty($status) && $status !== 'all') {
            $query = $query->where('status', $status);
        }

        $labQueue = $query->paginate(20)->withQueryString();

        return Inertia::render('Lab/Queue', [
            'labQueue' => $labQueue,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function patientLabHistory($patientId)
    {
        $labHistory = $this->visitOrderService->getPatientLabHistory($patientId);

        return response()->json($labHistory);
    }

    public function updateStatus(Request $request, $orderId): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:requested,processing,completed,cancelled',
        ]);

        try {
            $order = $this->visitOrderService->updateOrderStatus($orderId, $validated['status']);
            
            return back()->with('success', 'Order status updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }
}
