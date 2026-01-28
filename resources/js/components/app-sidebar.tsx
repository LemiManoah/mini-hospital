import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type MainNavItems, NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, DollarSign, Folder, LayoutGrid, LocateIcon, User2Icon, Shield, MedalIcon, Users, Settings, AlertTriangle, Calendar, BriefcaseMedicalIcon } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: MainNavItems[] = [
    {
        title: 'Dashboard',
        icon: LayoutGrid,
        subItems: [
            {
                title: 'Overview',
                href: dashboard().url,
                icon: LayoutGrid,
            },
        ],

    },
    {
        title: 'OutPatient',
        icon: Folder,
        subItems: [
            {
                title: 'New Patient',
                href: '/patients/create',
                icon: User2Icon,
            },
            {
                title: 'All Patients',
                href: '/patients',
                icon: User2Icon,
            },
            {
                title: 'Active visits',
                href: '/visits',
                icon: Folder,
            },
        ],
    },
    {
        title: 'Appointments',
        icon: Folder,
        subItems: [
            {
                title: 'New Appointment',
                href: '/appointments/create',
                icon: Folder,
            },
            {
                title: 'All Appointments',
                href: '/appointments',
                icon: Folder,
            },
            {
                title: 'Calendar',
                href: '/calendar',
                icon: Calendar,
            },
            {
                title: 'Doctor Working Hours',
                href: '/doctor-working-hours',
                icon: BriefcaseMedicalIcon,
            }
        ],
    },
    {
        title: 'Manage Settings',
        icon: Settings,
        subItems: [
            {
                title: 'General',
                href: '/settings',
                icon: Settings,
            },
            {
                title: 'Services',
                href: '/services',
                icon: BookOpen,
            },
            {
                title: 'Clinics',
                href: '/clinics',
                icon: MedalIcon,
            },
            {
                title: 'Billing Types',
                href: '/patient-categories',
                icon: DollarSign,
            },
            {
                title: 'Addresses',
                href: '/addresses',
                icon: LocateIcon,
            },
            {
                title: 'Allergies',
                href: '/allergies',
                icon: AlertTriangle,
            }
        ],
    },
    {
        title: 'User Management',
        icon: Users,
        subItems: [
            {
                title: 'Users',
                href: '/users',
                icon: Users,
            },
            {
                title: 'Roles',
                href: '/roles',
                icon: Shield,
            },
            {
                title: 'Profiles',
                href: '/profiles',
                icon: User2Icon,
            },
        ],
    },

];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
