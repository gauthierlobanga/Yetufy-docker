import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { CartItem } from './type';

export function CartListItem({ item }: { item: CartItem }) {
    return (
        <div key={item.id} className="flex items-start space-x-4">
            <div className="relative shrink-0">
                <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-square rounded-md object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            <div className="flex-1">
                <div className="flex justify-between">
                    <div className="space-y-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <span className="text-xs">
                            {item.variant} | {item.size}
                        </span>
                        <p className="text-sm">{item.price}</p>
                    </div>

                    <div className="flex flex-col space-x-4 sm:flex-row">
                        <Select defaultValue={String(item.quantity)}>
                            <SelectTrigger>
                                <SelectValue placeholder="1" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="ghost" size="icon">
                            <XIcon size={18} />
                            <span className="sr-only">Remove item</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
