<?php

namespace App\Services;

use App\Models\VisitOrder;
use App\Models\VisitOrderItem;
use App\Models\LabSample;
use App\Models\LabService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class VisitOrderService
{
    public function createLabOrder(array $data): VisitOrder
    {
        return DB::transaction(function () use ($data) {
            // Create the main order
            $order = VisitOrder::create([
                'visit_id' => $data['visit_id'],
                'ordered_by' => Auth::id(),
                'order_type' => 'lab',
                'status' => 'requested',
            ]);

            // Create order items
            foreach ($data['items'] as $item) {
                $orderItem = VisitOrderItem::create([
                    'visit_order_id' => $order->id,
                    'service_id' => $item['service_id'],
                    'qty' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                // Create lab samples for each item
                for ($i = 0; $i < $item['quantity']; $i++) {
                    $labService = LabService::find($item['service_id']);
                    
                    // Generate unique sample number
                    $sampleNumber = 'SMP-' . date('Ymd') . '-' . str_pad(VisitOrder::max('id') + 1, 4, '0', STR_PAD_LEFT) . '-' . ($i + 1);
                    
                    LabSample::create([
                        'sample_number' => $sampleNumber,
                        'visit_order_item_id' => $orderItem->id,
                        'sample_type_id' => $labService->sample_type_code 
                            ? \App\Models\LabSampleType::where('code', $labService->sample_type_code)->first()?->id
                            : null,
                        'status' => 'collected', // Use valid enum value
                    ]);
                }
            }

            return $order;
        });
    }

    public function getLabOrdersByVisit($visitId)
    {
        return VisitOrder::where('visit_id', $visitId)
            ->where('order_type', 'lab')
            ->with(['orderItems.service', 'orderItems.labSample'])
            ->get();
    }

    public function getLabQueue()
    {
        return VisitOrder::where('order_type', 'lab')
            ->whereIn('status', ['requested', 'processing'])
            ->with(['visit.patient', 'orderItems.service', 'orderItems.labSample'])
            ->orderBy('created_at', 'asc')
            ->paginate(20);
    }

    public function updateOrderStatus($orderId, $status): VisitOrder
    {
        $order = VisitOrder::findOrFail($orderId);
        $order->status = $status;
        $order->save();
        
        return $order;
    }

    public function getPatientLabHistory($patientId, $limit = 50)
    {
        return VisitOrder::whereHas('visit', function ($query) use ($patientId) {
            $query->where('patient_id', $patientId);
        })
        ->where('order_type', 'lab')
        ->with(['visit', 'orderItems.service', 'orderItems.visitResult'])
        ->orderBy('created_at', 'desc')
        ->limit($limit)
        ->get();
    }
}
