import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ConsultationVisit } from '@/types/consultation';
import LabOrderPanel from '@/components/LabOrderPanel';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Consultations', href: '/consultations' },
    { title: 'New Consultation', href: '#' },
];

export default function ConsultationCreate({
    visit,
    queueVisits,
}: {
    visit?: ConsultationVisit | null;
    queueVisits: ConsultationVisit[];
}) {
    const [activeTab, setActiveTab] = useState('consultation');
    
    const { data, setData, post, processing, errors } = useForm({
        visit_id: visit?.id ? String(visit.id) : '',
        complaint: '',
        examination: '',
        provisional_diagnosis: '',
        final_diagnosis: '',
        plan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/consultations');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Consultation" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href="/consultations">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Consultation</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="consultation">Consultation Notes</TabsTrigger>
                        <TabsTrigger value="lab-orders">Lab Orders</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="consultation" className="space-y-6 mt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                <div className="space-y-4 lg:col-span-3">
                                    <h2 className="text-lg font-semibold">Visit Details</h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="visit_id">Visit *</Label>
                                            <Select
                                                value={data.visit_id}
                                                onValueChange={(value) => setData('visit_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select visit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {queueVisits.map((queueVisit) => (
                                                        <SelectItem key={queueVisit.id} value={String(queueVisit.id)}>
                                                            {queueVisit.visit_number} - {queueVisit.patient?.name ?? `${queueVisit.patient?.first_name ?? ''} ${queueVisit.patient?.last_name ?? ''}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.visit_id && <p className="text-sm text-red-500">{errors.visit_id}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Clinic</Label>
                                            <Input value={visit?.assigned_clinic?.name ?? 'Auto'} readOnly className="bg-gray-100" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Input value={visit?.status?.name ?? 'TRIAGED'} readOnly className="bg-gray-100" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 lg:col-span-3">
                                    <h2 className="text-lg font-semibold">Consultation Notes</h2>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="complaint">Chief Complaint</Label>
                                            <Textarea
                                                id="complaint"
                                                rows={3}
                                                value={data.complaint}
                                                onChange={(e) => setData('complaint', e.target.value)}
                                            />
                                            {errors.complaint && <p className="text-sm text-red-500">{errors.complaint}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="examination">Examination</Label>
                                            <Textarea
                                                id="examination"
                                                rows={3}
                                                value={data.examination}
                                                onChange={(e) => setData('examination', e.target.value)}
                                            />
                                            {errors.examination && <p className="text-sm text-red-500">{errors.examination}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 lg:col-span-3">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="provisional_diagnosis">Provisional Diagnosis</Label>
                                            <Textarea
                                                id="provisional_diagnosis"
                                                rows={2}
                                                value={data.provisional_diagnosis}
                                                onChange={(e) => setData('provisional_diagnosis', e.target.value)}
                                            />
                                            {errors.provisional_diagnosis && <p className="text-sm text-red-500">{errors.provisional_diagnosis}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="final_diagnosis">Final Diagnosis</Label>
                                            <Textarea
                                                id="final_diagnosis"
                                                rows={2}
                                                value={data.final_diagnosis}
                                                onChange={(e) => setData('final_diagnosis', e.target.value)}
                                            />
                                            {errors.final_diagnosis && <p className="text-sm text-red-500">{errors.final_diagnosis}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 lg:col-span-3">
                                    <Label htmlFor="plan">Plan</Label>
                                    <Textarea
                                        id="plan"
                                        rows={3}
                                        value={data.plan}
                                        onChange={(e) => setData('plan', e.target.value)}
                                    />
                                    {errors.plan && <p className="text-sm text-red-500">{errors.plan}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Link href="/consultations">
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Consultation'}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                    
                    <TabsContent value="lab-orders" className="space-y-6 mt-6">
                        <LabOrderPanel 
                            visitId={parseInt(data.visit_id) || 0} 
                            onOrderChange={(orders) => {
                                console.log('Lab orders updated:', orders);
                            }}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
