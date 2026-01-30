import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { LabService, LabReferenceRange } from '@/types/lab';
import { create, edit, destroy, index } from '@/routes/lab-result-options';
import { create as createParameter, edit as editParameter, destroy as destroyParameter } from '@/routes/lab-result-parameters';
import { create as createRange, edit as editRange, destroy as destroyRange } from '@/routes/lab-reference-ranges';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Lab Result Options', href: index().url },
];

export default function LabResultOptionIndex({
    labServices,
    filters,
}: {
    labServices: LabService[];
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(index.url({ query: { search } }), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this lab option?')) {
            router.delete(destroy(id).url);
        }
    };

    const handleDeleteParameter = (id: number) => {
        if (confirm('Are you sure you want to delete this parameter?')) {
            router.delete(destroyParameter(id).url);
        }
    };

    const handleDeleteRange = (id: number) => {
        if (confirm('Are you sure you want to delete this reference range?')) {
            router.delete(destroyRange(id).url);
        }
    };

    const formatAgeRange = (from?: string | null, to?: string | null): string => {
        if (!from && !to) return '-';
        if (!from) return `0-${to}`;
        if (!to) return `${from}+`;
        return `${from}-${to}`;
    };

    const formatReferenceRange = (range: LabReferenceRange): string => {
        if (range.reference_text) return range.reference_text;
        if (range.min_value !== null && range.max_value !== null) {
            return `${range.min_value} - ${range.max_value}`;
        }
        return '-';
    };

    const formatPhaseOrWeeks = (range: LabReferenceRange): string => {
        if (range.phase) return range.phase;
        if (range.weeks_from && range.weeks_to) {
            return `${range.weeks_from}-${range.weeks_to}week(s)`;
        }
        return '-';
    };

    const renderServiceCard = (service: LabService) => {
        const resultFormat = service.labResultType?.result_format || 'simple_options';
        const isMachineBased = resultFormat === 'machine_based';
        const isParameterBased = resultFormat === 'parameter_based' || resultFormat === 'complex_hormone';
        const isComplexHormone = resultFormat === 'complex_hormone';

        return (
            <Card key={service.id} className="mb-4">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">SERVICE NAME: {service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isMachineBased ? (
                        <p className="text-muted-foreground italic">
                            No options for {service.name}. It is machine-based test
                        </p>
                    ) : isParameterBased ? (
                        <div className="space-y-4">
                            {service.resultParameters && service.resultParameters.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Parameter</TableHead>
                                                {isComplexHormone && <TableHead>Phase/Weeks</TableHead>}
                                                <TableHead>Age</TableHead>
                                                <TableHead>Sex</TableHead>
                                                <TableHead>Range/Reference</TableHead>
                                                <TableHead>Unit</TableHead>
                                                <TableHead>Parameter Action</TableHead>
                                                <TableHead>Range Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {service.resultParameters.map((parameter) => {
                                                const ranges = parameter.referenceRanges || [];
                                                if (ranges.length === 0) {
                                                    return (
                                                        <TableRow key={parameter.id}>
                                                            <TableCell className="font-medium">
                                                                {parameter.parameter_name}
                                                            </TableCell>
                                                            {isComplexHormone && <TableCell>-</TableCell>}
                                                            <TableCell>-</TableCell>
                                                            <TableCell>-</TableCell>
                                                            <TableCell>-</TableCell>
                                                            <TableCell>{parameter.unit || '-'}</TableCell>
                                                            <TableCell>
                                                                <div className="flex gap-2">
                                                                    <Link href={createRange().url + `?parameter_id=${parameter.id}`}>
                                                                        <Button variant="outline" size="sm">
                                                                            <Plus className="h-3 w-3 mr-1" />
                                                                            Add Range
                                                                        </Button>
                                                                    </Link>
                                                                    <Link href={editParameter(parameter.id).url}>
                                                                        <Button variant="outline" size="sm">
                                                                            <Pencil className="h-3 w-3" />
                                                                        </Button>
                                                                    </Link>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteParameter(parameter.id)}
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                }
                                                return ranges.map((range, idx) => (
                                                    <TableRow key={`${parameter.id}-${range.id}-${idx}`}>
                                                        {idx === 0 && (
                                                            <>
                                                                <TableCell
                                                                    className="font-medium"
                                                                    rowSpan={ranges.length}
                                                                >
                                                                    {parameter.parameter_name}
                                                                </TableCell>
                                                            </>
                                                        )}
                                                        {isComplexHormone && (
                                                            <TableCell>{formatPhaseOrWeeks(range)}</TableCell>
                                                        )}
                                                        <TableCell>{formatAgeRange(range.age_range_from, range.age_range_to)}</TableCell>
                                                        <TableCell className="capitalize">{range.sex}</TableCell>
                                                        <TableCell>{formatReferenceRange(range)}</TableCell>
                                                        {idx === 0 && (
                                                            <TableCell rowSpan={ranges.length}>
                                                                {parameter.unit || '-'}
                                                            </TableCell>
                                                        )}
                                                        {idx === 0 && (
                                                            <TableCell rowSpan={ranges.length}>
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex gap-2">
                                                                        <Link href={createRange().url + `?parameter_id=${parameter.id}`}>
                                                                            <Button variant="outline" size="sm">
                                                                                <Plus className="h-3 w-3 mr-1" />
                                                                                Add Range
                                                                            </Button>
                                                                        </Link>
                                                                        <Link href={editParameter(parameter.id).url}>
                                                                            <Button variant="outline" size="sm">
                                                                                <Pencil className="h-3 w-3" />
                                                                            </Button>
                                                                        </Link>
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            onClick={() => handleDeleteParameter(parameter.id)}
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        )}
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                <Link href={editRange(range.id).url}>
                                                                    <Button variant="outline" size="sm">
                                                                        <Pencil className="h-3 w-3" />
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteRange(range.id)}
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ));
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No parameters defined for {service.name}</p>
                            )}
                            <div className="mt-4">
                                <Link href={createParameter().url + `?service_id=${service.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Parameter
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {service.resultOptions && service.resultOptions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Expected result option</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Symbol</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {service.resultOptions.map((option) => (
                                                <TableRow key={option.id}>
                                                    <TableCell className="font-medium">{option.option_name}</TableCell>
                                                    <TableCell>{option.option_code || '-'}</TableCell>
                                                    <TableCell>{option.symbol || '-'}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Link href={edit(option.id).url}>
                                                                <Button variant="outline" size="sm">
                                                                    <Pencil className="h-3 w-3" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(option.id)}
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No options for {service.name}</p>
                            )}
                            <div className="mt-4">
                                <Link href={create().url + `?service_id=${service.id}&type=option`}>
                                    <Button variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Option
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lab Result Options" />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <h1 className="text-2xl font-bold">Result Options</h1>
            </div>

            <div className="m-2 rounded border p-4">
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-2 max-w-md">
                        <Input
                            placeholder="Search by Service Name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>
                </form>

                <div className="space-y-4">
                    {labServices.length > 0 ? (
                        labServices.map((service) => renderServiceCard(service))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            {search ? `No services found matching "${search}"` : 'No lab services found'}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
