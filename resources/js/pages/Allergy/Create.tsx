import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Allergies',
        href: '/allergies',
    },
    {
        title: 'Create Allergy',
        href: '#',
    },
];

export default function AllergyCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Allergy" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Create Allergy</h1>
                <Link href="/allergies" className="btn">
                    <Button>Back</Button>
                </Link>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Form method="post" action="/allergies">
                    <div className="mb-4">
                        <Label className="block mb-2 font-bold" htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter allergy name"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <Label className="block mb-2 font-bold" htmlFor="description">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Enter allergy description"
                            rows={3}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <Label className="block mb-2 font-bold" htmlFor="severity">
                            Severity
                        </Label>
                        <Select name="severity" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mild">Mild</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="severe">Severe</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="mb-4">
                        <Label className="block mb-2 font-bold" htmlFor="reaction_type">
                            Reaction Type
                        </Label>
                        <Input
                            id="reaction_type"
                            name="reaction_type"
                            type="text"
                            placeholder="e.g., Anaphylaxis, Rash, Respiratory"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="is_active" name="is_active" defaultChecked />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                    </div>
                    
                    <Button type="submit">Create Allergy</Button>
                </Form>
            </div>
        </AppLayout>
    );
}
