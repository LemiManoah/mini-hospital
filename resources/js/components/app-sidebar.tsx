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
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, DollarSign, Folder, LayoutGrid, LocateIcon, User2Icon, Shield, MedalIcon, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Addresses',
        href: '/addresses',
        icon: LocateIcon,
    },
    {
        title: 'Patient Categories',
        href: '/patient-categories',
        icon: DollarSign,
    },
    {
        title: 'Patients',
        href: '/patients',
        icon: User2Icon,
    },
    {
        title: 'Appointments',
        href: '/appointments',
        icon: Folder,
    },
    {
        title: 'Calendar',
        href: '/calendar',
        icon: BookOpen,
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: Shield,
    },
    {
        title: 'Clinics',
        href: '/clinics',
        icon: MedalIcon,
    },
    {
        title: 'Staff',
        href: '/staff-profile',
        icon: User2Icon,
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    }
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
