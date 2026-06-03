// resources/js/components/ui/AnimatedCtaButton.tsx
import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface Props {
    href: string;
    children: React.ReactNode;
}

export default function AnimatedCtaButton({ href, children }: Props) {
    const btnRef = useRef<HTMLAnchorElement>(null);
    const arrowRef = useRef<SVGSVGElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const btn = btnRef.current;
        const arrow = arrowRef.current;

        if (!btn || !arrow) {
            return;
        }

        tl.current = gsap
            .timeline({ paused: true })
            .to(btn, { scale: 1.02, duration: 0.3, ease: 'power3.out' })
            .to(arrow, { x: 5, duration: 0.3, ease: 'power3.out' }, 0)
            .to(btn, { boxShadow: '0 8px 24px -4px rgba(16,185,129,0.35)' }, 0);

        const enter = () => tl.current?.play();
        const leave = () => tl.current?.reverse();

        btn.addEventListener('mouseenter', enter);
        btn.addEventListener('mouseleave', leave);

        return () => {
            btn.removeEventListener('mouseenter', enter);
            btn.removeEventListener('mouseleave', leave);
            tl.current?.kill();
        };
    }, []);

    return (
        <Link
            ref={btnRef}
            href={href}
            className="inline-flex items-center gap-3 rounded-full bg-emerald-600 px-5 py-2 text-base font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
            {children}
            <ArrowRight ref={arrowRef} className="h-5 w-5" />
        </Link>
    );
}
