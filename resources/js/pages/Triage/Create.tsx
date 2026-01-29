import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { TriageVisit } from '@/types/triage';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Triage', href: '/triage' },
    { title: 'Record Triage', href: '#' },
];

export default function TriageCreate({
    visit,
    queueVisits,
}: {
    visit?: TriageVisit | null;
    queueVisits: TriageVisit[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        visit_id: visit?.id ? String(visit.id) : '',
        vitals_json: {
            bp: '',
            hr: '',
            temp: '',
            spo2: '',
            weight: '',
            height: '',
        },
        triage_notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/triage');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record Triage" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href="/triage">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Record Triage</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
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
                                    <Input value={visit?.status?.name ?? 'REGISTERED'} readOnly className="bg-gray-100" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 lg:col-span-3">
                            <h2 className="text-lg font-semibold">Vitals</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="bp">Blood Pressure</Label>
                                    <Input
                                        id="bp"
                                        placeholder="e.g. 120/80"
                                        value={data.vitals_json.bp}
                                        onChange={(e) => setData('vitals_json', { ...data.vitals_json, bp: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hr">Heart Rate</Label>
                                    <Input
                                        id="hr"
                                        placeholder="e.g. 78 bpm"
                                        value={data.vitals_json.hr}
                                        onChange={(e) => setData('vitals_json', { ...data.vitals_json, hr: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="temp">Temperature</Label>
                                    <Input
                                        id="temp"
                                        placeholder="e.g. 36.7 °C"
                                        value={data.vitals_json.temp}
                                        onChange={(e) => setData('vitals_json', { ...data.vitals_json, temp: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="spo2">SpO2</Label>
                                    <Input
                                        id="spo2"
                                        placeholder="e.g. 98%"
                                        value={data.vitals_json.spo2}
                                        onChange={(e) => setData('vitals_json', { ...data.vitals_json, spo2: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight</Label>
                                    <Input
                                        id="weight"
                                        placeholder="e.g. 70 kg"
                                        value={data.vitals_json.weight}
                                        onChange={(e) => setData('vitals_json', { ...data.vitals_json, weight: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="height">Height</Label>
                                    <Input
                                        id="height"
                                        placeholder="e.g. 175 cm"
                                        value={data.vitals_json.height}
                                        onChange={(e) => setData('vitals_json', { ...data.vitals_json, height: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 lg:col-span-3">
                            <h2 className="text-lg font-semibold">Notes</h2>
                            <Textarea
                                rows={4}
                                placeholder="Add triage notes"
                                value={data.triage_notes}
                                onChange={(e) => setData('triage_notes', e.target.value)}
                            />
                            {errors.triage_notes && <p className="text-sm text-red-500">{errors.triage_notes}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/triage">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Triage'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
