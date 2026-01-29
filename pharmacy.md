# Pharmacy Module

## Purpose
Manage medications inventory and prescriptions. Enables doctors to prescribe, pharmacists to dispense, and billing to charge medications.

## Core Features
- Drug catalog (name, form, strength, unit)
- Stock batches (expiry, cost, lot)
- Dispensing workflow (prescribed → dispensed)
- Pricing (cash/insurance tiers)
- Alerts for low stock/expired stock

## Key Tables
- drugs (or medicines)
- drug_batches
- drug_stock_movements
- visit_prescriptions
- visit_prescription_items

## Visit Integration
- Consultation tab: create prescription items
- Pharmacy tab: fulfill prescriptions
- Charge items per dispensed quantity

## Minimal APIs/Endpoints
- GET/POST /pharmacy/drugs
- POST /pharmacy/drugs/{id}/receive
- POST /visit-prescriptions
- POST /visit-prescription-items
- POST /visit-prescriptions/{id}/dispense

## UI Pages
- Drug catalog
- Receive stock
- Dispense queue
- Prescription details

## Dependencies
- billing_charge_items (optional)
- payments (optional)
