import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Store Stock Report', href: '/store-stocks-report' },
];

type Store = { id: number; name: string };

type ReportRow = {
    id: number;
    name: string;
    item_type: string;
    unit_of_measure: string;
    is_expirable: boolean;
    category?: string | null;
    stores: Record<number, number>;
};

export default function StoreStockReport({
    stores,
    items,
    filters,
}: {
    stores: Store[];
    items: ReportRow[];
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/store-stocks-report', { search }, { preserveState: true, replace: true });
    };

    const formatType = (type: string) =>
        type === 'general_supply' ? 'General Supply' : type.charAt(0).toUpperCase() + type.slice(1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Store Stock Report" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                </form>
            </div>

            <div className="m-2 overflow-x-auto rounded border p-4">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Expirable</TableHead>
                            {stores.map((store) => (
                                <TableHead key={store.id}>{store.name}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length > 0 ? (
                            items.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <div className="font-medium">{row.name}</div>
                                        <div className="text-xs text-muted-foreground">{row.category || '-'}</div>
                                    </TableCell>
                                    <TableCell>{formatType(row.item_type)}</TableCell>
                                    <TableCell>{row.unit_of_measure}</TableCell>
                                    <TableCell>{row.is_expirable ? 'Yes' : 'No'}</TableCell>
                                    {stores.map((store) => (
                                        <TableCell key={`${row.id}-${store.id}`}>
                                            {row.stores[store.id] ?? 0}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4 + stores.length} className="py-4 text-center">
                                    No stock data available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
