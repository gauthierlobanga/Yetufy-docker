// components/ui/TruncatedText.tsx
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface TruncatedTextProps {
    text?: string | null;
    maxLength?: number;
    showTooltip?: boolean;
    expandable?: boolean;
    className?: string;
}

export function TruncatedText({
    text = '',
    maxLength = 100,
    showTooltip = true,
    expandable = false,
    className = '',
}: TruncatedTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showFullText, setShowFullText] = useState(false);

    if (!text) return null;

    const shouldTruncate = text.length > maxLength;
    const displayText = isExpanded ? text : truncate(text, maxLength);

    // Version avec tooltip
    if (showTooltip && shouldTruncate && !expandable) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className={`cursor-help ${className}`}>
                            {truncate(text, maxLength)}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-md whitespace-normal">{text}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // Version avec bouton "Voir plus"
    if (expandable) {
        return (
            <div className={className}>
                <span>{displayText}</span>
                {shouldTruncate && (
                    <Button
                        variant="link"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-1 h-auto p-0 text-sm"
                    >
                        {isExpanded ? (
                            <>
                                Voir moins
                                <ChevronUp className="ml-1 h-3 w-3" />
                            </>
                        ) : (
                            <>
                                Voir plus
                                <ChevronDown className="ml-1 h-3 w-3" />
                            </>
                        )}
                    </Button>
                )}
            </div>
        );
    }

    // Version simple
    return <span className={className}>{truncate(text, maxLength)}</span>;
}

// Fonction utilitaire
function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
}
