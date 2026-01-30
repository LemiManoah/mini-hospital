import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { ClipboardCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

interface LabResultEntryModalProps {
    item: any;
    patient: any;
    visit: any;
    disabled?: boolean;
    onSuccess?: () => void;
}

export default function LabResultEntryModal({ item, patient, visit, disabled, onSuccess }: LabResultEntryModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const existingResult = useMemo(() => {
        if (!item?.result?.result_payload) return null;
        if (typeof item.result.result_payload === 'string') {
            try {
                return JSON.parse(item.result.result_payload);
            } catch {
                return null;
            }
        }
        return item.result.result_payload;
    }, [item]);

    const service = item?.labService || item?.lab_service || item?.service || item?.item || null;
    const serviceFormat = service?.labResultType?.result_format || service?.lab_result_type?.result_format;
    const resultFieldsCandidate = service?.result_fields || service?.resultFields || [];
    const hasCustomFields = Array.isArray(resultFieldsCandidate) && resultFieldsCandidate.length > 0;
    const initialFormat = existingResult?.result_format || serviceFormat || (hasCustomFields ? 'custom_fields' : 'simple_options');

    const [resultFormat] = useState(initialFormat);
    const [simpleOptionId, setSimpleOptionId] = useState<string>(
        existingResult?.payload?.option_id ? String(existingResult.payload.option_id) : ''
    );
    const [machineValue, setMachineValue] = useState(existingResult?.payload?.value || '');
    const [parameterValues, setParameterValues] = useState<Record<string, string>>(() => {
        const values: Record<string, string> = {};
        const parameters = existingResult?.payload?.parameters || [];
        parameters.forEach((entry: any) => {
            if (entry?.parameter_id) {
                values[String(entry.parameter_id)] = entry.value ?? '';
            }
        });
        return values;
    });
    const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
        const values: Record<string, string> = {};
        const fields = existingResult?.payload?.fields || {};
        Object.keys(fields).forEach((key) => {
            values[key] = fields[key];
        });
        return values;
    });

    const resultOptions = service?.resultOptions || service?.result_options || [];
    const resultParameters = service?.resultParameters || service?.result_parameters || [];
    const resultFields = resultFieldsCandidate;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {};

        if (resultFormat === 'simple_options') {
            const option = resultOptions.find((opt: any) => String(opt.id) === simpleOptionId);
            payload.option_id = option?.id || null;
            payload.option_name = option?.option_name || '';
        } else if (resultFormat === 'parameter_based' || resultFormat === 'complex_hormone') {
            payload.parameters = resultParameters.map((parameter: any) => ({
                parameter_id: parameter.id,
                parameter_name: parameter.parameter_name,
                unit: parameter.unit || null,
                value: parameterValues[String(parameter.id)] || '',
            }));
        } else if (resultFormat === 'custom_fields') {
            payload.fields = fieldValues;
        } else {
            payload.value = machineValue;
        }

        setSaving(true);
        router.put(`/lab/results/items/${item.id}`, {
            result_format: resultFormat,
            result_payload: payload,
        }, {
            onSuccess: () => {
                setSaving(false);
                setIsOpen(false);
                onSuccess?.();
            },
            onError: () => {
                setSaving(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" disabled={disabled}>
                    <ClipboardCheck className="h-3 w-3 mr-1" />
                    {item?.result ? 'Edit Result' : 'Enter Result'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Lab Result Entry</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="rounded-lg border p-3 text-sm">
                        <div className="font-medium">{patient?.name || `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim()}</div>
                        <div className="text-muted-foreground">
                            {patient?.age ? `${patient.age}y` : '—'} • {patient?.gender || '—'} • {visit?.visit_number || '—'}
                        </div>
                        <div className="mt-2 font-medium">{service?.name || 'Lab Service'}</div>
                        <div className="text-muted-foreground">{service?.code || '—'}</div>
                    </div>

                    {resultFormat === 'simple_options' && (
                        <div className="space-y-2">
                            <Label>Result Option</Label>
                            <Select value={simpleOptionId} onValueChange={setSimpleOptionId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select result option" />
                                </SelectTrigger>
                                <SelectContent>
                                    {resultOptions.map((option: any) => (
                                        <SelectItem key={option.id} value={String(option.id)}>
                                            {option.option_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {(resultFormat === 'parameter_based' || resultFormat === 'complex_hormone') && (
                        <div className="space-y-2">
                            <Label>Parameters</Label>
                            <div className="space-y-2">
                                {resultParameters.map((parameter: any) => (
                                    <div key={parameter.id} className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_160px] sm:items-center">
                                        <div>
                                            <div className="font-medium">{parameter.parameter_name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {parameter.unit ? `Unit: ${parameter.unit}` : 'No unit'} 
                                            </div>
                                        </div>
                                        <Input
                                            value={parameterValues[String(parameter.id)] || ''}
                                            onChange={(e) =>
                                                setParameterValues((prev) => ({
                                                    ...prev,
                                                    [String(parameter.id)]: e.target.value,
                                                }))
                                            }
                                            placeholder="Result value"
                                        />
                                    </div>
                                ))}
                                {resultParameters.length === 0 && (
                                    <div className="text-sm text-muted-foreground">No parameters configured for this test.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {resultFormat === 'custom_fields' && (
                        <div className="space-y-2">
                            <Label>Result Fields</Label>
                            <div className="space-y-2">
                                {resultFields.map((field: any) => (
                                    <div key={field.name} className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_160px] sm:items-center">
                                        <div>
                                            <div className="font-medium">{field.label || field.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {field.unit ? `Unit: ${field.unit}` : 'No unit'}
                                            </div>
                                        </div>
                                        <Input
                                            type={field.type === 'number' ? 'number' : 'text'}
                                            value={fieldValues[field.name] || ''}
                                            onChange={(e) =>
                                                setFieldValues((prev) => ({
                                                    ...prev,
                                                    [field.name]: e.target.value,
                                                }))
                                            }
                                            placeholder="Result value"
                                        />
                                    </div>
                                ))}
                                {resultFields.length === 0 && (
                                    <div className="text-sm text-muted-foreground">No custom result fields configured.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {resultFormat === 'machine_based' && (
                        <div className="space-y-2">
                            <Label>Machine Result</Label>
                            <Textarea
                                value={machineValue}
                                onChange={(e) => setMachineValue(e.target.value)}
                                placeholder="Paste machine output or enter result details"
                                rows={5}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving} className="flex-1">
                            {saving ? 'Saving...' : 'Save Result'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
