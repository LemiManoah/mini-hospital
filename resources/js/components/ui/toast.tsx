import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Check, X, AlertCircle } from 'lucide-react';

interface FlashMessage {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export default function Toast() {
    const { props } = usePage<{ flash: FlashMessage }>();
    const flash = props.flash;

    useEffect(() => {
        if (flash?.success || flash?.error || flash?.warning || flash?.info) {
            const timer = setTimeout(() => {
                // Auto-hide after 5 seconds
                const toastElement = document.getElementById('toast-container');
                if (toastElement) {
                    toastElement.style.display = 'none';
                }
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!flash?.success && !flash?.error && !flash?.warning && !flash?.info) {
        return null;
    }

    const getToastConfig = () => {
        if (flash.success) {
            return {
                type: 'success',
                icon: <Check className="w-5 h-5" />,
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                textColor: 'text-green-800',
                iconColor: 'text-green-500',
                message: flash.success
            };
        }
        if (flash.error) {
            return {
                type: 'error',
                icon: <X className="w-5 h-5" />,
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                textColor: 'text-red-800',
                iconColor: 'text-red-500',
                message: flash.error
            };
        }
        if (flash.warning) {
            return {
                type: 'warning',
                icon: <AlertCircle className="w-5 h-5" />,
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                textColor: 'text-yellow-800',
                iconColor: 'text-yellow-500',
                message: flash.warning
            };
        }
        if (flash.info) {
            return {
                type: 'info',
                icon: <AlertCircle className="w-5 h-5" />,
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                textColor: 'text-blue-800',
                iconColor: 'text-blue-500',
                message: flash.info
            };
        }
    };

    const config = getToastConfig();

    if (!config) return null;

    return (
        <div id="toast-container" className="fixed top-4 right-4 z-50 animate-pulse">
            <div className={`flex items-center p-4 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg min-w-[300px] max-w-md`}>
                <div className={`flex-shrink-0 ${config.iconColor}`}>
                    {config.icon}
                </div>
                <div className={`ml-3 flex-1 text-sm font-medium ${config.textColor}`}>
                    {config.message}
                </div>
                <button
                    onClick={() => {
                        const toastElement = document.getElementById('toast-container');
                        if (toastElement) {
                            toastElement.style.display = 'none';
                        }
                    }}
                    className={`ml-4 flex-shrink-0 ${config.textColor} hover:opacity-75`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
