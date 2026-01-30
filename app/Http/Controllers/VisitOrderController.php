<?php

namespace App\Http\Controllers;

use App\Models\VisitOrder;
use App\Services\VisitOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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

            return back()->with('error', 'Failed to place order: '.$e->getMessage());
        }
    }

    public function labQueue(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');

        $query = VisitOrder::where('order_type', 'lab')
            ->whereIn('status', ['requested', 'processing'])
            ->with(['visit.patient', 'items.labService.sampleType', 'items.labSample'])
            ->orderBy('requested_at', 'asc');

        // Apply filters
        if (! empty($search)) {
            $query = $query->where(function ($q) use ($search) {
                $q->whereHas('visit.patient', function ($subQuery) use ($search) {
                    $subQuery->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                })->orWhere('visit_number', 'like', "%{$search}%");
            });
        }

        if (! empty($status) && $status !== 'all') {
            $query = $query->where('status', $status);
        }

        $labQueue = $query->paginate(20)->withQueryString();

        // Group orders by patient to avoid repetition
        $groupedOrders = $labQueue->getCollection()->groupBy(function ($order) {
            return $order->visit->patient->id;
        })->map(function ($patientOrders) {
            $firstOrder = $patientOrders->first();

            return [
                'patient' => $firstOrder->visit->patient,
                'visit' => $firstOrder->visit,
                'orders' => $patientOrders,
                'total_items' => $patientOrders->sum(function ($order) {
                    return $order->items->count();
                }),
                'all_items' => $patientOrders->flatMap(function ($order) {
                    return $order->items;
                }),
            ];
        })->values();

        // Create a new paginator with grouped data
        $groupedCollection = new \Illuminate\Support\Collection($groupedOrders);
        $labQueue->setCollection($groupedCollection);

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

    public function pickSamples(Request $request, $orderId): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'sample_taken' => 'required|string|max:500',
            'collection_date' => 'required|date',
        ]);

        try {
            $order = VisitOrder::findOrFail($orderId);

            // Create lab samples for each order item
            foreach ($order->items as $item) {
                // Check if sample already exists
                $existingSample = $item->labSample;

                if ($existingSample) {
                    // Update existing sample
                    $existingSample->update([
                        'status' => 'collected',
                        'collected_at' => $validated['collection_date'],
                        'collected_by' => Auth::id(),
                    ]);
                } else {
                    // Create new sample record
                    $labService = \App\Models\LabService::find($item->item_id); // Use item_id
                    $sampleType = $labService->sampleType; // Direct relationship

                    $sampleNumber = 'SMP-'.date('Ymd').'-'.str_pad($order->id, 4, '0', STR_PAD_LEFT).'-'.$item->id;

                    \App\Models\LabSample::create([
                        'sample_number' => $sampleNumber,
                        'visit_order_item_id' => $item->id,
                        'sample_type_id' => $sampleType?->id,
                        'container' => $sampleType?->default_container,
                        'volume' => null, // Can be added later if needed
                        'status' => 'collected',
                        'collected_at' => $validated['collection_date'],
                        'collected_by' => Auth::id(),
                        'received_by' => null, // Will be set when received
                        'received_at' => null, // Will be set when received
                        'rejection_reason' => null, // Will be set if rejected
                    ]);
                }
            }

            // Update order status to processing
            $order->update([
                'status' => 'processing',
                'started_processing_at' => now(),
            ]);

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Samples picked successfully']);
            }

            return back()->with('success', 'Samples picked successfully');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Failed to pick samples', 'error' => $e->getMessage()], 500);
            }

            return back()->with('error', 'Failed to pick samples: '.$e->getMessage());
        }
    }

    public function pickSampleItem(Request $request, $itemId): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'sample_taken' => 'required|string|max:500',
            'collection_date' => 'required|date',
        ]);

        try {
            $item = \App\Models\VisitOrderItem::with(['labSample', 'order'])->findOrFail($itemId);

            $existingSample = $item->labSample;

            if ($existingSample) {
                $existingSample->update([
                    'status' => 'collected',
                    'collected_at' => $validated['collection_date'],
                    'collected_by' => Auth::id(),
                ]);
            } else {
                $labService = \App\Models\LabService::find($item->item_id);
                $sampleType = $labService?->sampleType;

                $sampleNumber = 'SMP-'.date('Ymd').'-'.str_pad($item->visit_order_id, 4, '0', STR_PAD_LEFT).'-'.$item->id;

                \App\Models\LabSample::create([
                    'sample_number' => $sampleNumber,
                    'visit_order_item_id' => $item->id,
                    'sample_type_id' => $sampleType?->id,
                    'container' => $sampleType?->default_container,
                    'volume' => null,
                    'status' => 'collected',
                    'collected_at' => $validated['collection_date'],
                    'collected_by' => Auth::id(),
                    'received_by' => null,
                    'received_at' => null,
                    'rejection_reason' => null,
                ]);
            }

            if ($item->order && $item->order->status === 'requested') {
                $item->order->update([
                    'status' => 'processing',
                    'started_processing_at' => now(),
                ]);
            }

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Sample picked successfully']);
            }

            return back()->with('success', 'Sample picked successfully');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Failed to pick sample', 'error' => $e->getMessage()], 500);
            }

            return back()->with('error', 'Failed to pick sample: '.$e->getMessage());
        }
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
            return back()->with('error', 'Failed to update status: '.$e->getMessage());
        }
    }
}
