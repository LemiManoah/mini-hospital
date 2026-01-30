import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { index } from '@/routes/lab-result-options';

interface Props {
    services: Array<{ id: number; name: string; code?: string | null }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lab Result Options', href: index().url },
    { title: 'New Result Option', href: '#' },
];

export default function LabResultOptionCreate({ services }: Props) {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceIdParam = urlParams.get('service_id');

    const { data, setData, post, processing, errors } = useForm({
        lab_service_id: serviceIdParam || '',
        option_name: '',
        option_code: '',
        symbol: '',
        is_abnormal: false,
        display_order: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/lab-result-options');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Lab Result Option" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={index().url}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">New Lab Result Option</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="lab_service_id">Lab Service *</Label>
                        <Select
                            value={data.lab_service_id}
                            onValueChange={(value) => setData('lab_service_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select lab service" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem key={service.id} value={service.id.toString()}>
                                        {service.code ? `${service.code} - ${service.name}` : service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.lab_service_id && <p className="text-sm text-red-500">{errors.lab_service_id}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="option_name">Expected result option *</Label>
                            <Input
                                id="option_name"
                                value={data.option_name}
                                onChange={(e) => setData('option_name', e.target.value)}
                                placeholder="e.g., Positive"
                            />
                            {errors.option_name && <p className="text-sm text-red-500">{errors.option_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="option_code">Code</Label>
                            <Input
                                id="option_code"
                                value={data.option_code}
                                onChange={(e) => setData('option_code', e.target.value)}
                                placeholder="e.g., POSITIVE"
                            />
                            {errors.option_code && <p className="text-sm text-red-500">{errors.option_code}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="symbol">Symbol</Label>
                            <Input
                                id="symbol"
                                value={data.symbol}
                                onChange={(e) => setData('symbol', e.target.value)}
                                placeholder="e.g., +"
                            />
                            {errors.symbol && <p className="text-sm text-red-500">{errors.symbol}</p>}
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="display_order">Display Order</Label>
                            <Input
                                id="display_order"
                                type="number"
                                min="0"
                                value={data.display_order}
                                onChange={(e) => setData('display_order', parseInt(e.target.value) || 0)}
                            />
                            {errors.display_order && <p className="text-sm text-red-500">{errors.display_order}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_abnormal"
                                checked={data.is_abnormal}
                                onChange={(e) => setData('is_abnormal', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <Label htmlFor="is_abnormal">Mark as Abnormal</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                    <Link href={index().url}>
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Result Option'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
