<?php

namespace App\Services;

use App\Models\VisitOrder;
use App\Models\VisitOrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VisitOrderService
{
    public function createLabOrder(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Generate unique order number
            $orderNumber = 'ORD-'.date('Ymd').'-'.str_pad(VisitOrder::max('id') + 1, 4, '0', STR_PAD_LEFT);

            $order = VisitOrder::create([
                'visit_id' => $data['visit_id'],
                'ordered_by' => Auth::id(),
                'order_type' => 'lab',
                'order_number' => $orderNumber,
                'status' => 'requested',
                'priority' => $data['priority'] ?? 'normal',
                'clinical_notes' => $data['clinical_notes'] ?? null,
                'doctor_instructions' => $data['doctor_instructions'] ?? null,
                'requested_at' => now(),
            ]);

            // Create order items
            foreach ($data['items'] as $item) {
                $orderItem = VisitOrderItem::create([
                    'visit_order_id' => $order->id,
                    'item_type' => 'lab_service', // Lab orders use lab_service
                    'item_id' => $item['service_id'], // This is lab_service_id
                    'qty' => $item['quantity'],
                    'price' => $item['price'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            return $order;
        });
    }

    public function getLabOrdersByVisit($visitId)
    {
        return VisitOrder::where('visit_id', $visitId)
            ->where('order_type', 'lab')
            ->with(['items.labService.sampleType', 'items.labSample'])
            ->get();
    }

    public function getLabQueue()
    {
        return VisitOrder::where('order_type', 'lab')
            ->whereIn('status', ['requested', 'processing'])
            ->with(['visit.patient', 'items.labService.sampleType', 'items.labSample'])
            ->orderBy('requested_at', 'asc')
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
