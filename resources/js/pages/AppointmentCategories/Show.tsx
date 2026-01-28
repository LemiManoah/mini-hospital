import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';

type Category = {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    is_active: boolean;
};

type Props = {
    category: Category;
};

const breadcrumbs = (category: Category): BreadcrumbItem[] => [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Appointment Categories', href: '/appointment-categories' },
    { title: category.name, href: '#' },
];

export default function AppointmentCategoryShow({ category }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(category)}>
            <Head title={category.name} />
            <div className="mt-4 mb-4 flex items-center gap-2 px-4">
                <Link href="/appointment-categories" className="mr-2">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">{category.name}</h1>
                <div className="ml-auto">
                    <Link href={`/appointment-categories/${category.id}/edit`}>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="m-2 rounded border p-6 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Code</p>
                            <p className="mt-1 text-sm text-gray-900">{category.code}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active</p>
                            <p className="mt-1 text-sm text-gray-900">{category.is_active ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</p>
                            <p className="mt-1 text-sm text-gray-900">{category.description || '-'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
