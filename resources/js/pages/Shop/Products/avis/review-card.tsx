// resources/js/components/ecommerce/products/avis/review-card.tsx
import { Star, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ReviewCardProps {
    customerName: string;
    customerAvatar?: string;
    rating: number;
    reviewDate: string;
    reviewText: string;
}

export function ReviewCard({
    customerName,
    customerAvatar,
    rating,
    reviewDate,
    reviewText,
}: ReviewCardProps) {
    const [helpfulCount, setHelpfulCount] = useState(0);
    const [unhelpfulCount, setUnhelpfulCount] = useState(0);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

    const handleHelpful = () => {
        if (userVote !== 'up') {
            setHelpfulCount((c) => c + 1);

            if (userVote === 'down') {
                setUnhelpfulCount((c) => c - 1);
            }

            setUserVote('up');
        }
    };

    const handleUnhelpful = () => {
        if (userVote !== 'down') {
            setUnhelpfulCount((c) => c + 1);

            if (userVote === 'up') {
                setHelpfulCount((c) => c - 1);
            }

            setUserVote('down');
        }
    };

    return (
        <div className="flex gap-4 py-5 first:pt-0">
            <Avatar className="h-11 w-11 rounded-full ring-2 ring-white dark:ring-slate-800">
                {customerAvatar ? (
                    <AvatarImage
                        src={customerAvatar}
                        alt={customerName}
                        className="object-cover"
                    />
                ) : (
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        <User className="h-5 w-5" />
                    </AvatarFallback>
                )}
            </Avatar>

            <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-4">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                            {customerName}
                        </h4>
                        <div className="mt-0.5 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                        i < Math.floor(rating)
                                            ? 'fill-amber-400 text-amber-400'
                                            : i < rating
                                              ? 'fill-amber-400/50 text-amber-400'
                                              : 'text-slate-300 dark:text-slate-600'
                                    }`}
                                />
                            ))}
                            <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    <span className="text-xs whitespace-nowrap text-slate-400 dark:text-slate-500">
                        {reviewDate}
                    </span>
                </div>

                <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {reviewText}
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 gap-1.5 rounded-full px-3 text-xs ${
                            userVote === 'up'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'text-slate-500 hover:text-emerald-600'
                        }`}
                        onClick={handleHelpful}
                    >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {helpfulCount > 0 && (
                            <span className="tabular-nums">{helpfulCount}</span>
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 gap-1.5 rounded-full px-3 text-xs ${
                            userVote === 'down'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                : 'text-slate-500 hover:text-rose-600'
                        }`}
                        onClick={handleUnhelpful}
                    >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        {unhelpfulCount > 0 && (
                            <span className="tabular-nums">
                                {unhelpfulCount}
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
