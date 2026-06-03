import { Card, CardContent } from '@/components/ui/card';

interface PaymentMethodCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const PaymentMethodCard = ({
    icon,
    title,
    description,
}: PaymentMethodCardProps) => {
    return (
        <Card className="shadow-none">
            <CardContent className="flex gap-4">
                <div className="shrink-0">{icon}</div>
                <div className="flex-1">
                    <h3 className="mb-1 font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentMethodCard;
