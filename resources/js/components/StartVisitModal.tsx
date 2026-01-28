import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from '@/types/patient';

interface StartVisitModalProps {
    patient: Patient;
    children: React.ReactNode;
}

interface Clinic {
    id: number;
    name: string;
}

interface Doctor {
    id: number;
    name: string;
}

const StartVisitModal = ({ patient, children }: StartVisitModalProps) => {
    const [open, setOpen] = useState(false);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loadingClinics, setLoadingClinics] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: patient.id,
        visit_type: '',
        clinic_id: '',
        doctor_id: '',
    });

    const visitTypes = [
        { value: 'regular', label: 'Regular Checkup' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'followup', label: 'Follow-up' },
        { value: 'consultation', label: 'Consultation' },
    ];

    useEffect(() => {
        if (data.visit_type && (data.visit_type === 'regular' || data.visit_type === 'consultation')) {
            fetchClinics();
        } else {
            setClinics([]);
            setData('clinic_id', '');
        }
    }, [data.visit_type]);

    useEffect(() => {
        if (data.clinic_id) {
            fetchDoctors();
        } else {
            setDoctors([]);
            setData('doctor_id', '');
        }
    }, [data.clinic_id]);

    const fetchClinics = async () => {
        setLoadingClinics(true);
        try {
            const response = await fetch('/api/clinics');
            const clinicsData = await response.json();
            setClinics(clinicsData);
        } catch (error) {
            console.error('Failed to fetch clinics:', error);
        } finally {
            setLoadingClinics(false);
        }
    };

    const fetchDoctors = async () => {
        setLoadingDoctors(true);
        try {
            const response = await fetch(`/api/clinics/${data.clinic_id}/doctors`);
            const doctorsData = await response.json();
            setDoctors(doctorsData);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('visits.quick-store'), {
            onSuccess: (page) => {
                setOpen(false);
                reset();
                // Redirect to the visit page
                if (page.props.visit_url && typeof page.props.visit_url === 'string') {
                    router.visit(page.props.visit_url);
                }
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
        });
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const needsClinic = data.visit_type === 'regular' || data.visit_type === 'consultation';
    const needsDoctor = data.clinic_id && needsClinic;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Start New Visit</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Patient</Label>
                        <div className="text-sm font-medium">
                            {patient.first_name} {patient.last_name} ({patient.patient_number})
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Visit Type</Label>
                        <div className="space-y-2">
                            {visitTypes.map((type) => (
                                <div key={type.value} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id={type.value}
                                        name="visit_type"
                                        value={type.value}
                                        checked={data.visit_type === type.value}
                                        onChange={(e) => setData('visit_type', e.target.value)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <Label htmlFor={type.value} className="text-sm font-normal">
                                        {type.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.visit_type && (
                            <p className="text-sm text-red-600">{errors.visit_type}</p>
                        )}
                    </div>

                    {needsClinic && (
                        <div className="space-y-2">
                            <Label htmlFor="clinic_id">Clinic</Label>
                            <Select
                                value={data.clinic_id || ''}
                                onValueChange={(value: string) => setData('clinic_id', value)}
                                disabled={loadingClinics}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a clinic" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clinics.map((clinic) => (
                                        <SelectItem key={clinic.id} value={clinic.id.toString()}>
                                            {clinic.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.clinic_id && (
                                <p className="text-sm text-red-600">{errors.clinic_id}</p>
                            )}
                        </div>
                    )}

                    {needsDoctor && (
                        <div className="space-y-2">
                            <Label htmlFor="doctor_id">Doctor</Label>
                            <Select
                                value={data.doctor_id || ''}
                                onValueChange={(value: string) => setData('doctor_id', value)}
                                disabled={loadingDoctors}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((doctor) => (
                                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                                            {doctor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.doctor_id && (
                                <p className="text-sm text-red-600">{errors.doctor_id}</p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.visit_type || (needsClinic && !data.clinic_id) || (needsDoctor && !data.doctor_id)}
                        >
                            {processing ? 'Starting Visit...' : 'Start Visit'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default StartVisitModal;
