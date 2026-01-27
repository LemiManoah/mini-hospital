import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { index as indexRoute } from '@/routes/services';
import { Service } from '@/types/service';
import { ServiceType } from '@/types/service-type';

type Props = {
    service: Service;
    serviceTypes: ServiceType[];
};

export default function ServiceEdit({ service, serviceTypes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        service_type_id: String(service.service_type_id) || '',
        name: service.name || '',
        description: service.description || '',
        cost: String(service.cost) || '',
        price: String(service.price) || '',
        is_active: service.is_active || true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/services/${service.id}`);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Services',
            href: indexRoute().url,
        },
        {
            title: `Edit Service - ${service.name}`,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Service - ${service.name}`} />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={indexRoute().url} className="mr-2">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Service: {service.name}</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="service_type_id">Service Type *</Label>
                            <Select name="service_type_id" value={data.service_type_id} onValueChange={(value) => setData('service_type_id', value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select service type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceTypes.map((serviceType) => (
                                        <SelectItem key={serviceType.id} value={String(serviceType.id)}>
                                            {serviceType.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.service_type_id && <p className="text-sm text-red-500">{errors.service_type_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter service name"
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cost">Cost *</Label>
                            <Input
                                id="cost"
                                type="number"
                                value={data.cost}
                                onChange={(e) => setData('cost', e.target.value)}
                                placeholder="Enter cost"
                                required
                            />
                            {errors.cost && <p className="text-sm text-red-500">{errors.cost}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="Enter price"
                                required
                            />
                            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                        </div>

                        <div className="space-y-2 col-span-full">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter description"
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                            />
                            <Label htmlFor="is_active">Active</Label>
                            {errors.is_active && <p className="text-sm text-red-500">{errors.is_active}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href={indexRoute().url}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Service'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
