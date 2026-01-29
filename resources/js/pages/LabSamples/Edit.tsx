import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { LabSample } from '@/types/lab';

interface Props {
    labSample: LabSample;
    visitOrderItems: Array<{ id: number; service: { id: number; name: string } }>;
    sampleTypes: Array<{ id: number; name: string; code: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lab Samples', href: '/lab-samples' },
    { title: 'Edit Sample', href: '#' },
];

export default function LabSampleEdit({ labSample, visitOrderItems, sampleTypes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        visit_order_item_id: labSample.visit_order_item_id.toString(),
        sample_type_id: labSample.sample_type_id.toString(),
        container: labSample.container ?? '',
        volume: labSample.volume ?? '',
        status: labSample.status,
        rejection_reason: labSample.rejection_reason ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/lab-samples/${labSample.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Sample ${labSample.sample_number}`} />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href="/lab-samples">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Lab Sample</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="visit_order_item_id">Visit Order Item *</Label>
                        <Select
                            value={data.visit_order_item_id}
                            onValueChange={(value) => setData('visit_order_item_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select test" />
                            </SelectTrigger>
                            <SelectContent>
                                {visitOrderItems.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                        {item.service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.visit_order_item_id && <p className="text-sm text-red-500">{errors.visit_order_item_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sample_type_id">Sample Type *</Label>
                        <Select
                            value={data.sample_type_id}
                            onValueChange={(value) => setData('sample_type_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select sample type" />
                            </SelectTrigger>
                            <SelectContent>
                                {sampleTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.code} - {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.sample_type_id && <p className="text-sm text-red-500">{errors.sample_type_id}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="container">Container</Label>
                            <Input
                                id="container"
                                value={data.container}
                                onChange={(e) => setData('container', e.target.value)}
                                placeholder="e.g., EDTA Tube"
                            />
                            {errors.container && <p className="text-sm text-red-500">{errors.container}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="volume">Volume</Label>
                            <Input
                                id="volume"
                                value={data.volume}
                                onChange={(e) => setData('volume', e.target.value)}
                                placeholder="e.g., 5ml"
                            />
                            {errors.volume && <p className="text-sm text-red-500">{errors.volume}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status as 'collected' | 'received' | 'rejected'}
                            onValueChange={(value) => setData('status', value as 'collected' | 'received' | 'rejected')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="collected">Collected</SelectItem>
                                <SelectItem value="received">Received</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                    </div>

                    {data.status === 'rejected' && (
                        <div className="space-y-2">
                            <Label htmlFor="rejection_reason">Rejection Reason</Label>
                            <Input
                                id="rejection_reason"
                                value={data.rejection_reason}
                                onChange={(e) => setData('rejection_reason', e.target.value)}
                                placeholder="Reason for rejection"
                            />
                            {errors.rejection_reason && <p className="text-sm text-red-500">{errors.rejection_reason}</p>}
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Link href="/lab-samples">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
