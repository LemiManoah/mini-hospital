import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { LabReferenceRange } from '@/types/lab';
import { index } from '@/routes/lab-result-options';
import { dashboard } from '@/routes';

interface Props {
    labReferenceRange: LabReferenceRange;
    parameters: Array<{ id: number; lab_service_id: number; parameter_name: string; labService?: { name: string } }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Lab Result Options', href: index().url },
    { title: 'Edit Reference Range', href: '#' },
];

export default function LabReferenceRangeEdit({ labReferenceRange, parameters }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        lab_result_parameter_id: labReferenceRange.lab_result_parameter_id.toString(),
        age_range_from: labReferenceRange.age_range_from ?? '',
        age_range_to: labReferenceRange.age_range_to ?? '',
        sex: labReferenceRange.sex,
        phase: labReferenceRange.phase ?? '',
        weeks_from: labReferenceRange.weeks_from ?? '',
        weeks_to: labReferenceRange.weeks_to ?? '',
        min_value: labReferenceRange.min_value?.toString() ?? '',
        max_value: labReferenceRange.max_value?.toString() ?? '',
        reference_text: labReferenceRange.reference_text ?? '',
        is_active: labReferenceRange.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = {
            lab_result_parameter_id: parseInt(data.lab_result_parameter_id),
            sex: data.sex,
            is_active: data.is_active,
            min_value: data.min_value ? parseFloat(data.min_value) : null,
            max_value: data.max_value ? parseFloat(data.max_value) : null,
            age_range_from: data.age_range_from || null,
            age_range_to: data.age_range_to || null,
            weeks_from: data.weeks_from || null,
            weeks_to: data.weeks_to || null,
            phase: data.phase || null,
            reference_text: data.reference_text || null,
        };
        put(`/lab-reference-ranges/${labReferenceRange.id}`, submitData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Lab Reference Range" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={index().url}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Lab Reference Range</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="lab_result_parameter_id">Parameter *</Label>
                        <Select
                            value={data.lab_result_parameter_id}
                            onValueChange={(value) => setData('lab_result_parameter_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select parameter" />
                            </SelectTrigger>
                            <SelectContent>
                                {parameters.map((parameter) => (
                                    <SelectItem key={parameter.id} value={parameter.id.toString()}>
                                        {parameter.labService?.name} - {parameter.parameter_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.lab_result_parameter_id && (
                            <p className="text-sm text-red-500">{errors.lab_result_parameter_id}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="age_range_from">Age From</Label>
                            <Input
                                id="age_range_from"
                                value={data.age_range_from}
                                onChange={(e) => setData('age_range_from', e.target.value)}
                                placeholder="e.g., 0"
                            />
                            {errors.age_range_from && <p className="text-sm text-red-500">{errors.age_range_from}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="age_range_to">Age To</Label>
                            <Input
                                id="age_range_to"
                                value={data.age_range_to}
                                onChange={(e) => setData('age_range_to', e.target.value)}
                                placeholder="e.g., 120"
                            />
                            {errors.age_range_to && <p className="text-sm text-red-500">{errors.age_range_to}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sex">Sex *</Label>
                            <Select value={data.sex} onValueChange={(value: 'male' | 'female' | 'both') => setData('sex', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="both">Both</SelectItem>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.sex && <p className="text-sm text-red-500">{errors.sex}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phase">Phase (for hormone tests)</Label>
                            <Input
                                id="phase"
                                value={data.phase}
                                onChange={(e) => setData('phase', e.target.value)}
                                placeholder="e.g., Follicular Phase"
                            />
                            {errors.phase && <p className="text-sm text-red-500">{errors.phase}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="weeks_from">Weeks From (for pregnancy tests)</Label>
                            <Input
                                id="weeks_from"
                                value={data.weeks_from}
                                onChange={(e) => setData('weeks_from', e.target.value)}
                                placeholder="e.g., 0"
                            />
                            {errors.weeks_from && <p className="text-sm text-red-500">{errors.weeks_from}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="weeks_to">Weeks To (for pregnancy tests)</Label>
                        <Input
                            id="weeks_to"
                            value={data.weeks_to}
                            onChange={(e) => setData('weeks_to', e.target.value)}
                            placeholder="e.g., 12"
                        />
                        {errors.weeks_to && <p className="text-sm text-red-500">{errors.weeks_to}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="min_value">Min Value</Label>
                            <Input
                                id="min_value"
                                type="number"
                                step="0.0001"
                                value={data.min_value}
                                onChange={(e) => setData('min_value', e.target.value)}
                                placeholder="e.g., 0.00"
                            />
                            {errors.min_value && <p className="text-sm text-red-500">{errors.min_value}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="max_value">Max Value</Label>
                            <Input
                                id="max_value"
                                type="number"
                                step="0.0001"
                                value={data.max_value}
                                onChange={(e) => setData('max_value', e.target.value)}
                                placeholder="e.g., 100.00"
                            />
                            {errors.max_value && <p className="text-sm text-red-500">{errors.max_value}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reference_text">Reference Text (alternative)</Label>
                            <Input
                                id="reference_text"
                                value={data.reference_text}
                                onChange={(e) => setData('reference_text', e.target.value)}
                                placeholder="e.g., NONE"
                            />
                            {errors.reference_text && <p className="text-sm text-red-500">{errors.reference_text}</p>}
                        </div>
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

                    <div className="flex justify-end gap-3">
                        <Link href={index().url}>
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
