'use client';

import { MessageSquare } from 'lucide-react';
import { NativeNotificationBell } from './NativeNotificationBellProps';

export function NativeNotificationBellDefault() {
    return (
        <div className="flex items-center justify-center p-4">
            <NativeNotificationBell count={3} />
        </div>
    );
}

export function NativeNotificationBellEmpty() {
    return (
        <div className="flex items-center justify-center p-4">
            <NativeNotificationBell count={0} />
        </div>
    );
}

export function NativeNotificationBellCustomIcon() {
    return (
        <div className="flex items-center justify-center p-4">
            <NativeNotificationBell
                count={5}
                icon={<MessageSquare className="h-5 w-5" />}
            />
        </div>
    );
}

export function NativeNotificationBellDemo() {
    return (
        <div className="flex w-full flex-col gap-8">
            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2 text-center">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                        With Count
                    </h3>
                    <NativeNotificationBellDefault />
                </div>
                <div className="space-y-2 text-center">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                        Empty
                    </h3>
                    <NativeNotificationBellEmpty />
                </div>
                <div className="space-y-2 text-center">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                        Custom Icon
                    </h3>
                    <NativeNotificationBellCustomIcon />
                </div>
            </div>
        </div>
    );
}
