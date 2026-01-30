import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { LabService } from '@/types/lab';

interface LabOrderItem {
    id: string;
    lab_service_id: number;
    service: LabService;
    quantity: number;
    price: number;
}

interface LabOrderPanelProps {
    visitId: number;
    onOrderChange?: (orders: LabOrderItem[]) => void;
}

type Category = { id: number; name: string };

type LabServiceResponse = {
    data: LabService[];
};

export default function LabOrderPanel({ visitId, onOrderChange }: LabOrderPanelProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [labServices, setLabServices] = useState<LabService[]>([]);
    const [selectedServices, setSelectedServices] = useState<LabOrderItem[]>([]);
    const [loading, setLoading] = useState(false);

    const canOrder = visitId > 0;

    const totalPrice = useMemo(() => {
        return selectedServices.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [selectedServices]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch('/lab-service-categories?active_only=1', {
                    headers: { Accept: 'application/json' },
                });
                const data = await response.json();
                setCategories((data.data ?? data) as Category[]);
            } catch (error) {
                console.error('Error fetching lab categories:', error);
            }
        };

        loadCategories();
    }, []);

    useEffect(() => {
        fetchLabServices(selectedCategory);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchLabServices = async (categoryValue?: string) => {
        setLoading(true);
        try {
            const resolvedCategory = categoryValue ?? selectedCategory;
            const category = resolvedCategory === 'all' ? '' : resolvedCategory;
            const response = await fetch(`/lab-services?category=${category}`, {
                headers: { Accept: 'application/json' },
            });
            const data = (await response.json()) as LabServiceResponse;
            setLabServices(data.data || []);
            setSelectedServiceId('');
        } catch (error) {
            console.error('Error fetching lab services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = (service: LabService) => {
        const existing = selectedServices.find((item) => item.lab_service_id === service.id);
        if (existing) {
            setSelectedServices((prev) =>
                prev.map((item) =>
                    item.lab_service_id === service.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
            return;
        }

        const newItem: LabOrderItem = {
            id: `temp-${Date.now()}-${service.id}`,
            lab_service_id: service.id,
            service,
            quantity: 1,
            price: Number(service.price) || 0,
        };
        setSelectedServices((prev) => [...prev, newItem]);
    };

    const handleRemoveService = (labServiceId: number) => {
        setSelectedServices((prev) => prev.filter((item) => item.lab_service_id !== labServiceId));
    };

    const handleQuantityChange = (labServiceId: number, quantity: number) => {
        if (Number.isNaN(quantity) || quantity <= 0) {
            handleRemoveService(labServiceId);
            return;
        }

        setSelectedServices((prev) =>
            prev.map((item) =>
                item.lab_service_id === labServiceId ? { ...item, quantity } : item
            )
        );
    };

    const handleSubmitOrder = async () => {
        if (!canOrder || selectedServices.length === 0) return;

        try {
            await router.post('/visit-orders', {
                visit_id: visitId,
                order_type: 'lab',
                items: selectedServices.map((item) => ({
                    service_id: item.lab_service_id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            }, {
                onSuccess: () => {
                    onOrderChange?.(selectedServices);
                    setSelectedServices([]);
                },
                onError: (errors) => {
                    console.error('Order errors:', errors);
                    alert('Failed to place lab order');
                },
            });
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place lab order');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Lab Orders
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!canOrder && (
                    <div className="rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-900">
                        Select a visit to place lab orders.
                    </div>
                )}

                {/* Category and Service Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Service Category</label>
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => {
                                setSelectedCategory(value);
                                setLabServices([]);
                                fetchLabServices(value);
                            }}
                            disabled={loading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={String(category.id)}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Lab Service</label>
                        <Select
                            value={selectedServiceId}
                            onValueChange={(value) => {
                                setSelectedServiceId(value);
                                const service = labServices.find((item) => item.id === Number(value));
                                if (service) {
                                    handleAddService(service);
                                }
                            }}
                            disabled={loading || labServices.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={loading ? 'Loading...' : 'Select lab service'} />
                            </SelectTrigger>
                            <SelectContent>
                                {labServices.length === 0 && (
                                    <SelectItem value="none" disabled>
                                        {loading ? 'Loading services...' : 'No services found'}
                                    </SelectItem>
                                )}
                                {labServices.map((service) => (
                                    <SelectItem key={service.id} value={String(service.id)}>
                                        <div>
                                            <div>{service.code} - {service.name} (UGX{service.price})</div>
                                            {service.sampleType && (
                                                <div className="text-xs text-gray-500">
                                                    Sample: {service.sampleType.name} ({service.sampleType.default_container})
                                                </div>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {selectedServices.length > 0 && (
                    <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Selected Services</h4>
                        <div className="space-y-2">
                            {selectedServices.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">{item.service.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {item.service.code} • UGX{item.price}
                                        </div>
                                        {item.service.sampleType && (
                                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
                                                Sample: {item.service.sampleType.name} ({item.service.sampleType.code})
                                                {item.service.sampleType.default_container && (
                                                    <span> • Container: {item.service.sampleType.default_container}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    item.lab_service_id,
                                                    parseInt(e.target.value, 10) || 1
                                                )
                                            }
                                            className="w-16 h-8"
                                        />
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleRemoveService(item.lab_service_id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Total:</span>
                                <span className="font-bold text-lg">UGX{totalPrice}</span>
                            </div>
                        </div>
                        <Button
                            onClick={handleSubmitOrder}
                            className="w-full mt-4"
                            disabled={!canOrder || selectedServices.length === 0}
                        >
                            Place Lab Order
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
