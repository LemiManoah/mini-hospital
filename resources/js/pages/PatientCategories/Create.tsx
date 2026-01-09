import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Patient Categories',
        href: '/patient-categories',
    },
    {
        title: 'Create Patient Category',
        href: '#',
    },
];

export default function PatientCategoryCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Patient Category" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Create Patient Category</h1>
                <Link href="/patient-categories" className="btn">
                    <Button>Back</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Form method="post" action="/patient-categories">
                    <div className="mb-4">
                        <Label className="mb-2 block font-bold" htmlFor="name">
                            Name *
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="mb-4 flex items-center space-x-2">
                        <Checkbox
                            id="is_insurance"
                            name="is_insurance"
                            value="1"
                        />
                        <Label htmlFor="is_insurance">Is Insurance</Label>
                    </div>
                    <div className="mb-4 flex items-center space-x-2">
                        <Checkbox
                            id="is_active"
                            name="is_active"
                            value="1"
                            defaultChecked
                        />
                        <Label htmlFor="is_active">Is Active</Label>
                    </div>
                    <Button type="submit">Create Patient Category</Button>
                </Form>
            </div>
        </AppLayout>
    );
}
