import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function NewsletterSection() {
    return (
        <section className="w-full bg-linear-to-r from-muted to-muted/50 py-12 lg:py-20">
            <div className="container mx-auto flex flex-col items-center justify-center space-y-6 px-4 text-center md:px-6">
                <header className="mx-auto max-w-2xl space-y-2">
                    <h2 className="font-heading text-3xl sm:text-4xl md:text-4xl">
                        Join Our Community
                    </h2>
                    <p className="text-balance text-muted-foreground md:text-lg">
                        Subscribe to our newsletter to get the latest updates,
                        exclusive content, and special offers directly in your
                        inbox.
                    </p>
                </header>
                <div className="w-full max-w-md">
                    <Card className="border-0 shadow-none">
                        <CardContent className="grid gap-4">
                            <form className="space-y-2">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                />
                                <Button className="w-full">Subscribe</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
