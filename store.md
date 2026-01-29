# Store Module (Inventory)

## Purpose
Manage non-pharmacy consumables and supplies used during visits (e.g., bandages, syringes, disposables). Provides stock control, pricing, and consumption tracking tied to visit orders.

## Core Features
- Items catalog (SKU, name, category, unit, reorder level)
- Stock lots/batches (quantity, expiry, cost)
- Stock movements (in/out/adjustment)
- Supplier records and purchase receipts
- Pricing (cash/insurance tiers)
- Issue/consume items from visit orders

## Key Tables
- store_items
- store_item_batches
- store_stock_movements
- store_suppliers
- store_receipts
- store_receipt_items

## Visit Integration
- VisitOrder with order_type = service
- VisitOrderItem references a store_item/service
- Stock deduction on order fulfillment

## Minimal APIs/Endpoints
- GET/POST /store/items
- POST /store/items/{id}/receive
- POST /store/items/{id}/adjust
- POST /visit-orders (order_type=service)
- POST /visit-order-items

## UI Pages
- Store Items list + create/edit
- Stock receipt (add stock)
- Stock adjustments
- Issue to Visit (from consultation tab)

## Dependencies
- services table if you unify services; otherwise store_items are separate
- billing charge items (optional, for charging)
