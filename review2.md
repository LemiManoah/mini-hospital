# OPD Workflow – Data Model + Screens Checklist (Mapped to Existing Tables)

## 1) Core Flow Summary
Reception → Triage → Doctor Consultation → Orders (Lab/Procedures) → Lab Results → Doctor Review → Prescription → Finance → Pharmacy → Discharge/Admission

All steps should be tied to **one Patient Visit** record.

---

## 2) Data Model (New + Existing)

### Existing tables (already in project)
- **patients**: patient biodata, kin, category, contact.  (existing)
- **patient_categories**: cash/insurance flags.  (existing)
- **appointments**: pre‑scheduled appointments.  (existing)
- **patient_visits**: visit record and status.  (existing)
- **visit_types / visit_statuses**: visit type and workflow status.  (existing)
- **clinics**: clinic/department.  (existing)
- **services / service_types**: billable services.  (existing)
- **users / staff_profiles / roles**: staff and permissions.  (existing)

### New tables recommended
- **visit_triage**
  - visit_id (FK patient_visits)
  - vitals_json (BP, HR, temp, SpO2, weight, height)
  - triage_notes
  - triage_by (FK users)
  - triage_at

- **visit_notes**
  - visit_id (FK patient_visits)
  - doctor_id (FK users)
  - complaint
  - examination
  - provisional_diagnosis
  - final_diagnosis
  - plan
  - created_at/updated_at

- **visit_orders** (labs, imaging, procedures)
  - visit_id (FK patient_visits)
  - ordered_by (FK users)
  - order_type (lab/imaging/procedure)
  - status (requested/collected/resulted/verified)

- **visit_order_items**
  - visit_order_id (FK visit_orders)
  - service_id (FK services)
  - qty
  - price

- **visit_results**
  - visit_order_id (FK visit_orders)
  - result_payload (text/json)
  - recorded_by (FK users)
  - verified_by (FK users)
  - verified_at

- **visit_prescriptions**
  - visit_id (FK patient_visits)
  - prescribed_by (FK users)
  - status (draft/issued/dispensed/partial/void)

- **visit_prescription_items**
  - visit_prescription_id (FK visit_prescriptions)
  - drug_id (FK drugs)
  - dosage
  - frequency
  - duration_days
  - qty
  - price
  - external_purchase (bool)

- **billing_charge_items**
  - visit_id (FK patient_visits)
  - item_type (service/lab/drug/sundry)
  - item_id (FK services/drugs/etc.)
  - qty
  - unit_price
  - total
  - payer_type (cash/insurance)
  - status (unpaid/partially_paid/paid/waived)

- **payments**
  - visit_id (FK patient_visits)
  - amount
  - method (cash, card, mobile, insurance)
  - reference
  - received_by (FK users)

- **admissions**
  - visit_id (FK patient_visits)
  - ward_id, bed_id
  - admitting_doctor_id
  - admitted_at
  - status (active/discharged)

- **settings** (General Settings Module)
  - allow_service_before_payment (bool)
  - allow_lab_before_payment (bool)
  - allow_pharmacy_before_payment (bool)
  - enforce_insurance_preauth (bool)
  - etc.

---

## 3) Screens Checklist (Mapped to Tables)

### Reception
- **Patient Registration**
  - tables: patients, addresses, patient_categories, countries
- **Create Visit (Walk‑in)**
  - table: patient_visits
  - sets status = REGISTERED, visit_type, priority, assigned_clinic

### Triage
- **Triage Queue**
  - table: patient_visits (filter status = REGISTERED)
- **Triage Form**
  - table: visit_triage
  - update visit_status → TRIAGED

### Doctor Consultation
- **Doctor Queue**
  - table: patient_visits (filter status = TRIAGED/IN_CONSULTATION)
- **Consultation Page**
  - tables: visit_notes
  - update visit_status → IN_CONSULTATION
- **Order Tests/Procedures**
  - tables: visit_orders, visit_order_items
  - generate billing_charge_items

### Finance
- **Charges & Payments**
  - tables: billing_charge_items, payments
  - enforce settings + patient category pricing

### Lab
- **Lab Worklist**
  - table: visit_orders (filter order_type=lab, status=requested/collected)
- **Record Results**
  - table: visit_results
  - update order status → resulted/verified

### Doctor Review
- **Results Review**
  - table: visit_results
  - update diagnosis in visit_notes

### Pharmacy
- **Prescription Page**
  - tables: visit_prescriptions, visit_prescription_items
  - create charge items for drugs unless external_purchase=true
- **Dispense**
  - update prescription status

### Discharge / Admission
- **Outcome**
  - update visit_status → DISCHARGED / ADMITTED / CLOSED
- **Admission**
  - table: admissions

---

## 4) Integration with Existing Tables
- **patient_visits** is the backbone for all modules.
- **visit_statuses** should be enforced as a workflow (registered → triaged → consultation → awaiting results → completed).
- **services** / **service_types** should be the canonical billable items for lab/procedure/service charges.
- **appointments** can create a **patient_visit** on check‑in (store appointment_id in patient_visits).

---

## 5) Pricing & Payment Rules (Cash vs Insurance)
- Patient category determines price list.
- Cash: must pay before lab/pharmacy unless admin settings allow service before payment.
- Insurance: allow service before payment if pre‑approved; charge items flagged as insurance.

---

## 6) Admin Settings Module (Global Policies)
- allow_service_before_payment
- allow_lab_before_payment
- allow_pharmacy_before_payment
- enforce_insurance_preauth
- allow_partial_payment
- require_doctor_verification_for_results

---

## 7) Minimal Implementation Order
1) Fix patient_visits routing + UI pages (index/create/show/edit)
2) Add triage table + triage screen
3) Add doctor consultation notes + visit orders
4) Add billing charge items + payment screen
5) Add lab results flow
6) Add pharmacy + prescriptions
7) Add discharge/admission workflow
