import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as servicesIndex } from '@/routes/services';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Service } from '@/types/service';

const breadcrumbs = (service: Service): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Services',
        href: servicesIndex().url,
    },
    {
        title: service.name,
        href: '#',
    },
];

interface InfoCardProps {
    title: string;
    value: React.ReactNode;
    className?: string;
}

const InfoCard = ({ title, value, className = '' }: InfoCardProps) => (
    <div className={`p-3 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="mt-1 text-sm text-gray-900">{value || 'N/A'}</p>
    </div>
);

interface ShowProps {
    service: Service;
}

export default function Show({ service }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(service)}>
            <Head title={service.name} />

            <div className="container mx-auto px-4 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={servicesIndex().url} className="text-sm text-gray-500 hover:text-gray-700">
                            ← Back
                        </Link>
                        <h1 className="text-xl font-semibold">{service.name}</h1>
                        <Badge variant={service.is_active ? 'default' : 'destructive'}>
                            {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>

                    <Link href={`/services/${service.id}/edit`}>
                        <Button size="sm" variant="outline">
                            Edit Service
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfoCard title="Name" value={service.name} />
                        <InfoCard title="Service Type" value={service.service_type?.name || 'N/A'} />
                        <InfoCard title="Cost" value={service.cost} />
                        <InfoCard title="Price" value={service.price} />
                        <InfoCard title="Description" value={service.description} className="md:col-span-full" />
                        <InfoCard title="Status" value={service.is_active ? 'Active' : 'Inactive'} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
