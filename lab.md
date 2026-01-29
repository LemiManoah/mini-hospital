# Laboratory Module

## Purpose
Allow doctors to order lab investigations, capture results, and attach them to visits.

## Core Features
- Lab test catalog (name, specimen, price, turnaround time)
- Order workflow (ordered → collected → resulted → verified)
- Result entry templates (numeric/text)
- Doctor review of results in consultation
- Sample collection and handling (sample ID, rejection reasons, container, volume)
- Result verification workflow (verified_by, verified_at)
- Patient lab history and result trends
- Billing enforcement based on hospital settings (pay before service)

## Key Tables
- lab_tests (or services with type=lab)
- lab_service_categories
- lab_sample_types
- lab_result_options
- lab_samples
- visit_orders (order_type = lab)
- visit_order_items
- visit_results

## Visit Integration
- Consultation tab: order lab tests
- Lab queue: process orders and enter results
- Results visible in consultation overview
- Patient profile: view lab history

## Lab Management
- Lab services (catalog) with categories
- Sample types (blood, urine, swab, stool, etc.)
- Result options per test (eg positive or negative for malaria)
- Test panels (grouped tests like FBC)

## Sample Handling
- Collection workflow: collected_by, collected_at, container, volume
- Sample ID/barcode
- Sample status: collected → received → rejected
- Rejection reasons (e.g., hemolysis, insufficient volume)

## Results & Verification
- Result types: numeric / text / choice / boolean / panel
- Abnormal flags (high/low/critical)
- Critical value alerts to doctor
- Verification required before doctor can view (configurable)
- Result versioning and audit trail

## Billing & Payment Rules
- Link lab orders to billing charge items
- Enforce “pay before service” if enabled in general settings
- Insurance pre‑approval (optional)

## Roles & Permissions
- Lab tech: collect samples, enter results
- Lab supervisor: verify results
- Doctor: view verified results
- Finance/reception: clear payment where required

## Minimal APIs/Endpoints
- GET/POST /lab/tests
- POST /visit-orders (order_type=lab)
- POST /visit-order-items
- POST /visit-results
- POST /lab/samples
- POST /lab/results/verify
- GET /lab/patients/{patientId}/history

## UI Pages
- Lab tests catalog
- Lab order queue
- Result entry/verification
- Visit result viewer
- Sample collection/receiving
- Patient lab history

## Dependencies
- services table if unified
- billing_charge_items (optional)
- hospital settings (allow service before payment)
