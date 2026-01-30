<?php

namespace App\Http\Controllers;

use App\Models\PatientVisit;
use App\Models\VisitOrder;
use App\Models\VisitOrderItem;
use App\Models\VisitResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LabResultController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');

        $query = VisitOrder::where('order_type', 'lab')
            ->with([
                'visit.patient',
                'items.labSample',
                'items.result',
                'items.labService.labResultType',
                'items.labService.resultOptions' => function ($q) {
                    $q->orderBy('display_order');
                },
                'items.labService.resultParameters.referenceRanges' => function ($q) {
                    $q->where('is_active', true)->orderBy('id');
                },
            ])
            ->orderBy('requested_at', 'asc');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('visit', function ($subQuery) use ($search) {
                        $subQuery->where('visit_number', 'like', "%{$search}%")
                            ->orWhereHas('patient', function ($patientQuery) use ($search) {
                                $patientQuery->where('first_name', 'like', "%{$search}%")
                                    ->orWhere('last_name', 'like', "%{$search}%")
                                    ->orWhere('name', 'like', "%{$search}%");
                            });
                    });
            });
        }

        if (!empty($status) && $status !== 'all') {
            if ($status === 'pending') {
                $query->whereHas('items', function ($itemQuery) {
                    $itemQuery->whereDoesntHave('result');
                });
            } elseif ($status === 'entered') {
                $query->whereHas('items', function ($itemQuery) {
                    $itemQuery->whereHas('result', function ($resultQuery) {
                        $resultQuery->whereNull('verified_at');
                    });
                });
            } elseif ($status === 'verified') {
                $query->whereHas('items', function ($itemQuery) {
                    $itemQuery->whereHas('result', function ($resultQuery) {
                        $resultQuery->whereNotNull('verified_at');
                    });
                });
            }
        }

        $labResults = $query->paginate(15)->withQueryString();

        $groupedOrders = $labResults->getCollection()->groupBy(function ($order) {
            return $order->visit->id;
        })->map(function ($visitOrders) {
            $firstOrder = $visitOrders->first();
            return [
                'patient' => $firstOrder->visit->patient,
                'visit' => $firstOrder->visit,
                'orders' => $visitOrders,
                'total_items' => $visitOrders->sum(function ($order) {
                    return $order->items->count();
                }),
                'all_items' => $visitOrders->flatMap(function ($order) {
                    return $order->items->map(function ($item) use ($order) {
                        $item->visit_order_id = $order->id;
                        return $item;
                    });
                })->values(),
            ];
        })->values();

        $groupedCollection = new \Illuminate\Support\Collection($groupedOrders);
        $labResults->setCollection($groupedCollection);

        return Inertia::render('Lab/Results', [
            'labResults' => $labResults,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function storeItemResult(Request $request, $itemId): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'result_format' => 'required|string|in:machine_based,simple_options,parameter_based,complex_hormone,custom_fields',
            'result_payload' => 'required|array',
        ]);

        try {
            $item = VisitOrderItem::with(['order'])->findOrFail($itemId);

            VisitResult::updateOrCreate(
                ['visit_order_item_id' => $item->id],
                [
                    'visit_order_id' => $item->visit_order_id,
                    'result_payload' => [
                        'result_format' => $validated['result_format'],
                        'payload' => $validated['result_payload'],
                    ],
                    'recorded_by' => Auth::id(),
                    'verified_by' => null,
                    'verified_at' => null,
                ]
            );

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Result saved successfully']);
            }

            return back()->with('success', 'Result saved successfully');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Failed to save result', 'error' => $e->getMessage()], 500);
            }

            return back()->with('error', 'Failed to save result: ' . $e->getMessage());
        }
    }

    public function verifyItemResult(Request $request, $itemId): RedirectResponse|JsonResponse
    {
        try {
            $item = VisitOrderItem::with(['order', 'result'])->findOrFail($itemId);

            if (! $item->result) {
                if ($request->wantsJson()) {
                    return response()->json(['message' => 'No result found to verify'], 404);
                }

                return back()->with('error', 'No result found to verify');
            }

            $item->result->update([
                'verified_by' => Auth::id(),
                'verified_at' => now(),
            ]);

            if ($item->order) {
                $hasPendingVerification = $item->order->items()
                    ->whereDoesntHave('result', function ($q) {
                        $q->whereNotNull('verified_at');
                    })
                    ->exists();

                if (! $hasPendingVerification) {
                    $item->order->update([
                        'status' => 'completed',
                        'completed_at' => now(),
                    ]);
                }
            }

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Result verified successfully']);
            }

            return back()->with('success', 'Result verified successfully');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Failed to verify result', 'error' => $e->getMessage()], 500);
            }

            return back()->with('error', 'Failed to verify result: ' . $e->getMessage());
        }
    }

    public function printVisitResults($visitId)
    {
        $visit = PatientVisit::with([
            'patient',
            'orders.items.result',
            'orders.items.labService.labResultType',
            'orders.items.labService.resultOptions',
            'orders.items.labService.resultParameters.referenceRanges' => function ($q) {
                $q->where('is_active', true)->orderBy('id');
            },
            'orders.items.labSample',
        ])->findOrFail($visitId);

        $labOrders = $visit->orders->where('order_type', 'lab');
        $items = $labOrders->flatMap(function ($order) {
            return $order->items->map(function ($item) use ($order) {
                $item->visit_order_id = $order->id;
                return $item;
            });
        })->values();

        return Inertia::render('Lab/ResultPrint', [
            'visit' => $visit,
            'patient' => $visit->patient,
            'items' => $items,
        ]);
    }
}
