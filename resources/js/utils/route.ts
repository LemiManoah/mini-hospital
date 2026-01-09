// resources/js/utils/route.ts
import { route as ziggyRoute } from 'ziggy-js';

// Define a type for route parameters
type RouteParams = Record<string, string | number | boolean | null | undefined>;

// Extend the Window interface to include the Ziggy object
declare global {
    interface Window {
        Ziggy: any;
    }
}

// Export the typed route function
export function route(name: string, params?: RouteParams | number, absolute?: boolean, config?: any): string {
    // Handle the case where params is a number (for routes like 'patients.show', 1)
    if (typeof params === 'number') {
        return ziggyRoute(name, { id: params }, absolute, config);
    }
    return ziggyRoute(name, params, absolute, config);
}