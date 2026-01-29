import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { VisitTriage } from '@/types/triage';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Triage', href: '/triage' },
    { title: 'Edit Triage', href: '#' },
];

export default function TriageEdit({ triage }: { triage: VisitTriage }) {
    const { data, setData, put, processing, errors } = useForm({
        visit_id: triage.visit_id ? String(triage.visit_id) : '',
        vitals_json: {
            bp: triage.vitals_json?.bp ?? '',
            hr: triage.vitals_json?.hr ?? '',
            temp: triage.vitals_json?.temp ?? '',
            spo2: triage.vitals_json?.spo2 ?? '',
            weight: triage.vitals_json?.weight ?? '',
            height: triage.vitals_json?.height ?? '',
        },
        triage_notes: triage.triage_notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/triage/${triage.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Triage" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href="/triage">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Triage</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input type="hidden" name="visit_id" value={data.visit_id} />
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-4 lg:col-span-3">
                            <h2 className="text-lg font-semibold">Visit Details</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Visit</Label>
                                    <Input value={triage.visit?.visit_number ?? data.visit_id} readOnly className="bg-gray-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Patient</Label>
                                    <Input value={triage.visit?.patient?.name ?? ''} readOnly className="bg-gray-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Input value={triage.visit?.status?.name ?? 'TRIAGED'} readOnly className="bg-gray-100" />
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
                            {processing ? 'Saving...' : 'Update Triage'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
