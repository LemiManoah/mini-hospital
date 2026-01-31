# Inventory Module Requirements

## Purpose
Create a centralized inventory module that tracks stock and consumables (drugs, consumables, general supplies), supports requisitions from other modules (lab, pharmacy, wards/clinics), manages purchasing (LPO), provides stocking history, and supports reconciliation. The module should reduce stock-outs, improve accountability, and enable sales-ready reporting for administrators and procurement.

## Goals
- Single source of truth for all stockable items across departments.
- Clear audit trail for every stock movement (receipts, issues, adjustments, transfers, expiries, returns).
- Strong requisition workflow connected to Lab, Pharmacy, and other modules.
- Accurate stock balances per store and per batch/expiry where relevant.
- Purchasing controls with LPO generation and vendor tracking.
- Better decision-making with reorder alerts, usage analytics, and cost visibility.

## Core Concepts
- **Item Catalog**: Master list of items (drugs, consumables, general supplies).
- **Stores**: Physical or logical stock locations (Main Store, Pharmacy Store, Lab Store, Ward Store).
- **Stock Lots/Batches**: Items tracked with batch number, expiry date, unit cost, vendor.
- **Stock Movements**: Immutable ledger entries for all inventory changes.
- **Requisitions**: Requests from consuming modules or departments.
- **Approvals**: Requisition and purchasing approvals.
- **LPO**: Local Purchase Order linked to vendors and requisitions.
- **GRN / Receipt**: Goods Receipt Note tied to LPO and stock entries.

## Item Catalog Requirements
- **Item Types**: Drug, Consumable, General Supply.
- **Fields**:
  - Item Name, Code/SKU, Category, Unit of Measure, Pack Size
  - Is Controlled (bool) for regulated drugs
  - Is Expirable (bool), Default Expiry Range
  - Default Supplier (optional)
  - Minimum Stock, Reorder Level, Max Stock
  - Cost Price (default), Selling Price (if billable)
  - Linked Service(s) (optional mapping to billing/services)
- **Barcodes**: Optional barcode support for receiving/issuing.

## Stores & Locations
- Support multiple stores with independent stock balances.
- Default stores: Main Store, Pharmacy Store, Lab Store, Ward Store.
- Facilities may **disable Main Store**. When disabled, stores can receive/record stock directly without requisitioning from Main Store.
- Each store has:
  - Store Manager
  - Allowed item categories (optional restrictions)
  - Reorder thresholds (global + overrides)
- Optional bin/location tracking for internal organization.

## Stock Movements (Ledger)
Every stock change is recorded as a movement with:
- Date/Time, Item, Store, Quantity (+/-), Unit Cost
- Movement Type: Receipt, Issue, Transfer In/Out, Adjustment, Return, Expired, Damaged
- Source Document: LPO, GRN, Requisition, Adjustment Note, Return Note
- Per-lot or per-batch details for expirable items
- User who performed action

## Stocking History
- Full movement history per item and per store.
- Filters by date range, movement type, user, source document.
- Traceability: track who issued/received and why.

## Reconciliation (Stock Count & Variance)
- Support periodic stock counts per store (cycle count and full count).
- Count sessions include:
  - Store, count date, counted by, items counted, expected vs actual
  - Variance calculations and variance value
- Reconciliation states:
  - Draft → Submitted → Approved → Posted
- Posting a reconciliation creates adjustment movements with reason code “stock count variance.”
- Reconciliation report should be exportable and auditable.

## Requisition Workflow
- Requisitions originate from:
  - Lab Module (drugs, consumables)
  - Pharmacy Module (drugs)
  - Clinics/Wards (sundries, consumables)
- Requisition states:
  - Draft → Submitted → Approved/Rejected → Fulfilled → Closed
- Fields:
  - Requesting Department/Module, Requested Items, Quantities, Priority
  - Reason/Notes, Required By Date
- Approval:
  - Role-based approvals (configurable)
- Fulfillment:
  - Partial fulfillment allowed
  - Issues stock from selected store and updates balances
- Store sourcing rules:
  - If Main Store is enabled, Pharmacy/Lab/Ward requisition from Main Store by default.
  - If Main Store is disabled, stores may fulfill from their own received stock.

## LPO (Local Purchase Order)
- Generate LPO from:
  - Reorder alerts
  - Approved requisitions
  - Manual procurement request
- LPO fields:
  - Supplier, Items, Quantities, Unit Cost, Total
  - Delivery Date, Terms, Notes
- LPO states:
  - Draft → Approved → Sent → Partially Received → Closed

## Goods Receipt Note (GRN)
- Record deliveries against an LPO
- Support partial receipts
- Capture batch, expiry, cost, and quantity per item
- Update stock ledger and store balances

## Manual Stock Entry (Non‑LPO Receipts)
- Allow manual stock receipts into any store (especially when Main Store is disabled).
- Required fields:
  - Supplier (optional), Item, Quantity, Unit Cost, Batch/Expiry (if applicable)
  - Reason (e.g., donation, emergency purchase, opening balance)
- Creates stock movements of type “Receipt (Manual).”

## Inventory Adjustments
- Controlled adjustments with reason codes:
  - Loss, damage, expiry, correction, audit variance
- Require approvals for high-impact adjustments
- Maintain audit trail with notes

## Integration Requirements
- **Pharmacy**: Dispensing uses inventory issue transactions; if stock unavailable, show shortage.
- **Lab**: Test usage triggers requisitions or direct issue for reagents.
- **Billing**: Items marked billable should link to services for charges.
- **Reports**: Provide usage and valuation summaries for admin.

## Reports & Analytics
- Stock on Hand by Store and Category
- Reorder Alerts (below minimum)
- Expiry Report (next 30/60/90 days)
- Stock Valuation (FIFO/Weighted Avg)
- Consumption by Department/Module
- Supplier performance (lead time, delivery variance)
- Audit variance report

## Security & Permissions
- Role-based access:
  - Inventory Admin
  - Store Manager
  - Requester (Lab/Pharmacy)
  - Approver
- Actions requiring approval:
  - Large adjustments
  - LPO approval
  - Requisition approval

## UI/UX Expectations
- Dashboard: Quick view of low stock, pending requisitions, expiring items.
- Item Card: Summary of stock across stores + recent movement.
- Store View: Current stock, reorder status, issues/receipts.
- Requisition List: Filters by status, department, date.
- LPO List: Status, vendor, items summary.
- Clear modals/forms for receipts and adjustments.

## UI Screens (Suggested)
1. **Inventory Dashboard**
   - KPIs: Low stock count, Pending requisitions, Expiring soon, Stock value.
   - Widgets: Reorder alerts, Recent receipts, Recent issues, Reconciliation status.
2. **Item Catalog**
   - List with search/filter by type (drug/consumable/general).
   - Item detail: stock by store, batch/expiry list, pricing, recent movements.
3. **Store Stock View**
   - Store selector (Main/Pharmacy/Lab/Ward).
   - Stock table: on hand, reorder status, expiry flags.
   - Actions: Receive stock, Issue stock, Transfer, Reconcile.
4. **Manual Stock Receipt**
   - Form: Store, Item, Qty, Unit cost, Batch/Expiry, Reason.
   - Attachments: supplier invoice (optional).
5. **Requisitions**
   - List (status tabs: Draft/Submitted/Approved/Fulfilled/Closed).
   - Requisition detail: items, requested vs issued, fulfillment history.
6. **LPO Management**
   - LPO list + detail view.
   - Generate LPO from reorder alerts or requisitions.
7. **Goods Receipt (GRN)**
   - LPO selection, partial receipt handling, batch/expiry capture.
8. **Reconciliation**
   - Create count session, enter counted qty.
   - Variance report + approval.
9. **Reports**
   - Stock on hand, expiry report, valuation, consumption by store/department.

## Workflow Diagrams (Text)
### 1) Requisition → Issue
```
Requester (Lab/Pharmacy/Ward)
        │
        ▼
Create Requisition (Draft)
        │
        ▼
Submit → Approve/Reject
        │
        ▼
Issue Stock from Store
        │
        ▼
Requisition Fulfilled/Closed
```

### 2) Reorder → LPO → Receipt
```
Low Stock Alert
      │
      ▼
Generate LPO (Draft → Approved → Sent)
      │
      ▼
Receive Goods (GRN)
      │
      ▼
Stock Ledger Updated + On Hand Increased
```

### 3) Manual Receipt (Main Store Disabled)
```
Local Purchase/Donation
      │
      ▼
Manual Stock Receipt (Store: Pharmacy/Lab/Ward)
      │
      ▼
Stock Ledger Updated
```

### 4) Stock Reconciliation
```
Create Count Session
      │
      ▼
Enter Counted Qty
      │
      ▼
Variance Review → Approve
      │
      ▼
Post Adjustments to Ledger
```

## Data Model Suggestions
- Items
- Stores
- StoreStock (pivot: store_id, item_id, on_hand)
- StockLots (item_id, store_id, batch_no, expiry, qty, unit_cost)
- StockMovements (item_id, store_id, qty, type, reference_type, reference_id, user_id)
- Requisitions + RequisitionItems
- LPO + LPOItems
- GoodsReceipts + GoodsReceiptItems
- StockReconciliations + StockReconciliationItems
- Suppliers

## How It Improves the System
- **Operational continuity**: avoids stock-outs for lab/pharmacy and supports safe patient care.
- **Financial control**: accurate stock valuation and reduced wastage.
- **Accountability**: complete audit trail for compliance.
- **Process efficiency**: automated reorder alerts and requisition workflows.
- **Integration**: seamless consumption tracking by clinical modules.

## How It Makes the System More Salable
- End-to-end workflow (procurement → receipt → issue → audit) in one platform.
- Strong compliance and traceability, attractive to regulated healthcare facilities.
- Supports multi-store setups (common in mid-to-large hospitals).
- Analytics and reporting for management decision-making.
- Clear ROI: reduced wastage, improved service availability, and better procurement planning.

## Out of Scope (Phase 1)
- Advanced forecasting with AI
- Vendor EDI integrations
- Mobile barcode scanning app

## Future Enhancements (Phase 2+)
- Automated reorder suggestions based on consumption trends
- Supplier portal for LPO confirmations
- Barcode scanning and mobile stock counts
- Multi-currency procurement
