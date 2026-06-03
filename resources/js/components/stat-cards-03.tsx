import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function CardStat() {
    return (
        <div className="mx-auto p-4 md:w-100 lg:py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Website Analytics</CardTitle>
                    <CardDescription>
                        Total <span className="text-green-600">28.5%</span>{' '}
                        conversion rate
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-12 rounded-md bg-muted px-2 py-1 text-center text-xs">
                                432
                            </div>
                            <span className="text-sm">Direct</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-12 rounded-md bg-muted px-2 py-1 text-center text-xs">
                                216
                            </div>
                            <span className="text-sm">Organic</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-12 rounded-md bg-muted px-2 py-1 text-center text-xs">
                                29%
                            </div>
                            <span className="text-sm">Sessions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-12 rounded-md bg-muted px-2 py-1 text-center text-xs">
                                2.3K
                            </div>
                            <span className="text-sm">Page Views</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-12 rounded-md bg-muted px-2 py-1 text-center text-xs">
                                1.6K
                            </div>
                            <span className="text-sm">Leads</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-12 rounded-md bg-muted px-2 py-1 text-center text-xs">
                                8%
                            </div>
                            <span className="text-sm">Conversions</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
