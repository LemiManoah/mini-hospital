import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
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
    visitTypes: VisitTypeOption[];
    clinics: Clinic[];
    doctors: Doctor[];
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

interface VisitTypeOption {
    id: number;
    name: string;
}

const StartVisitModal = ({ patient, visitTypes, clinics, doctors, children }: StartVisitModalProps) => {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: patient.id,
        visit_type_id: '',
        assigned_clinic_id: '',
        assigned_doctor_id: '',
        priority_flag: 'medium',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post('/visits/quick-create', {
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
                        <Select
                            value={data.visit_type_id}
                            onValueChange={(value: string) => setData('visit_type_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select visit type" />
                            </SelectTrigger>
                            <SelectContent>
                                {visitTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.visit_type_id && (
                            <p className="text-sm text-red-600">{errors.visit_type_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="assigned_clinic_id">Clinic (optional)</Label>
                        <Select
                            value={data.assigned_clinic_id || ''}
                            onValueChange={(value: string) => setData('assigned_clinic_id', value)}
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="assigned_doctor_id">Doctor (optional)</Label>
                        <Select
                            value={data.assigned_doctor_id || ''}
                            onValueChange={(value: string) => setData('assigned_doctor_id', value)}
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
                    </div>

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
                            disabled={processing || !data.visit_type_id}
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
