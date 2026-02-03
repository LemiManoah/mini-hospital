import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { index as indexRoute, edit } from '@/routes/inventory-items';
import { InventoryItem } from '@/types/inventory-item';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Inventory Items', href: indexRoute().url },
    { title: 'Item Details', href: '#' },
];

export default function InventoryItemShow({ item }: { item: InventoryItem }) {
    const formatType = (type: InventoryItem['item_type']) =>
        type === 'general_supply' ? 'General Supply' : type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory Item Details" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href={indexRoute().url} className="mr-2">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Inventory Item Details</h1>
                </div>
                <Link href={edit(item.id).url}>
                    <Button variant="outline">Edit Item</Button>
                </Link>
            </div>

            <div className="m-2 grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                        <div>
                            <div className="text-muted-foreground">Code</div>
                            <div className="font-medium">{item.code}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Generic Name</div>
                            <div className="font-medium">{item.generic_name || '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Type</div>
                            <div className="font-medium">{formatType(item.item_type)}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Category</div>
                            <div className="font-medium">{item.category?.name || '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Unit of Measure</div>
                            <div className="font-medium">{item.unit_of_measure}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Expirable</div>
                            <div className="font-medium">{item.is_expirable ? 'Yes' : 'No'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Default Expiry Date</div>
                            <div className="font-medium">{item.default_expiry_date || '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Controlled</div>
                            <div className="font-medium">{item.is_controlled ? 'Yes' : 'No'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Min Stock</div>
                            <div className="font-medium">{item.min_stock ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Reorder Level</div>
                            <div className="font-medium">{item.reorder_level ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Cost Price</div>
                            <div className="font-medium">{item.cost_price ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Selling Price</div>
                            <div className="font-medium">{item.selling_price ?? '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Status</div>
                            <div className="font-medium">{item.is_active ? 'Active' : 'Inactive'}</div>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <div className="text-muted-foreground">Notes</div>
                            <div className="font-medium">{item.notes || '-'}</div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
