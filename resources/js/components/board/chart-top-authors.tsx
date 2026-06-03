// resources/js/components/chart-top-authors.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface TopAuthor {
    id: number;
    name: string;
    avatar_url: string | null;
    posts_count: number;
    total_views: number;
}

export function ChartTopAuthors({ authors }: { authors: TopAuthor[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Contributeurs</CardTitle>
                <CardDescription>Les auteurs les plus actifs</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {authors.map((author, index) => (
                        <div
                            key={author.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-6 text-center font-bold text-muted-foreground">
                                    #{index + 1}
                                </div>
                                <Avatar className="h-10 w-10 rounded-md">
                                    <AvatarImage
                                        src={author.avatar_url || undefined}
                                    />
                                    <AvatarFallback>
                                        {author.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{author.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {author.posts_count} article
                                        {author.posts_count > 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-sm">
                                {author.total_views.toLocaleString()} vues
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
