import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface LabOrder {
    id: number;
    status?: string;
    visit: {
        id: number;
        visit_number: string;
        patient: {
            name: string;
            first_name: string;
            last_name: string;
            age?: number;
            gender?: string;
        };
    };
    items: Array<{
        id: number;
        visit_order_id?: number;
        item_type: string;
        item_id: number;
        labService: {
            name: string;
            code: string;
            sampleType?: {
                name: string;
                code: string;
                default_container: string;
            };
        };
        lab_service?: {
            name: string;
            code: string;
            sample_type?: {
                name: string;
                code: string;
                default_container: string;
            };
        };
        service?: {
            name: string;
            code?: string;
            
        };
        item?: {
            name: string;
            code?: string;
        };
        labSample?: {
            id: number;
            sample_number: string;
            status: string;
        };
    }>;
}

interface SamplePickModalProps {
    order: LabOrder;
    item: LabOrder['items'][number];
    onSuccess?: () => void;
}

export default function SamplePickModal({ order, item, onSuccess }: SamplePickModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sampleTaken, setSampleTaken] = useState('');
    const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);

    const getPatientName = (patient: any) => {
        return patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!sampleTaken.trim()) {
            alert('Please enter sample details');
            return;
        }

        setLoading(true);

        try {
            // Update only the selected item sample
            await router.put(`/lab-queue/items/${item.id}/pick-sample`, {
                sample_taken: sampleTaken,
                collection_date: collectionDate,
            }, {
                onSuccess: () => {
                    setIsOpen(false);
                    setSampleTaken('');
                    setCollectionDate(new Date().toISOString().split('T')[0]);
                    onSuccess?.();
                },
                onError: (errors) => {
                    console.error('Failed to pick samples:', errors);
                    alert('Failed to pick sample');
                },
            });
        } catch (error) {
            console.error('Error picking samples:', error);
            alert('Failed to pick sample');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    Pick Sample
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Pick Lab Sample</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Patient Information */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-gray-900">Patient</div>
                        <div className="text-lg font-semibold">{getPatientName(order.visit.patient)}</div>
                        <div className="text-sm text-gray-500">
                            {order.visit.patient.age}y • {order.visit.patient.gender} • {order.visit.visit_number}
                        </div>
                    </div>

                    {/* Tests Being Done */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Test and Sample Type</Label>
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                            {(() => {
                                const service = item.labService || item.lab_service || item.service || item.item || null;
                                const sampleType = service?.sampleType || service?.sample_type || null;
                                return (
                                    <div className="text-sm">
                                        <div className="font-medium">
                                            {service ? service.name : `No Lab Service (ID: ${item.item_id || 'unknown'})`}
                                        </div>
                                        <div className="text-gray-500">
                                            {service ? service.code || '—' : `Item ID: ${item.item_id || 'unknown'}`}
                                        </div>
                                        {sampleType ? (
                                            <div className="mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Sample: {sampleType.name} ({sampleType.code})
                                                {sampleType.default_container && (
                                                    <span> • Container: {sampleType.default_container}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mt-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                No sample type defined
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Collection Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="collection_notes">Collection Notes</Label>
                        <Input
                            id="collection_notes"
                            value={sampleTaken}
                            onChange={(e) => setSampleTaken(e.target.value)}
                            placeholder="e.g., Blood drawn from left arm, Patient fasting, No complications"
                            required
                        />
                    </div>

                    {/* Collection Date */}
                    <div className="space-y-2">
                        <Label htmlFor="collection_date">Collection Date</Label>
                        <div className="relative">
                            <Input
                                id="collection_date"
                                type="date"
                                value={collectionDate}
                                onChange={(e) => setCollectionDate(e.target.value)}
                                required
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Saving...' : 'Confirm Sample Pick'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
