// resources/js/Pages/Vendor/Statistics/Partials/RecentOrdersTable.tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function RecentOrdersTable({ orders }: { orders: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dernières commandes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>N°</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                    {order.numero_commande}
                                </TableCell>
                                <TableCell>{order.client}</TableCell>
                                <TableCell>{order.total} CDF</TableCell>
                                <TableCell>
                                    <Badge>{order.statut}</Badge>
                                </TableCell>
                                <TableCell>{order.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
