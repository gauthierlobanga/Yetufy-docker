import { MapPin, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DeliveryCardProps {
    address: {
        name: string;
        street: string;
        apt: string;
        city: string;
        country: string;
    };
    delivery: {
        type: string;
        date: string;
        time: string;
    };
}

const DeliveryCard = ({ address, delivery }: DeliveryCardProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-none">
                <CardContent className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <MapPin className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-3 font-semibold text-foreground">
                            {address.name}
                        </h3>
                        <div className="space-y-1 text-sm text-foreground">
                            <p>{address.street}</p>
                            <p>{address.apt}</p>
                            <p>{address.city}</p>
                            <p>{address.country}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-none">
                <CardContent className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Truck className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-3 font-semibold text-foreground">
                            {delivery.type}
                        </h3>
                        <div className="space-y-1 text-sm text-foreground">
                            <p>{delivery.date}</p>
                            <p>{delivery.time}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeliveryCard;
