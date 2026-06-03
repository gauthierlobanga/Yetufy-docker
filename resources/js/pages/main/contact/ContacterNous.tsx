'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Clock, Mail, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
    firstName: z.string().trim().min(1).max(20),
    lastName: z.string().trim().min(1).max(20),
    email: z.email(),
    subject: z.string().trim().min(1),
    message: z.string().trim().min(2).max(255),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactSection() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    // eslint-disable-next-line react-hooks/incompatible-library
    const subjectValue = watch('subject');

    function onSubmit(values: FormValues) {
        const { firstName, lastName, email, subject, message } = values;
        window.location.href = `mailto:leomirandadev@gmail.com?subject=${encodeURIComponent(
            subject,
        )}&body=${encodeURIComponent(
            `Hello I am ${firstName} ${lastName}, my Email is ${email}.\n\n${message}`,
        )}`;
    }

    return (
        <section className="py-12 lg:py-20">
            <div className="mx-auto max-w-5xl px-4">
                <header className="mb-6 max-w-3xl space-y-4 lg:mb-10">
                    <h3 className="font-heading text-4xl text-balance md:text-5xl">
                        Get Connect With Us access
                    </h3>
                    <p className="text-lg text-balance text-muted-foreground">
                        Stay in touch with us for updates, support, and valuable
                        insights. We’re here to help you every step of the way!
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Left column - contact info */}
                    <div className="order-2 md:order-1">
                        <div className="flex flex-col gap-4 *:rounded-lg *:p-6">
                            <div className="bg-muted/50">
                                <div className="mb-2 flex items-center gap-3">
                                    <Building2 className="size-4 text-muted-foreground" />
                                    <div className="font-semibold">
                                        Location:
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    123 Maple Lane, Springfield, IL 62704
                                </div>
                            </div>

                            <div className="bg-muted/50">
                                <div className="mb-2 flex items-center gap-3">
                                    <Phone className="size-4 text-muted-foreground" />
                                    <div className="font-semibold">
                                        Call us:
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    +1 (555) 987-6543
                                </div>
                            </div>

                            <div className="bg-muted/50">
                                <div className="mb-2 flex items-center gap-3">
                                    <Mail className="size-4 text-muted-foreground" />
                                    <div className="font-semibold">
                                        Email us:
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    contact@ourcompany.com
                                </div>
                            </div>

                            <div className="bg-muted/50">
                                <div className="mb-2 flex items-center gap-3">
                                    <Clock className="size-4 text-muted-foreground" />
                                    <div className="font-semibold">
                                        Business Hours:
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Tuesday to Saturday, 9 AM - 5 PM
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column - contact form */}
                    <Card className="order-1 border-0 bg-muted/50 shadow-none md:order-2">
                        <CardContent className="pt-6">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="grid w-full gap-6"
                            >
                                <div className="flex flex-col gap-4 md:flex-row">
                                    <div className="w-full space-y-2">
                                        <Label
                                            htmlFor="firstName"
                                            className="font-semibold"
                                        >
                                            Firstname
                                        </Label>
                                        <Input
                                            id="firstName"
                                            className="bg-background"
                                            placeholder="Leopoldo"
                                            {...register('firstName')}
                                        />
                                        {errors.firstName && (
                                            <p className="text-sm text-destructive">
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full space-y-2">
                                        <Label
                                            htmlFor="lastName"
                                            className="font-semibold"
                                        >
                                            Lastname
                                        </Label>
                                        <Input
                                            id="lastName"
                                            className="bg-background"
                                            placeholder="Miranda"
                                            {...register('lastName')}
                                        />
                                        {errors.lastName && (
                                            <p className="text-sm text-destructive">
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="font-semibold"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="bg-background"
                                        placeholder="contact@bundui.com"
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="subject"
                                        className="font-semibold"
                                    >
                                        Subject
                                    </Label>
                                    <Select
                                        value={subjectValue}
                                        onValueChange={(value) =>
                                            setValue('subject', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full bg-background">
                                            <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Web Development">
                                                Web Development
                                            </SelectItem>
                                            <SelectItem value="Mobile Development">
                                                Mobile Development
                                            </SelectItem>
                                            <SelectItem value="Figma Design">
                                                Figma Design
                                            </SelectItem>
                                            <SelectItem value="REST API">
                                                REST API
                                            </SelectItem>
                                            <SelectItem value="FullStack Project">
                                                FullStack Project
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.subject && (
                                        <p className="text-sm text-destructive">
                                            {errors.subject.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="message"
                                        className="font-semibold"
                                    >
                                        Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Your message..."
                                        className="resize-none bg-background"
                                        {...register('message')}
                                    />
                                    {errors.message && (
                                        <p className="text-sm text-destructive">
                                            {errors.message.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    Send message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
