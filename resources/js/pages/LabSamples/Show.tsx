import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { LabSample } from '@/types/lab';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Lab Samples', href: '/lab-samples' },
    { title: 'Sample Details', href: '#' },
];

export default function LabSampleShow({ labSample }: { labSample: LabSample }) {
    const handleReceive = () => {
        router.post(`/lab-samples/${labSample.id}/receive`);
    };

    const handleReject = () => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            router.post(`/lab-samples/${labSample.id}/reject`, {
                rejection_reason: reason
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Sample ${labSample.sample_number}`} />
            <div className="mt-4 mb-4 flex items-center justify-between gap-2 px-4">
                <div className="flex items-center gap-2">
                    <Link href="/lab-samples">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Sample {labSample.sample_number}</h1>
                </div>
                <div className="flex gap-2">
                    {labSample.status === 'collected' && (
                        <>
                            <Button onClick={handleReceive} disabled={processing}>
                                Receive Sample
                            </Button>
                            <Button variant="destructive" onClick={handleReject} disabled={processing}>
                                Reject Sample
                            </Button>
                        </>
                    )}
                    <Link href={`/lab-samples/${labSample.id}/edit`}>
                        <Button variant="outline">Edit</Button>
                    </Link>
                </div>
            </div>

            <div className="m-2 grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Sample Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Sample Number</p>
                            <p className="font-semibold">{labSample.sample_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={
                                labSample.status === 'collected' ? 'default' :
                                labSample.status === 'received' ? 'default' :
                                'destructive'
                            }>
                                {labSample.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sample Type</p>
                            <p className="font-semibold">{labSample.sampleType?.name ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Test</p>
                            <p className="font-semibold">{labSample.visitOrderItem?.service?.name ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Container</p>
                            <p className="font-semibold">{labSample.container ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Volume</p>
                            <p className="font-semibold">{labSample.volume ?? '-'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Collection Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Collected By</p>
                            <p className="font-semibold">{labSample.collectedBy?.name ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Collected At</p>
                            <p className="font-semibold">
                                {labSample.collected_at ? new Date(labSample.collected_at).toLocaleString() : '-'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {labSample.status === 'rejected' && labSample.rejection_reason && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Rejection Reason</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-red-600">{labSample.rejection_reason}</p>
                        </CardContent>
                    </Card>
                )}

                {labSample.status === 'received' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Receiving Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Received By</p>
                                <p className="font-semibold">{labSample.receivedBy?.name ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Received At</p>
                                <p className="font-semibold">
                                    {labSample.received_at ? new Date(labSample.received_at).toLocaleString() : '-'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
