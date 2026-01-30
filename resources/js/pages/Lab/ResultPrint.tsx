import { Head } from '@inertiajs/react';

interface ResultPrintProps {
    patient: any;
    visit: any;
    items: any[];
}

export default function ResultPrint({ patient, visit, items }: ResultPrintProps) {
    const getPatientName = (patientInfo: any) => {
        return patientInfo?.name || `${patientInfo?.first_name || ''} ${patientInfo?.last_name || ''}`.trim();
    };

    const resolveService = (item: any) =>
        item.labService || item.lab_service || item.service || item.item || null;

    const getResultDetails = (item: any) => {
        if (!item?.result?.result_payload) return 'Pending';
        const payload = typeof item.result.result_payload === 'string'
            ? (() => {
                try {
                    return JSON.parse(item.result.result_payload);
                } catch {
                    return null;
                }
            })()
            : item.result.result_payload;

        if (!payload) return 'Pending';

        const format = payload.result_format;
        const values = payload.payload || {};

        if (format === 'simple_options') {
            return values.option_name || 'Option selected';
        }
        if (format === 'parameter_based' || format === 'complex_hormone') {
            const parameters = Array.isArray(values.parameters) ? values.parameters : [];
            return parameters.map((entry: any) => {
                const unit = entry.unit ? ` ${entry.unit}` : '';
                return `${entry.parameter_name}: ${entry.value ?? '—'}${unit}`;
            }).join('; ');
        }
        if (format === 'custom_fields') {
            const fields = values.fields || {};
            return Object.keys(fields).map((key) => `${key}: ${fields[key] ?? '—'}`).join('; ');
        }
        return values.value || 'Result recorded';
    };

    return (
        <div className="min-h-screen bg-white p-6 text-gray-900">
            <Head title="Lab Result Report" />

            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Lab Result Report</h1>
                        <p className="text-sm text-gray-500">Visit {visit?.visit_number || '—'}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="print:hidden rounded border px-3 py-2 text-sm font-medium"
                    >
                        Print
                    </button>
                </div>

                <div className="grid gap-4 rounded border p-4 text-sm sm:grid-cols-2">
                    <div>
                        <div className="text-xs text-gray-500">Patient Name</div>
                        <div className="font-medium">{getPatientName(patient)}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Patient ID</div>
                        <div className="font-medium">{patient?.id || '—'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Age / Gender</div>
                        <div className="font-medium">
                            {patient?.age ? `${patient.age} Year(s)` : '—'} • {patient?.gender || '—'}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Visit Date</div>
                        <div className="font-medium">
                            {visit?.visit_date ? new Date(visit.visit_date).toLocaleDateString() : '—'} {visit?.visit_time || ''}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded border">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-3 py-2">S/N</th>
                                <th className="px-3 py-2">Service</th>
                                <th className="px-3 py-2">Sample</th>
                                <th className="px-3 py-2">Result</th>
                                <th className="px-3 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const service = resolveService(item);
                                const status = item?.result?.verified_at ? 'Verified' : item?.result ? 'Entered' : 'Pending';
                                return (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-3 py-2">{index + 1}</td>
                                        <td className="px-3 py-2">
                                            <div className="font-medium">{service?.name || `Lab Service ${item.item_id}`}</div>
                                            <div className="text-xs text-gray-500">{service?.code || '—'}</div>
                                        </td>
                                        <td className="px-3 py-2">
                                            {item.labSample?.sample_number || '—'}
                                        </td>
                                        <td className="px-3 py-2">{getResultDetails(item)}</td>
                                        <td className="px-3 py-2">{status}</td>
                                    </tr>
                                );
                            })}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                                        No lab results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
