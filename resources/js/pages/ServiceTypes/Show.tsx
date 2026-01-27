import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as serviceTypesIndex } from '@/routes/service-types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ServiceType } from '@/types/service-type';

const breadcrumbs = (serviceType: ServiceType): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Service Types',
        href: serviceTypesIndex().url,
    },
    {
        title: serviceType.name,
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
    serviceType: ServiceType;
}

export default function Show({ serviceType }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(serviceType)}>
            <Head title={serviceType.name} />

            <div className="container mx-auto px-4 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={serviceTypesIndex().url} className="text-sm text-gray-500 hover:text-gray-700">
                            ← Back
                        </Link>
                        <h1 className="text-xl font-semibold">{serviceType.name}</h1>
                        <Badge variant={serviceType.is_active ? 'default' : 'destructive'}>
                            {serviceType.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>

                    <Link href={`/service-types/${serviceType.id}/edit`}>
                        <Button size="sm" variant="outline">
                            Edit Service Type
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Type Details</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfoCard title="Name" value={serviceType.name} />
                        <InfoCard title="Description" value={serviceType.description} className="md:col-span-1 lg:col-span-3" />
                        <InfoCard title="Status" value={serviceType.is_active ? 'Active' : 'Inactive'} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
