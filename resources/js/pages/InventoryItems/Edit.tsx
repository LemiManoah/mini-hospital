import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';
import { index as indexRoute } from '@/routes/inventory-items';
import { InventoryItem } from '@/types/inventory-item';

type Option = {
    value: string;
    label: string;
};

type Props = {
    item: InventoryItem;
    itemTypes: Option[];
    categories: Array<{ id: number; name: string }>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Inventory Items',
        href: indexRoute().url,
    },
    {
        title: 'Edit Item',
        href: '#',
    },
];

export default function InventoryItemEdit({ item, itemTypes = [], categories = [] }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: item.name || '',
        generic_name: item.generic_name || '',
        code: item.code || '',
        item_type: item.item_type || '',
        item_category_id: item.item_category_id ? String(item.item_category_id) : '',
        unit_of_measure: item.unit_of_measure || '',
        is_controlled: Boolean(item.is_controlled),
        is_expirable: Boolean(item.is_expirable),
        default_expiry_date: item.default_expiry_date || '',
        min_stock: item.min_stock ? String(item.min_stock) : '',
        reorder_level: item.reorder_level ? String(item.reorder_level) : '',
        cost_price: item.cost_price ? String(item.cost_price) : '',
        selling_price: item.selling_price ? String(item.selling_price) : '',
        is_active: Boolean(item.is_active),
        notes: item.notes || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/inventory-items/${item.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Inventory Item" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={indexRoute().url} className="mr-2">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Inventory Item</h1>
                </div>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="code">Item Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                            />
                            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Item Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="generic_name">Generic Name</Label>
                            <Input
                                id="generic_name"
                                value={data.generic_name}
                                onChange={(e) => setData('generic_name', e.target.value)}
                            />
                            {errors.generic_name && <p className="text-sm text-red-500">{errors.generic_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="item_type">Classification *</Label>
                            <Select value={data.item_type} onValueChange={(value) => setData('item_type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select classification" />
                                </SelectTrigger>
                                <SelectContent>
                                    {itemTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.item_type && <p className="text-sm text-red-500">{errors.item_type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="item_category_id">Item Category *</Label>
                            <Select value={data.item_category_id} onValueChange={(value) => setData('item_category_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.item_category_id && <p className="text-sm text-red-500">{errors.item_category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unit_of_measure">Unit of Measure *</Label>
                            <Input
                                id="unit_of_measure"
                                value={data.unit_of_measure}
                                onChange={(e) => setData('unit_of_measure', e.target.value)}
                                required
                            />
                            {errors.unit_of_measure && <p className="text-sm text-red-500">{errors.unit_of_measure}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="min_stock">Minimum Stock</Label>
                            <Input
                                id="min_stock"
                                type="number"
                                min="0"
                                value={data.min_stock}
                                onChange={(e) => setData('min_stock', e.target.value)}
                            />
                            {errors.min_stock && <p className="text-sm text-red-500">{errors.min_stock}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reorder_level">Reorder Level</Label>
                            <Input
                                id="reorder_level"
                                type="number"
                                min="0"
                                value={data.reorder_level}
                                onChange={(e) => setData('reorder_level', e.target.value)}
                            />
                            {errors.reorder_level && <p className="text-sm text-red-500">{errors.reorder_level}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cost_price">Cost Price</Label>
                            <Input
                                id="cost_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.cost_price}
                                onChange={(e) => setData('cost_price', e.target.value)}
                            />
                            {errors.cost_price && <p className="text-sm text-red-500">{errors.cost_price}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="selling_price">Selling Price</Label>
                            <Input
                                id="selling_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.selling_price}
                                onChange={(e) => setData('selling_price', e.target.value)}
                            />
                            {errors.selling_price && <p className="text-sm text-red-500">{errors.selling_price}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="default_expiry_date">Default Expiry Date</Label>
                            <Input
                                id="default_expiry_date"
                                type="date"
                                value={data.default_expiry_date}
                                onChange={(e) => setData('default_expiry_date', e.target.value)}
                                disabled={!data.is_expirable}
                            />
                            {errors.default_expiry_date && <p className="text-sm text-red-500">{errors.default_expiry_date}</p>}
                        </div>

                        <div className="space-y-2 col-span-full">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                            {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <Label>Flags</Label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_controlled"
                                        checked={data.is_controlled}
                                        onCheckedChange={(checked) => setData('is_controlled', Boolean(checked))}
                                    />
                                    <Label htmlFor="is_controlled">Controlled Item</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_expirable"
                                        checked={data.is_expirable}
                                        onCheckedChange={(checked) => setData('is_expirable', Boolean(checked))}
                                    />
                                    <Label htmlFor="is_expirable">Expirable</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Link href={indexRoute().url}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
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
