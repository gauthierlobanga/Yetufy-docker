import { Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostBulkActionsProps {
    selectedCount: number;
    statuses: Record<string, string>;
    processing: boolean;
    onBulkStatus: (status: string) => void;
    onBulkDelete: () => void;
}

export function PostBulkActions({
    selectedCount,
    statuses,
    processing,
    onBulkStatus,
    onBulkDelete,
}: PostBulkActionsProps) {
    if (selectedCount === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={processing}>
                        Actions ({selectedCount})
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions en masse</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(statuses).map(([key, label]) => (
                        <DropdownMenuItem
                            key={key}
                            onClick={() => onBulkStatus(key)}
                        >
                            Marquer comme {label.toLowerCase()}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={onBulkDelete}
                        className="text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
