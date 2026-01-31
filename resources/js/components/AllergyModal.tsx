import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, AlertTriangle } from 'lucide-react';

interface Allergy {
    id: number;
    name: string;
    description?: string;
    severity: 'mild' | 'moderate' | 'severe' | string;
    reaction_type?: string;
    pivot?: {
        notes?: string;
        diagnosed_date?: string;
        severity?: 'mild' | 'moderate' | 'severe' | string;
        is_active?: boolean;
    };
}

interface AllergyModalProps {
    patientId: number;
    patientAllergies: Allergy[];
    availableAllergies: Allergy[];
    trigger?: React.ReactNode;
}

export default function AllergyModal({ 
    patientId, 
    patientAllergies, 
    availableAllergies,
    trigger 
}: AllergyModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedAllergy, setSelectedAllergy] = useState('');
    const [notes, setNotes] = useState('');
    const [diagnosedDate, setDiagnosedDate] = useState('');
    const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');

    const handleAddAllergy = () => {
        if (!selectedAllergy) return;

        router.post(
            `/patients/${patientId}/allergies`,
            {
                allergy_id: selectedAllergy,
                notes,
                diagnosed_date: diagnosedDate,
                severity,
            },
            {
                onSuccess: () => {
                    setIsAdding(false);
                    setSelectedAllergy('');
                    setNotes('');
                    setDiagnosedDate('');
                    setSeverity('moderate');
                },
            }
        );
    };

    const handleRemoveAllergy = (allergyId: number) => {
        if (confirm('Are you sure you want to remove this allergy?')) {
            router.delete(`/patients/${patientId}/allergies/${allergyId}`);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'severe':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'moderate':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'mild':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSeverityIcon = (severity: string) => {
        return severity === 'severe' ? <AlertTriangle className="h-3 w-3" /> : null;
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        Manage Allergies
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Manage Patient Allergies</DialogTitle>
                    <DialogDescription>
                        Add or remove allergies for this patient. Severe allergies require immediate attention.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Current Allergies */}
                    <div>
                        <h4 className="text-sm font-medium mb-3">Current Allergies</h4>
                        {patientAllergies.length > 0 ? (
                            <div className="space-y-2">
                                {patientAllergies.map((allergy) => (
                                    <div
                                        key={allergy.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">{allergy.name}</span>
                                                <Badge
                                                    className={`text-xs ${getSeverityColor(
                                                        allergy.pivot?.severity || allergy.severity
                                                    )}`}
                                                >
                                                    {getSeverityIcon(allergy.pivot?.severity || allergy.severity)}
                                                    {allergy.pivot?.severity || allergy.severity}
                                                </Badge>
                                            </div>
                                            {allergy.reaction_type && (
                                                <p className="text-sm text-gray-600">
                                                    Reaction: {allergy.reaction_type}
                                                </p>
                                            )}
                                            {allergy.pivot?.notes && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Notes: {allergy.pivot.notes}
                                                </p>
                                            )}
                                            {allergy.pivot?.diagnosed_date && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Diagnosed: {new Date(allergy.pivot.diagnosed_date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveAllergy(allergy.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No allergies recorded</p>
                        )}
                    </div>

                    {/* Add New Allergy */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium">Add New Allergy</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAdding(!isAdding)}
                            >
                                {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                {isAdding ? 'Cancel' : 'Add Allergy'}
                            </Button>
                        </div>

                        {isAdding && (
                            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="allergy">Allergy *</Label>
                                        <Select
                                            value={selectedAllergy}
                                            onValueChange={setSelectedAllergy}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select allergy" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableAllergies
                                                    .filter(
                                                        (allergy) =>
                                                            !patientAllergies.some(
                                                                (pa) => pa.id === allergy.id
                                                            )
                                                    )
                                                    .map((allergy) => (
                                                        <SelectItem key={allergy.id} value={allergy.id.toString()}>
                                                            {allergy.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="severity">Severity *</Label>
                                        <Select
                                            value={severity}
                                            onValueChange={(value: 'mild' | 'moderate' | 'severe') =>
                                                setSeverity(value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mild">Mild</SelectItem>
                                                <SelectItem value="moderate">Moderate</SelectItem>
                                                <SelectItem value="severe">Severe</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="diagnosed_date">Diagnosed Date</Label>
                                        <Input
                                            id="diagnosed_date"
                                            type="date"
                                            value={diagnosedDate}
                                            onChange={(e) => setDiagnosedDate(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Patient-specific notes about this allergy..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleAddAllergy}
                                        disabled={!selectedAllergy}
                                    >
                                        Add Allergy
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
