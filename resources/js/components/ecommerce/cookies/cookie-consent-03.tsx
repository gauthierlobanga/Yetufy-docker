import { Button } from '@/components/ui/button';

export default function CookieConsent() {
    return (
        <>
            <div className="fixed bottom-5 left-5 mx-auto max-w-md rounded-2xl border bg-background p-4">
                <h4 className="font-semibold">🍪 Cookie Notice</h4>

                <p className="mt-4 text-sm text-muted-foreground">
                    We use cookies to ensure that we give you the best
                    experience on our website.{' '}
                    <a href="#" className="text-blue-500 hover:underline">
                        Read cookies policies
                    </a>
                    .
                </p>

                <div className="mt-4 flex shrink-0 items-center justify-between gap-x-4">
                    <Button
                        variant="link"
                        size="sm"
                        className="px-0 text-xs underline"
                    >
                        Manage your preferences
                    </Button>
                    <Button size="sm">Accept</Button>
                </div>
            </div>

            {/* fake content */}
            <div className="h-60 bg-muted/50"></div>
        </>
    );
}
