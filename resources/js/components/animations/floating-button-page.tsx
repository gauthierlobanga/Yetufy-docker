import { PlusIcon } from 'lucide-react';

import { FaDribbble, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FloatingButton, FloatingButtonItem } from './floating-button';

export default function FloatingButtonComposant() {
    const items = [
        {
            id: 'facebook',
            icon: <FaFacebook />,
            bgColor: 'bg-[#1877f2]',
        },
        {
            id: 'dribbble',
            icon: <FaDribbble />,
            bgColor: 'bg-[#ea4c89]',
        },
        {
            id: 'linkedin',
            icon: <FaLinkedin />,
            bgColor: 'bg-[#0a66c2]',
        },
    ];

    return (
        <FloatingButton
            triggerContent={
                <Button size="icon" className="size-12 rounded-full">
                    <PlusIcon className="size-5" />
                </Button>
            }
        >
            {items.map((item) => (
                <FloatingButtonItem key={item.id}>
                    <Button
                        size="icon"
                        className={cn('size-12 rounded-full', item.bgColor)}
                    >
                        {item.icon}
                    </Button>
                </FloatingButtonItem>
            ))}
        </FloatingButton>
    );
}
