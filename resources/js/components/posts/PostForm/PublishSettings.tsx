// resources/js/Components/Posts/PostForm/PublishSettings.tsx

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Clock, Pin } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Switch } from '@/components/ui/switch';

import { cn } from '@/lib/utils';
import type { PostFormData } from '@/types/posts/post-form';

interface PublishSettingsProps {
    data: PostFormData;
    setData: (key: keyof PostFormData, value: any) => void;
    statuses: Record<string, string>;
    errors: Record<string, string>;
}

export function PublishSettings({
    data,
    setData,
    statuses,
    errors,
}: PublishSettingsProps) {
    const [date, setDate] = React.useState<Date | undefined>(
        data.published_at ? new Date(data.published_at) : undefined,
    );

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);

        if (newDate) {
            const currentTime = data.published_at
                ? new Date(data.published_at)
                : new Date();

            newDate.setHours(currentTime.getHours());
            newDate.setMinutes(currentTime.getMinutes());

            setData('published_at', newDate.toISOString());
        } else {
            setData('published_at', null);
        }
    };

    const handleTimeChange = (time: string) => {
        if (date) {
            const [hours, minutes] = time.split(':');
            const newDate = new Date(date);
            newDate.setHours(parseInt(hours), parseInt(minutes));
            setDate(newDate);
            setData('published_at', newDate.toISOString());
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Paramètres de publication</CardTitle>
                <CardDescription>
                    Gérez le statut et la visibilité de l'article
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Statut */}
                <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select
                        value={data.status}
                        onValueChange={(value: any) => setData('status', value)}
                    >
                        <SelectTrigger id="status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(statuses).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.status && (
                        <p className="text-sm text-red-500">{errors.status}</p>
                    )}
                </div>

                {/* Épinglé */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="pinned">Épingler l'article</Label>
                        <p className="text-sm text-muted-foreground">
                            L'article sera affiché en haut des listes
                        </p>
                    </div>
                    <Switch
                        id="pinned"
                        checked={data.is_pinned}
                        onCheckedChange={(checked) =>
                            setData('is_pinned', checked)
                        }
                    />
                </div>

                {/* Date de publication */}
                <div className="space-y-2">
                    <Label>Date de publication</Label>
                    <div className="flex gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !date && 'text-muted-foreground',
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? (
                                        format(date, 'dd MMMM yyyy', {
                                            locale: fr,
                                        })
                                    ) : (
                                        <span>Choisir une date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateChange}
                                    initialFocus
                                    locale={fr}
                                />
                            </PopoverContent>
                        </Popover>

                        {date && (
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <input
                                    type="time"
                                    value={format(date, 'HH:mm')}
                                    onChange={(e) =>
                                        handleTimeChange(e.target.value)
                                    }
                                    className="rounded border px-2 py-1 text-sm"
                                />
                            </div>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setDate(undefined);
                            setData('published_at', null);
                        }}
                        className="text-xs"
                    >
                        Réinitialiser
                    </Button>
                </div>

                {/* Résumé des paramètres */}
                <div className="mt-6 space-y-2 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium">Résumé :</p>
                    <p className="text-sm">
                        Statut :{' '}
                        <span className="font-medium">
                            {statuses[data.status]}
                        </span>
                    </p>
                    {data.is_pinned && (
                        <p className="flex items-center gap-1 text-sm">
                            <Pin className="h-3 w-3" /> Épinglé
                        </p>
                    )}
                    {date && (
                        <p className="text-sm">
                            Publié le :{' '}
                            {format(date, "dd MMMM yyyy 'à' HH:mm", {
                                locale: fr,
                            })}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
