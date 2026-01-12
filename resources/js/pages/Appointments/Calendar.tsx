import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';


export default function AppointmentCalendar({ events }: { events: any[] }) {
    return (
        <AppLayout>
            <Head title="Appointment Calendar" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Appointment Calendar</h1>

                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    events={events}
                    height="auto"
                />
            </div>
        </AppLayout>
    );
}
