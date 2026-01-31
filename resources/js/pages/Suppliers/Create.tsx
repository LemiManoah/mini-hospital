import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Suppliers', href: '/suppliers' },
    { title: 'Create Supplier', href: '#' },
];

export default function SupplierCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/suppliers');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Supplier" />

            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Create Supplier</h1>
                    <p className="text-gray-600">Add a new supplier to the system</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Supplier Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g., MediPharm Kenya Ltd"
                            className="mt-1"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="contact_person">Contact Person</Label>
                        <Input
                            id="contact_person"
                            value={data.contact_person}
                            onChange={(e) => setData('contact_person', e.target.value)}
                            placeholder="e.g., Dr. John Kamau"
                            className="mt-1"
                        />
                        {errors.contact_person && (
                            <p className="mt-1 text-sm text-red-600">{errors.contact_person}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="e.g., info@medipharm.co.ke"
                                className="mt-1"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="e.g., +254-20-1234567"
                                className="mt-1"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Full physical address"
                            rows={3}
                            className="mt-1"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Additional notes about the supplier"
                            rows={3}
                            className="mt-1"
                        />
                        {errors.notes && (
                            <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/suppliers">
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Supplier'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
