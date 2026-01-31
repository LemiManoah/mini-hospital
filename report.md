# Mini-Hospital Module Analysis: Visit and Lab

This report provides an analysis of the `visit` and `lab` modules within the mini-hospital application. It is based on a review of the models and database migrations.

## Visit Module

The visit module is responsible for managing patient encounters with the hospital. It tracks the entire lifecycle of a patient's visit, from registration to discharge, including clinical notes, orders, and prescriptions.

### Key Models and Their Purpose

*   **`PatientVisit`**: The central model of this module, representing a single patient visit.
    *   **Key Fields**: `visit_number`, `patient_id`, `visit_type_id`, `status_id`, `assigned_doctor_id`, `visit_date`.
    *   **Relationships**: Belongs to `Patient`, `VisitType`, `VisitStatus`, and `User` (doctor). Has many `VisitTriage`, `VisitNote`, `VisitOrder`, `VisitPrescription`.

*   **`VisitTriage`**: Records the initial assessment of a patient.
    *   **Key Fields**: `visit_id`, `vitals_json`, `triage_notes`, `triage_by`.

*   **`VisitNote`**: Contains the clinical notes made by a doctor during the visit.
    *   **Key Fields**: `visit_id`, `doctor_id`, `complaint`, `examination`, `provisional_diagnosis`, `final_diagnosis`, `plan`.

*   **`VisitOrder`**: Represents a request for a specific service, such as a lab test or a procedure.
    *   **Key Fields**: `visit_id`, `ordered_by`, `order_type`, `status`.
    *   **Relationships**: Has many `VisitOrderItem`.

*   **`VisitOrderItem`**: A specific item within a `VisitOrder`. This is a crucial link to other modules.
    *   **Key Fields**: `visit_order_id`, `item_type`, `item_id`, `qty`, `price`.
    *   **Polymorphic Relationship**: The `item` relationship can point to different models, such as `Service` or `LabService`.

*   **`VisitResult`**: Stores the results of a `VisitOrderItem`.
    *   **Key Fields**: `visit_order_id`, `visit_order_item_id`, `result_payload`, `recorded_by`.

*   **`VisitPrescription` & `VisitPrescriptionItem`**: Manage medication prescriptions for the patient.

*   **`VisitType` & `VisitStatus`**: These are lookup tables used to classify and track the state of a visit (e.g., 'OPD', 'INPATIENT' for type; 'Scheduled', 'Checked In', 'Completed' for status).

### Database Schema (Illustrative Migrations)

**`patient_visits` table:**
```php
Schema::create('patient_visits', function (Blueprint $table) {
    $table->id();
    $table->string('visit_number')->unique();
    $table->foreignId('patient_id')->constrained()->onDelete('cascade');
    $table->foreignId('visit_type_id')->constrained()->onDelete('restrict');
    $table->foreignId('status_id')->constrained('visit_statuses')->onDelete('restrict');
    $table->foreignId('assigned_doctor_id')->nullable()->constrained('users')->onDelete('set null');
    $table->date('visit_date');
    // ... other fields
    $table->timestamps();
});
```

**`visit_order_items` table:**
```php
Schema::create('visit_order_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('visit_order_id')->constrained('visit_orders')->onDelete('cascade');
    $table->string('item_type'); // e.g., 'App\Models\LabService'
    $table->unsignedBigInteger('item_id'); // ID of the LabService
    $table->integer('qty');
    $table->decimal('price', 10, 2);
    $table->timestamps();
});
```

## Lab Module

The lab module manages all aspects of laboratory testing, from the services offered to the results and reference ranges.

### Key Models and Their Purpose

*   **`LabService`**: Defines a specific lab test that can be ordered.
    *   **Key Fields**: `name`, `code`, `price`, `sample_type_id`, `lab_result_type_id`.
    *   **Relationships**: Belongs to `LabServiceCategory`, `LabSampleType`, and `LabResultType`.

*   **`LabServiceCategory`**: A way to group lab services (e.g., 'Hematology', 'Microbiology').

*   **`LabSampleType`**: Specifies the type of sample required for a test (e.g., 'Blood', 'Urine').

*   **`LabSample`**: Tracks a physical specimen collected from a patient.
    *   **Key Fields**: `sample_number`, `visit_order_item_id`, `sample_type_id`, `collected_by`, `collected_at`.

*   **`LabResultType`**: Defines the structure and format of a lab result. This is a key model for determining how results are entered and displayed.
    *   **Key Fields**: `name`, `code`, `result_format`.
    *   **`result_format` enum values**: 'machine_based', 'simple_options', 'parameter_based', 'complex_hormone'.

*   **`LabResultParameter`**: Used for tests that have multiple numeric results (e.g., a lipid profile has parameters for HDL, LDL, etc.).
    *   **Relationships**: Belongs to a `LabService`.

*   **`LabReferenceRange`**: Stores the normal range for a `LabResultParameter`, which can vary by age, sex, etc.

*   **`LabResultOption`**: Used for tests with a predefined set of results (e.g., 'Positive', 'Negative').

### Database Schema (Illustrative Migrations)

**`lab_services` table:**
```php
Schema::create('lab_services', function (Blueprint $table) {
    $table->id();
    $table->foreignId('lab_service_category_id')->constrained('lab_service_categories');
    $table->string('name');
    $table->string('code')->unique();
    $table->decimal('price', 10, 2);
    $table->foreignId('sample_type_id')->nullable()->constrained('lab_sample_types');
    $table->foreignId('lab_result_type_id')->nullable()->constrained('lab_result_types');
    $table->timestamps();
});
```

**`lab_samples` table:**
```php
Schema::create('lab_samples', function (Blueprint $table) {
    $table->id();
    $table->string('sample_number', 50)->unique();
    $table->foreignId('visit_order_item_id')->constrained('visit_order_items')->onDelete('cascade');
    $table->foreignId('sample_type_id')->constrained('lab_sample_types');
    $table->timestamp('collected_at')->nullable();
    $table->enum('status', ['collected', 'received', 'rejected'])->default('collected');
    $table->timestamps();
});
```

## Interaction between Visit and Lab Modules

The two modules are tightly integrated through the ordering process:

1.  A doctor, during a `PatientVisit`, decides to order a lab test.
2.  A `VisitOrder` is created with an `order_type` of 'lab' (or similar).
3.  A `VisitOrderItem` is created. Its `item_type` is set to `App\Models\LabService`, and `item_id` is the ID of the specific `LabService` being ordered.
4.  This action may trigger the creation of a `LabSample` record, linked to the `visit_order_item_id`, to track the physical specimen.
5.  When the lab test is complete, a `VisitResult` is created, also linked to the `visit_order_item_id`. The `result_payload` of this result will be structured according to the `LabResultType` defined in the original `LabService`.
