/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head } from '@inertiajs/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { VendorSidebar } from '@/components/VendorSidebar';
import tenant from '@/routes/tenant';
import type { AdminVisitorStatsProps } from '@/types/Admin/Statistics/Visitors';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

export default function AdminVisitorStats({
    total_visits_central,
    unique_visitors_central,
    total_visits_tenants,
    unique_visitors_tenants,
    top_tenants,
    daily_central,
    tenant,
}: AdminVisitorStatsProps) {
    return (
        <SidebarProvider
            className="dark:bg-slate-900"
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <div className="p-6">
                    <h1 className="mb-6 text-2xl font-bold">
                        Statistiques globales des visiteurs
                    </h1>

                    {/* KPI Cards */}
                    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Visites centrales
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {total_visits_central?.toLocaleString() ??
                                        0}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Visiteurs uniques (central)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {unique_visitors_central?.toLocaleString() ??
                                        0}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Visites tenants
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {total_visits_tenants?.toLocaleString() ??
                                        0}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Visiteurs uniques (tenants)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {unique_visitors_tenants?.toLocaleString() ??
                                        0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Graphique évolution centrale */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                Évolution des visites (site central - 30
                                derniers jours)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={daily_central}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="visits"
                                        stroke="#8884d8"
                                        name="Visites"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="uniques"
                                        stroke="#82ca9d"
                                        name="Visiteurs uniques"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Top tenants */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Top 10 des tenants les plus visités
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tenant</TableHead>
                                        <TableHead>Visites</TableHead>
                                        <TableHead>Visiteurs uniques</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {top_tenants?.map((tenant, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                {tenant.raison_sociale}
                                            </TableCell>
                                            <TableCell>
                                                {tenant.visits}
                                            </TableCell>
                                            <TableCell>
                                                {tenant.uniques}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
