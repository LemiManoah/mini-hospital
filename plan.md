# Implementation Plan for Recommended Modules

## 1) Visit Triage
- Create `visit_triage` migration with visit foreign key, vitals JSON, notes, triage_by, triage_at.
- Add `VisitTriage` model and relationships to `PatientVisit` and `User`.
- Update `PatientVisit` model to include `triage` relationship.

## 2) Visit Notes (Consultation)
- Create `visit_notes` migration with visit/doctor FKs and consultation fields.
- Add `VisitNote` model and relationships to `PatientVisit` and `User`.
- Update `PatientVisit` model to include `notes` relationship.

## 3) Visit Orders + Order Items
- Create `visit_orders` migration with visit/ordered_by FKs, order_type, status.
- Create `visit_order_items` migration with order/service FKs, qty, price.
- Add `VisitOrder` and `VisitOrderItem` models and relationships.
- Update `PatientVisit` model to include `orders` relationship.

## 4) Visit Results
- Create `visit_results` migration with order FK, result payload, recorded_by/verified_by, verified_at.
- Add `VisitResult` model and relationships to `VisitOrder` and `User`.

## 5) Visit Prescriptions + Items
- Create `visit_prescriptions` migration with visit/prescribed_by FKs and status.
- Create `visit_prescription_items` migration with prescription FK, drug_id, dosage, frequency, duration, qty, price, external_purchase.
- Add `VisitPrescription` and `VisitPrescriptionItem` models and relationships.
- Update `PatientVisit` model to include `prescriptions` relationship.

## 6) Billing Charge Items
- Create `billing_charge_items` migration with visit FK, item_type, item_id, qty, unit_price, total, payer_type, status.
- Add `BillingChargeItem` model and relationship to `PatientVisit`.

## 7) Payments
- Create `payments` migration with visit FK, amount, method, reference, received_by.
- Add `Payment` model and relationships to `PatientVisit` and `User`.

## 8) Admissions
- Create `admissions` migration with visit FK, ward/bed IDs, admitting_doctor_id, admitted_at, status.
- Add `Admission` model and relationships to `PatientVisit` and `User`.

## 9) Settings (General Policies)
- Create `settings` migration with boolean policy flags.
- Add `Setting` model to read/update global settings.

## 10) Wiring & Integrity
- Add model relationships in `PatientVisit` and related models.
- Ensure enums and casts align with status fields and booleans.
- Run migrations and verify schema integrity.



remove orders and complaint from visit and add to consultation
