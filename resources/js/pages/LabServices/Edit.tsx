import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { LabService } from '@/types/lab';

interface Props {
    labService: LabService;
    categories: Array<{ id: number; name: string }>;
    sampleTypes: Array<{ id: number; name: string; code: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lab Services', href: '/lab-services' },
    { title: 'Edit Lab Service', href: '#' },
];

export default function LabServiceEdit({ labService, categories, sampleTypes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        lab_service_category_id: labService.lab_service_category_id.toString(),
        name: labService.name,
        code: labService.code,
        description: labService.description ?? '',
        price: labService.price.toString(),
        sample_type_id: labService.sample_type_id?.toString() ?? '',
        result_fields: labService.result_fields ? JSON.stringify(labService.result_fields, null, 2) : '',
        reference_range: labService.reference_range ?? '',
        clinical_notes: labService.clinical_notes ?? '',
        is_active: labService.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/lab-services/${labService.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Lab Service: ${labService.name}`} />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href="/lab-services">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Lab Service</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="lab_service_category_id">Category *</Label>
                            <Select
                                value={data.lab_service_category_id}
                                onValueChange={(value) => setData('lab_service_category_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.lab_service_category_id && <p className="text-sm text-red-500">{errors.lab_service_category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sample_type_id">Sample Type</Label>
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
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Service Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., Complete Blood Count"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Service Code *</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="e.g., CBC"
                                maxLength={50}
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Detailed description of the lab service"
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="0.00"
                            />
                            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="result_fields">Result Fields (JSON)</Label>
                        <Textarea
                            id="result_fields"
                            rows={4}
                            value={data.result_fields}
                            onChange={(e) => setData('result_fields', e.target.value)}
                            placeholder='[{"name": "hemoglobin", "label": "Hemoglobin", "unit": "g/dL", "type": "numeric"}]'
                        />
                        {errors.result_fields && <p className="text-sm text-red-500">{errors.result_fields}</p>}
                        <p className="text-sm text-gray-500">JSON array of result fields with name, label, unit, and type</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="reference_range">Reference Range</Label>
                            <Textarea
                                id="reference_range"
                                rows={2}
                                value={data.reference_range}
                                onChange={(e) => setData('reference_range', e.target.value)}
                                placeholder="e.g., 70-100 mg/dL"
                            />
                            {errors.reference_range && <p className="text-sm text-red-500">{errors.reference_range}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="clinical_notes">Clinical Notes</Label>
                            <Textarea
                                id="clinical_notes"
                                rows={2}
                                value={data.clinical_notes}
                                onChange={(e) => setData('clinical_notes', e.target.value)}
                                placeholder="Clinical significance or notes"
                            />
                            {errors.clinical_notes && <p className="text-sm text-red-500">{errors.clinical_notes}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link href="/lab-services">
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
