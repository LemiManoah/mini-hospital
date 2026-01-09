import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { type PatientCategory } from '@/types/patientcategories';

const breadcrumbs = (id: string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Patient Categories',
        href: '/patient-categories',
    },
    {
        title: 'Edit Patient Category',
        href: `/patient-categories/${id}/edit`,
    },
];

type Props = {
    patientCategory: PatientCategory;
};

export default function PatientCategoryEdit({ patientCategory }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(patientCategory.id.toString())}>
            <Head title={`Edit ${patientCategory.name}`} />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Edit Patient Category</h1>
                <Link href="/patient-categories" className="btn">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Form 
                    method="put" 
                    action={`/patient-categories/${patientCategory.id}`}
                >
                    <div className="mb-4">
                        <Label className="mb-2 block font-bold" htmlFor="name">
                            Name *
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={patientCategory.name}
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="mb-4 flex items-center space-x-2">
                        <Checkbox
                            id="is_insurance"
                            name="is_insurance"
                            value="1"
                            defaultChecked={patientCategory.is_insurance}
                        />
                        <Label htmlFor="is_insurance">Is Insurance</Label>
                    </div>
                    <div className="mb-4 flex items-center space-x-2">
                        <Checkbox
                            id="is_active"
                            name="is_active"
                            value="1"
                            defaultChecked={patientCategory.is_active}
                        />
                        <Label htmlFor="is_active">Is Active</Label>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button type="submit">Update Category</Button>
                        <Link
                            href={`/patient-categories/${patientCategory.id}`}
                            method="delete"
                            as="button"
                            className="text-sm text-red-500 hover:text-red-700"
                            onBefore={() => {
                                return window.confirm('Are you sure you want to delete this category?');
                            }}
                        >
                            Delete Category
                        </Link>
                    </div>
                </Form>
            </div>
        </AppLayout>
    );
}