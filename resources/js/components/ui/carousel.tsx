import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper/types';
import 'swiper/css';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CarouselApi = SwiperInstance | null;
type CarouselOptions = {
    align?: 'start' | 'center' | 'end';
    loop?: boolean;
    axis?: 'x' | 'y';
    dragFree?: boolean;
    [key: string]: unknown;
};
type CarouselPlugin = unknown[];

type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: 'horizontal' | 'vertical';
    setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
    api: CarouselApi;
    opts?: CarouselOptions;
    orientation: 'horizontal' | 'vertical';
    plugins?: CarouselPlugin;
    registerApi: (api: SwiperInstance) => void;
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);

    if (!context) {
        throw new Error('useCarousel must be used within a <Carousel />');
    }

    return context;
}

function Carousel({
    orientation = 'horizontal',
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
}: React.ComponentProps<'div'> & CarouselProps) {
    const [api, setInternalApi] = React.useState<SwiperInstance | null>(null);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const updateScrollState = React.useCallback((swiper: SwiperInstance) => {
        if (swiper.params.loop) {
            const hasManySlides = swiper.slides.length > 1;
            setCanScrollPrev(hasManySlides);
            setCanScrollNext(hasManySlides);

            return;
        }

        setCanScrollPrev(!swiper.isBeginning);
        setCanScrollNext(!swiper.isEnd);
    }, []);

    const registerApi = React.useCallback(
        (swiper: SwiperInstance) => {
            setInternalApi(swiper);
            setApi?.(swiper);
            updateScrollState(swiper);
        },
        [setApi, updateScrollState],
    );

    const scrollPrev = React.useCallback(() => {
        api?.slidePrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
        api?.slideNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                scrollPrev();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                scrollNext();
            }
        },
        [scrollPrev, scrollNext],
    );

    return (
        <CarouselContext.Provider
            value={{
                api,
                opts,
                orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
                plugins,
                registerApi,
                scrollPrev,
                scrollNext,
                canScrollPrev,
                canScrollNext,
            }}
        >
            <div
                onKeyDownCapture={handleKeyDown}
                className={cn('relative', className)}
                role="region"
                aria-roledescription="carousel"
                data-slot="carousel"
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
}

function CarouselContent({
    className,
    children,
}: React.ComponentProps<'div'>) {
    const { orientation, opts, plugins, registerApi } = useCarousel();

    return (
        <Swiper
            onSwiper={registerApi}
            onSlideChange={registerApi}
            onResize={registerApi}
            modules={(plugins ?? []) as never[]}
            slidesPerView="auto"
            direction={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
            loop={opts?.loop ?? false}
            centeredSlides={opts?.align === 'center'}
            className={cn(
                'overflow-hidden',
                orientation === 'horizontal' ? '-ml-4' : '-mt-4',
                className,
            )}
        >
            {children}
        </Swiper>
    );
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
    const { orientation } = useCarousel();

    return (
        <SwiperSlide
            role="group"
            aria-roledescription="slide"
            data-slot="carousel-item"
            className={cn(
                '!h-auto min-w-0 shrink-0 grow-0 basis-full',
                orientation === 'horizontal' ? 'pl-4' : 'pt-4',
                className,
            )}
            {...props}
        />
    );
}

function CarouselPrevious({
    className,
    variant = 'outline',
    size = 'icon-sm',
    ...props
}: React.ComponentProps<typeof Button>) {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
        <Button
            data-slot="carousel-previous"
            variant={variant}
            size={size}
            className={cn(
                'absolute z-10 touch-manipulation rounded-full',
                orientation === 'horizontal'
                    ? 'top-1/2 -left-12 -translate-y-1/2'
                    : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
                className,
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ChevronLeftIcon />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
}

function CarouselNext({
    className,
    variant = 'outline',
    size = 'icon-sm',
    ...props
}: React.ComponentProps<typeof Button>) {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
        <Button
            data-slot="carousel-next"
            variant={variant}
            size={size}
            className={cn(
                'absolute z-10 touch-manipulation rounded-full',
                orientation === 'horizontal'
                    ? 'top-1/2 -right-12 -translate-y-1/2'
                    : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
                className,
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ChevronRightIcon />
            <span className="sr-only">Next slide</span>
        </Button>
    );
}

export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    useCarousel,
};
