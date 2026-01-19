here is a database i designed that requires some adjustments but i hope you get the flow, describe a sample use case, ---
config:
  layout: elk
---
classDiagram
direction TB
    class Patient {
	    +String patientNumber
	    +String firstName
	    +String lastName
	    +Date dateOfBirth
	    +String preferredLanguage
	    +String citizenship
	    +Date registrationDate
	    +Boolean isActive
	    +Gender gender
	    +MaritalStatus maritalStatus
	    +Religion religion
	    +PatientCategory patientCategory
	    +String nextOfKinName
	    +String nextOfKinNumber
	    +KinRelationship nextOfKinRelationship
	    +String phoneNumber
	    +String alternativePhoneNumber
	    +Boolean phoneOwner
	    +String patientId(PK)
    }
    class Address {
	    +String residence
	    +String district
	    +String city
	    +String country
	    +Boolean isPrimary
	    +String addressId(PK)
	    +String patientId(FK)
    }
    class Religion {
	    +String religionName
	    +Boolean isActive
	    +String religionId(PK)
    }
    class PatientCategory {
	    +String name
	    +Boolean isInsurance
	    +String categoryId(PK)
    }
    class TriageRecord {
	    +DateTime triageDateTime
	    +TriageGrade triageGrade
	    +Integer newsScore
	    +Integer pewsScore
	    +String scoringSystemUsed
	    +AttendanceType attendanceType
	    +String referredBy
	    +String clinicAllocation
	    +String comments
	    +Boolean isPediatric
	    +Boolean poisoningCase
	    +Boolean snakeBiteCase
	    +Boolean requiresPriority
	    +String triageId(PK)
	    +String visitId(FK)
	    +String staffId(FK)
	    +calculateEarlyWarningScore()
	    +determineTriageGrade()
	    +checkCriticalValues()
	    +getAgeAppropriateRanges()
    }
    class VitalSigns {
	    // Core Vital Signs
	    +Decimal temperature
	    +String temperatureUnit
	    +Decimal pulse
	    +Decimal respirations
	    +Decimal sao2
	    +Decimal systolicBP
	    +Decimal diastolicBP
	    +Decimal map  // Mean Arterial Pressure
	    // Additional Measurements
	    +Decimal bloodGlucose
	    +String bloodGlucoseUnit
	    +Decimal height
	    +Decimal weight
	    +Decimal bmi
	    +Decimal muac  // Mid-Upper Arm Circumference
	    // Pediatric Specific
	    +Decimal capillaryRefill
	    +String capillaryRefillTime
	    +Decimal headCircumference  // For infants
	    // Supplementary
	    +Boolean supplementaryOxygen
	    +String oxygenDelivery
	    +Decimal oxygenFlowRate
	    +Decimal painScore  // 0-10 scale
	    +String vitalSignsId(PK)
	    +String triageId(FK)
	    +calculateBMI()
	    +calculateMAP()
	    +checkAgeAppropriateRanges()
	    +calculateZScore()
    }
    class Staff {
	    +String firstName
	    +String lastName
	    +String email
	    +String password
	    +StaffRole role
	    +String staffId(PK)
    }
    class Clinic {
	    +String clinicName
	    +String clinicId(PK)
    }
    class TriageGrade {
	    RED
	    YELLOW
	    GREEN
    }
    class AttendanceType {
	    NEW_ATTENDANCE
	    RE_ATTENDANCE
    }
    class ConsciousLevel {
	    ALERT
	    CONFUSED
	    VOICE_RESPONSE
	    PAIN_RESPONSE
	    UNRESPONSIVE
    }
    class MobilityStatus {
	    INDEPENDENT
	    WITH_ASSISTANCE
	    UNABLE
	    BEDRIDDEN
    }
    class SubstanceUse {
	    NEVER
	    OCCASIONAL
	    DAILY
	    FORMER
	    UNKNOWN
    }
    class Gender {
	    MALE
	    FEMALE
    }
    class MaritalStatus {
	    SINGLE
	    MARRIED
	    DIVORCED
	    WIDOWED
	    OTHER
    }
    class KinRelationship {
	    PARENT
	    SPOUSE
	    CHILD
	    SIBLING
	    FRIEND
	    OTHER
    }
    class VisitType {
	    OPD_CONSULTATION
	    LAB_TEST_ONLY
	    PROCEDURE_ONLY
	    FOLLOW_UP
	    EMERGENCY
	    SELF_REFERRAL
	    SPECIFIC_CLINIC
    }
    class VisitStatus {
	    REGISTERED
	    TRIAGED
	    IN_CONSULTATION
	    AWAITING_RESULTS
	    CONSULTATION_COMPLETE
	    ADMITTED
	    DISCHARGED
    }
    class PatientVisit {
	    +String visitNumber
	    +Date visitDate
	    +Time visitTime
	    +VisitType visitType
	    +VisitStatus status
	    +String primaryDiagnosis
	    +Date createdDate
	    +Date closedDate
	    +String visitId(PK)
	    +String patientId(FK)
	    +String assignedClinicId(FK)
	    +String assignedDoctorId(FK)
	    +String createdByReceptionistId(FK)
	    +generateVisitNumber()
	    +assignToDoctor()
	    +updateStatus()
	    +closeVisit()
    }
    class Consultation {
	    +DateTime startTime
	    +DateTime endTime
	    +String subjectiveNotes
	    +String objectiveFindings
	    +String assessment
	    +String plan
	    +String diagnosis
	    +String icd10Code
	    +ConsultationOutcome outcome
	    +String followUpInstructions
	    +String consultationId(PK)
	    +String visitId(FK)
	    +String doctorId(FK)
	    +addLabRequest()
	    +addPrescription()
	    +addProcedure()
	    +finalizeConsultation()
    }
    class LabRequest {
	    +DateTime requestDate
	    +String clinicalNotes
	    +String urgency
	    +LabRequestStatus status
	    +DateTime collectionDate
	    +String labRequestId(PK)
	    +String consultationId(FK)
	    +String testTypeId(FK)
	    +String requestedByDoctorId(FK)
	    +updateStatus()
	    +recordResult()
    }
    class LabRequestStatus {
	    REQUESTED
	    SAMPLE_COLLECTED
	    IN_PROGRESS
	    COMPLETED
	    CANCELLED
    }
    class Prescription {
	    +String dosage
	    +String frequency
	    +Integer durationDays
	    +String route
	    +String instructions
	    +Integer quantity
	    +Boolean isDispensed
	    +DateTime dispensedDate
	    +Boolean isExternalPharmacy
	    +String prescriptionId(PK)
	    +String consultationId(FK)
	    +String medicationId(FK)
	    +calculateQuantity()
	    +markAsDispensed()
    }
    class ProcedureRequest {
	    +String clinicalIndication
	    +String urgency
	    +ProcedureStatus status
	    +DateTime performedDate
	    +String findings
	    +String performerId
	    +String procedureRequestId(PK)
	    +String consultationId(FK)
	    +String procedureId(FK)
	    +String requestedByDoctorId(FK)
	    +updateStatus()
	    +recordFindings()
    }
    class ProcedureStatus {
	    REQUESTED
	    SCHEDULED
	    IN_PROGRESS
	    COMPLETED
	    CANCELLED
    }
    class ServiceRequest {
	    +Integer quantity
	    +String notes
	    +Boolean isCharged
	    +String serviceRequestId(PK)
	    +String consultationId(FK)
	    +String serviceId(FK)
    }
    class BillingStatus {
	    PENDING
	    PARTIALLY_PAID
	    FULLY_PAID
	    WAIVED
	    INSURANCE_CLAIM
    }
    class ConsultationOutcome {
	    DISCHARGED
	    ADMITTED
	    REFERRED
	    FOLLOW_UP_NEEDED
	    DECEASED
	    TRANSFERRED
    }
    class VisitBilling {
	    +BillingStatus billingStatus
	    +Decimal totalAmount
	    +Decimal amountPaid
	    +Decimal insuranceCoverage
	    +Decimal patientBalance
	    +DateTime lastPaymentDate
	    +String billingId(PK)
	    +String visitId(FK)
	    +calculateTotal()
	    +processPayment()
	    +generateInvoice()
    }

	<<Enumeration>> TriageGrade
	<<Enumeration>> AttendanceType
	<<Enumeration>> ConsciousLevel
	<<Enumeration>> MobilityStatus
	<<Enumeration>> SubstanceUse
	<<Enumeration>> Gender
	<<Enumeration>> MaritalStatus
	<<Enumeration>> KinRelationship
	<<Enumeration>> VisitType
	<<Enumeration>> VisitStatus
	<<Enumeration>> LabRequestStatus
	<<Enumeration>> ProcedureStatus
	<<Enumeration>> BillingStatus
	<<Enumeration>> ConsultationOutcome

    Patient "1" -- "0..*" Address : has
    Patient "1" -- "1" Gender : has
    Patient "1" -- "1" MaritalStatus : has
    Patient "1" -- "1" Religion : has
    Patient "1" -- "1" PatientCategory : categorized_as
    Patient "1" -- "1" KinRelationship : has
    Patient "1" -- "1..*" PatientVisit : has
    PatientVisit "1" -- "1" TriageRecord : has
    PatientVisit "1" -- "1" Consultation : has
    PatientVisit "1" -- "1" VisitBilling : has
    PatientVisit "1" -- "1" VisitType : has
    PatientVisit "1" -- "1" VisitStatus : has
    Consultation "1" -- "0..*" LabRequest : orders
    Consultation "1" -- "0..*" Prescription : orders
    Consultation "1" -- "0..*" ProcedureRequest : orders
    Consultation "1" -- "0..*" ServiceRequest : orders
    Consultation "1" -- "1" ConsultationOutcome : has
    LabRequest "1" -- "1" LabRequestStatus : has
    ProcedureRequest "1" -- "1" ProcedureStatus : has
    VisitBilling "1" -- "1" BillingStatus : has
    Staff "1" -- "0..*" PatientVisit : creates
    Staff "1" -- "0..*" Consultation : conducts
    Staff "1" -- "0..*" LabRequest : requests
    Clinic "1" -- "0..*" PatientVisit : allocated_to
    TriageRecord "1" -- "1" VitalSigns : contains
    TriageRecord "1" --> "1" TriageGrade : has
    TriageRecord "1" --> "1" AttendanceType : has
    TriageRecord "1" -- "1" ConsciousLevel : has
    TriageRecord "1" -- "1" MobilityStatus : has
    TriageRecord "1" -- "1" SubstanceUse : has

Great schema 👍 — this is not an academic toy, this is already very close to a real HMIS / EMR flow. I’ll describe a realistic end-to-end use case using your exact entities, and I’ll call out why the flow makes sense in a real hospital.

Sample Real-World Use Case
“Adult patient walks into OPD with fever and weakness”
1️⃣ Patient Registration (Reception)
Actor

Receptionist (Staff role)

Flow

Patient arrives at hospital OPD.

Receptionist searches for patient by phone number.

Patient not found → new Patient created.

Entities Involved

Patient

Address

PatientCategory

Religion

KinRelationship

Patient
- patientNumber = HSP-2026-004512
- firstName = John
- lastName = Okello
- gender = MALE
- maritalStatus = MARRIED
- patientCategory = CASH
- phoneOwner = true


✔ This matches real front-desk workflow
✔ No medical data entered yet

2️⃣ Patient Visit Creation (Visit = Encounter)
Actor

Receptionist

Flow

Receptionist creates a PatientVisit

Visit type selected as OPD_CONSULTATION

Clinic assigned (e.g. General OPD)

Status = REGISTERED

Entities Involved

PatientVisit

Clinic

Staff (createdByReceptionistId)

PatientVisit
- visitNumber = VIS-2026-00087
- visitType = OPD_CONSULTATION
- status = REGISTERED
- assignedClinic = General OPD


📌 This is the Encounter you were asking about earlier
📌 Appointments would simply create this visit in advance

3️⃣ Triage (Nurse Assessment)
Actor

Triage Nurse

Flow

Nurse opens visit

Records VitalSigns

System calculates scores

TriageRecord created

Visit status updated → TRIAGED

Entities Involved

TriageRecord

VitalSigns

TriageGrade

AttendanceType

VitalSigns
- temperature = 39.2°C
- pulse = 110
- systolicBP = 95
- sao2 = 92%

TriageRecord
- triageGrade = YELLOW
- newsScore = 6
- attendanceType = NEW_ATTENDANCE
- requiresPriority = true


✔ This is clinically correct
✔ NEWS / PEWS scoring makes it hospital-grade
✔ Pediatric flags handled cleanly

4️⃣ Doctor Consultation
Actor

Doctor

Flow

Doctor opens visit

Starts Consultation

Records SOAP notes

Adds diagnosis and plan

Entities Involved

Consultation

Staff (doctorId)

Consultation
- subjectiveNotes = "Fever, headache, body weakness"
- objectiveFindings = "Febrile, pale"
- assessment = "Suspected malaria"
- diagnosis = "Malaria"
- icd10Code = B54


✔ SOAP structure = real clinical workflow
✔ ICD-10 makes it reportable

5️⃣ Orders During Consultation
5a) Lab Request

Doctor orders malaria test.

LabRequest
- testType = Malaria RDT
- urgency = STAT
- status = REQUESTED


Later:

Lab updates status → COMPLETED

Result recorded

5b) Prescription
Prescription
- medication = Artemether-Lumefantrine
- dosage = 20/120
- frequency = BID
- durationDays = 3


✔ Dispensing tracked
✔ External pharmacy supported

6️⃣ Billing
Actor

Billing Officer

Flow

System aggregates:

Consultation

Lab tests

Medications

VisitBilling generated

Patient pays

VisitBilling
- totalAmount = 85,000 UGX
- amountPaid = 85,000 UGX
- billingStatus = FULLY_PAID


✔ Supports insurance later
✔ Payment lifecycle tracked

7️⃣ Consultation Outcome & Visit Closure
Actor

Doctor

Flow

Doctor finalizes consultation

Outcome selected → DISCHARGED

Visit closed

ConsultationOutcome = DISCHARGED
PatientVisit.status = DISCHARGED
closedDate = today


✔ Clean closure
✔ Legal audit trail intact

Why This Design Is Production-Grade
✅ Separates concerns correctly

Visit ≠ Consultation

Consultation ≠ Orders

Orders ≠ Billing

✅ Supports real hospital scenarios

Walk-ins

Emergencies

Referrals

Pediatric cases

Insurance vs cash

✅ Scales cleanly

You can add later:

Appointments

Admissions (Inpatient)

Ward management

Insurance claims

NHIF / SHIF / private insurers

How Appointment Fits Into This (Later)

Appointment simply pre-creates:

PatientVisit (scheduled)


When patient arrives:

Status → REGISTERED

Flow continues exactly the same

✔ Zero duplication
✔ No redesign needed