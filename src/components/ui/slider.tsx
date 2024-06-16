'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Fredoka } from 'next/font/google';

import { cn } from '@/lib/utils';

const fredokaSemibold = Fredoka({ weight: '600', subsets: ['latin'] });

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>>(({ className, state, ...props }, ref) => {
    return (
        <SliderPrimitive.Root ref={ref} className={cn('relative flex w-full touch-none select-none items-center', className)} {...props}>
            <SliderPrimitive.Track className='relative h-2 w-full grow overflow-hidden rounded-full bg-secondary'>
                <SliderPrimitive.Range className='absolute h-full bg-primary' />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb
                className={`${fredokaSemibold.className} ${
                    props.disabled ? 'cursor-not-allowed hover:cursor-not-allowed hover:scale-100' : 'cursor-grab active:cursor-grabbing hover:scale-105f'
                } grid place-items-center transition-all text-sm h-6 w-6 rounded-full border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
            >
                {state}
            </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
    );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
