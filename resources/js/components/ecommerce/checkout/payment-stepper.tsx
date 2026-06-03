import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    number: number;
    label: string;
    completed: boolean;
    active: boolean;
}

interface PaymentStepperProps {
    currentStep: number;
}

const PaymentStepper = ({ currentStep }: PaymentStepperProps) => {
    const steps: Step[] = [
        {
            number: 1,
            label: 'Cart',
            completed: currentStep > 1,
            active: currentStep === 1,
        },
        {
            number: 2,
            label: 'Delivery and payment',
            completed: currentStep > 2,
            active: currentStep === 2,
        },
        {
            number: 3,
            label: 'Summary',
            completed: currentStep > 3,
            active: currentStep === 3,
        },
        {
            number: 4,
            label: 'Done',
            completed: false,
            active: currentStep === 4,
        },
    ];

    return (
        <div className="w-full py-8">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex flex-1 items-center">
                        <div className="flex flex-1 flex-col items-center">
                            <div className="flex w-full items-center">
                                <div
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium transition-colors',
                                        step.active &&
                                            'border-accent bg-accent text-accent-foreground',
                                        step.completed &&
                                            'border-accent bg-accent text-accent-foreground',
                                        !step.active &&
                                            !step.completed &&
                                            'border-border bg-muted text-muted-foreground',
                                    )}
                                >
                                    {step.completed ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={cn(
                                            'mx-2 h-0.5 flex-1 transition-colors',
                                            step.completed
                                                ? 'bg-accent'
                                                : 'bg-border',
                                        )}
                                    />
                                )}
                            </div>
                            <span
                                className={cn(
                                    'mt-2 text-center text-sm font-medium whitespace-nowrap',
                                    step.active
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentStepper;
