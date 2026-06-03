import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm, Controller } from 'react-hook-form';
import type * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formSchema } from '@/lib/form-schema';

type Schema = z.infer<typeof formSchema>;

export function DraftForm() {
    const form = useForm<Schema>({
        resolver: zodResolver(formSchema as any),
    });
    const {
        formState: { isSubmitting, isSubmitSuccessful },
    } = form;

    const handleSubmit = form.handleSubmit(async (data: Schema) => {
        try {
            // TODO: implement form submission
            console.log(data);
            form.reset();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // TODO: handle error
        }
    });

    if (isSubmitSuccessful) {
        return (
            <div className="w-full gap-2 rounded-md border p-2 sm:p-5 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
                    className="h-full px-3 py-6"
                >
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.3,
                            type: 'spring',
                            stiffness: 500,
                            damping: 15,
                        }}
                        className="mx-auto mb-4 flex w-fit justify-center rounded-full border p-2"
                    >
                        <Check className="size-8" />
                    </motion.div>
                    <h2 className="mb-2 text-center text-2xl font-bold text-pretty">
                        Thank you
                    </h2>
                    <p className="text-center text-lg text-pretty text-muted-foreground">
                        Form submitted successfully, we will get back to you
                        soon
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-3xl gap-2 rounded-md border p-2 sm:p-5 md:p-8"
        >
            <FieldGroup className="mb-6 grid gap-4 md:grid-cols-6">
                <h1 className="col-span-full mt-6 mb-1 text-3xl font-extrabold tracking-tight">
                    Credit Card
                </h1>
                <p className="col-span-full mb-5 text-sm tracking-wide text-wrap text-muted-foreground">
                    Enter your credit card details example
                </p>

                <Controller
                    name="fullname"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                            className="gap-1 md:col-span-3"
                        >
                            <FieldLabel htmlFor="fullname">
                                Full Name *
                            </FieldLabel>
                            <Input
                                {...field}
                                id="fullname"
                                type="text"
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your Full Name"
                            />

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                            className="gap-1 md:col-span-3"
                        >
                            <FieldLabel htmlFor="email">Email *</FieldLabel>
                            <Input
                                {...field}
                                id="email"
                                type="text"
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your Email"
                            />

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="number"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                            className="col-span-full gap-1"
                        >
                            <FieldLabel htmlFor="number">
                                Credit Card Number (IBAN){' '}
                            </FieldLabel>
                            <Input
                                {...field}
                                id="number"
                                type="text"
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter your Credit Card Number"
                            />

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="expiry-date"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                            className="gap-1 md:col-span-3"
                        >
                            <FieldLabel htmlFor="expiry-date">
                                Expiry Date *
                            </FieldLabel>
                            <Input
                                {...field}
                                id="expiry-date"
                                type="text"
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                aria-invalid={fieldState.invalid}
                                placeholder="Expiry Date"
                            />

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="cvv"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                            className="gap-1 md:col-span-3"
                        >
                            <FieldLabel htmlFor="cvv">CVV *</FieldLabel>
                            <Input
                                {...field}
                                id="cvv"
                                type="text"
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                }}
                                aria-invalid={fieldState.invalid}
                                placeholder="CVV"
                            />

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="agree"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field
                            data-invalid={fieldState.invalid}
                            className="col-span-full gap-1"
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <Checkbox
                                    id="agree"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
                                />
                                <FieldLabel htmlFor="agree">
                                    I agree to the terms and conditions *
                                </FieldLabel>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <div className="flex w-full items-center justify-end">
                <Button disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </form>
    );
}
