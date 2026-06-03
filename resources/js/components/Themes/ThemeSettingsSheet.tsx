/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Components/ThemeCustomizer.tsx
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Paintbrush,
    Check,
    RotateCcw,
    Sparkles,
    ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const accentOptions = [
    { value: '142 76% 36%', label: 'Émeraude', color: '#10b981' },
    { value: '346 77% 50%', label: 'Rose', color: '#f43f5e' },
    { value: '24 95% 53%', label: 'Orange', color: '#f97316' },
    { value: '221 83% 53%', label: 'Bleu', color: '#3b82f6' },
    { value: '262 83% 58%', label: 'Violet', color: '#8b5cf6' },
    { value: '48 96% 53%', label: 'Jaune', color: '#eab308' },
    { value: '142 76% 36%', label: 'Émeraude', color: '#10b981' },
    { value: '346 77% 50%', label: 'Rose', color: '#f43f5e' },
    { value: '24 95% 53%', label: 'Orange', color: '#f97316' },
    { value: '221 83% 53%', label: 'Bleu', color: '#3b82f6' },
    { value: '262 83% 58%', label: 'Violet', color: '#8b5cf6' },
    { value: '48 96% 53%', label: 'Jaune', color: '#eab308' },
    { value: '142 76% 36%', label: 'Émeraude', color: '#10b981' },
    { value: '346 77% 50%', label: 'Rose', color: '#f43f5e' },
    { value: '24 95% 53%', label: 'Orange', color: '#f97316' },
    { value: '221 83% 53%', label: 'Bleu', color: '#3b82f6' },
    { value: '262 83% 58%', label: 'Violet', color: '#8b5cf6' },
    { value: '48 96% 53%', label: 'Jaune', color: '#eab308' },
];

const neutralOptions = [
    { value: '215 16% 47%', label: 'Ardoise', className: 'bg-slate-500' },
    { value: '240 4% 16%', label: 'Zinc', className: 'bg-zinc-500' },
    { value: '220 14% 96%', label: 'Gris', className: 'bg-gray-500' },
    { value: '0 0% 45%', label: 'Neutre', className: 'bg-neutral-500' },
    { value: '24 10% 36%', label: 'Pierre', className: 'bg-stone-500' },
    { value: '240 4% 16%', label: 'Zinc', className: 'bg-zinc-500' },
    { value: '220 14% 96%', label: 'Gris', className: 'bg-gray-500' },
    { value: '0 0% 45%', label: 'Neutre', className: 'bg-neutral-500' },
    { value: '24 10% 36%', label: 'Pierre', className: 'bg-stone-500' },
];

export default function ThemeCustomizer() {
    const { props } = usePage<{
        tenantTheme?: { accent_color?: string; neutral_color?: string };
    }>();
    const initialTheme = props.tenantTheme || {};
    const [accent, setAccent] = useState(
        initialTheme.accent_color || '142 76% 36%',
    );
    const [neutral, setNeutral] = useState(
        initialTheme.neutral_color || '215 16% 47%',
    );
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Appliquer un aperçu en direct sur un <style> temporaire
    useEffect(() => {
        const styleId = 'tenant-preview-theme';
        let styleTag = document.getElementById(styleId);

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        // Appliquer les variables CSS shadcn/ui pour l'aperçu
        styleTag.innerHTML = `
            :root {
                --primary: ${accent};
                --primary-foreground: 0 0% 100%;
                --secondary: ${neutral};
                --secondary-foreground: ${neutral};
                --muted: ${neutral};
                --muted-foreground: ${neutral};
                --accent: ${accent};
                --accent-foreground: ${accent};
                --border: ${neutral};
                --input: ${neutral};
                --ring: ${accent};
            }
        `;

        return () => {
            if (styleTag) {
                styleTag.innerHTML = '';
            }
        };
    }, [accent, neutral]);

    const handleSave = async () => {
        setSaving(true);

        try {
            const response = await fetch(route('vendor.theme.update'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({
                    accent_color: accent,
                    neutral_color: neutral,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur serveur');
            }

            const data = await response.json();

            if (data.success) {
                toast.success('Thème appliqué avec succès', {
                    description:
                        'Votre boutique reflète maintenant les nouvelles couleurs.',
                });
                setOpen(false);
                window.location.reload(); // Recharge pour que le layout prenne le nouveau tenantTheme
            } else {
                toast.error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            toast.error('Impossible de communiquer avec le serveur');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setAccent('142 76% 36%');
        setNeutral('215 16% 47%');
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="group relative h-10 w-10 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                    <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Paintbrush className="h-5 w-5" />
                    </motion.div>
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-96 flex-col border-none p-0 sm:w-96 dark:bg-slate-900">
                <div className="flex h-full flex-col">
                    {/* En-tête — ne défile jamais */}
                    <div className="shrink-0 border-b border-emerald-800 bg-linear-to-r from-emerald-50 to-white px-3 py-3 dark:border-emerald-800 dark:from-emerald-950/40 dark:to-slate-900">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                                <Sparkles className="h-5 w-5 text-emerald-500" />
                                Personnaliser ma boutique
                            </SheetTitle>
                            <SheetDescription className="text-slate-500 dark:text-slate-400">
                                Choisissez une couleur d’accent et une couleur
                                de base.
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    {/* Partie scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="space-y-8">
                            {/* Accent */}
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Couleur d’accent
                                    </Label>
                                    <Badge
                                        variant="outline"
                                        className="border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400"
                                    >
                                        {
                                            accentOptions.find(
                                                (o) => o.value === accent,
                                            )?.label
                                        }
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-6 gap-2">
                                    {accentOptions.map((opt) => {
                                        const isActive = accent === opt.value;

                                        return (
                                            <motion.button
                                                key={opt.value}
                                                onClick={() =>
                                                    setAccent(opt.value)
                                                }
                                                whileTap={{ scale: 0.95 }}
                                                className={cn(
                                                    'flex flex-col items-center gap-1 rounded-xl border p-1 transition-all duration-200',
                                                    isActive
                                                        ? 'border-emerald-500 bg-emerald-50 shadow-md dark:bg-emerald-900/20'
                                                        : 'border-transparent hover:border-slate-200 hover:shadow-sm dark:hover:border-slate-700',
                                                )}
                                            >
                                                <span
                                                    className="h-8 w-8 rounded-lg shadow-inner"
                                                    style={{
                                                        backgroundColor:
                                                            opt.color,
                                                    }}
                                                />
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Neutre */}
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Couleur de base
                                    </Label>
                                    <Badge
                                        variant="outline"
                                        className="border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400"
                                    >
                                        {
                                            neutralOptions.find(
                                                (o) => o.value === neutral,
                                            )?.label
                                        }
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {neutralOptions.map((opt) => {
                                        const isActive = neutral === opt.value;

                                        return (
                                            <motion.button
                                                key={opt.value}
                                                onClick={() =>
                                                    setNeutral(opt.value)
                                                }
                                                whileTap={{ scale: 0.95 }}
                                                className={cn(
                                                    'flex flex-col items-center gap-1 rounded-xl border p-1 transition-all duration-200',
                                                    isActive
                                                        ? 'border-emerald-500 bg-emerald-50 shadow-md dark:bg-emerald-900/20'
                                                        : 'border-transparent hover:border-slate-200 hover:shadow-sm dark:hover:border-slate-700',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'h-8 w-8 rounded-lg shadow-inner',
                                                        opt.className,
                                                    )}
                                                />
                                                <span className="text-xs font-medium">
                                                    {opt.label}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Aperçu */}
                            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/30">
                                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                    Aperçu en direct
                                </p>
                                <div className="flex gap-2">
                                    <div
                                        className="h-8 w-8 rounded-full"
                                        style={{
                                            backgroundColor: `hsl(${accent})`,
                                        }}
                                    />
                                    <div
                                        className="h-8 w-8 rounded-full"
                                        style={{
                                            backgroundColor: `hsl(${neutral})`,
                                        }}
                                    />
                                </div>
                                <div
                                    className="rounded-lg p-3 text-sm font-medium"
                                    style={{
                                        backgroundColor: `hsl(${neutral} / 0.1)`,
                                        color: `hsl(${neutral})`,
                                    }}
                                >
                                    Texte sur fond neutre
                                </div>
                                <div
                                    className="rounded-lg p-3 text-sm font-semibold text-white shadow-sm"
                                    style={{
                                        backgroundColor: `hsl(${accent})`,
                                    }}
                                >
                                    Bouton primaire
                                </div>
                                <div
                                    className="rounded-full px-3 py-1 text-xs font-medium"
                                    style={{
                                        backgroundColor: `hsl(${accent} / 0.15)`,
                                        color: `hsl(${accent})`,
                                    }}
                                >
                                    Badge
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Barre d'action fixée en bas */}
                    <div className="shrink-0 border-t border-slate-200 px-6 py-5 dark:border-slate-700">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1 cursor-pointer border-slate-200 dark:border-slate-700"
                                onClick={handleReset}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Défaut
                            </Button>
                            <Button
                                size="lg"
                                className="flex-1 cursor-pointer gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Sauvegarde…
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Appliquer
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
