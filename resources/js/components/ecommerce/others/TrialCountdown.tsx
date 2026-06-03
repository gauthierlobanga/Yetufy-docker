/* eslint-disable react-hooks/set-state-in-effect */
import { motion } from 'framer-motion';
import { Clock3, Hourglass, Sparkles, CalendarRange } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Trial {
    start: string;
    end: string;
    remaining_days: number;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const EMPTY_TIME: TimeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
};

function calculateTimeLeft(endDate: string): TimeLeft {
    const total = new Date(endDate).getTime() - Date.now();

    if (total <= 0) {
        return EMPTY_TIME;
    }

    return {
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / (1000 * 60)) % 60),
        seconds: Math.floor((total / 1000) % 60),
    };
}

function formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
    return (
        <motion.div layout className="group flex flex-col items-center gap-2">
            <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl transition-all duration-500 group-hover:bg-emerald-500/30 dark:bg-emerald-400/10" />

                {/* Box */}
                <div className="relative flex h-18 w-18 items-center justify-center rounded-3xl border border-white/70 bg-white/90 shadow-[0_10px_30px_rgba(16,185,129,0.15)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/90 dark:shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
                    <span className="bg-linear-to-br from-emerald-500 to-emerald-600 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                        {String(value).padStart(2, '0')}
                    </span>
                </div>
            </div>

            <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                {label}
            </span>
        </motion.div>
    );
}

function Separator() {
    return (
        <div className="hidden text-2xl font-bold text-slate-300 sm:block dark:text-slate-700">
            :
        </div>
    );
}

export function TrialCountdown({ trial }: { trial: Trial | null }) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(
        trial ? calculateTimeLeft(trial.end) : EMPTY_TIME,
    );

    useEffect(() => {
        if (!trial) {
            return;
        }

        setTimeLeft(calculateTimeLeft(trial.end));

        const timer = window.setInterval(() => {
            setTimeLeft(calculateTimeLeft(trial.end));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [trial]);

    const isExpired = useMemo(() => {
        return (
            timeLeft.days === 0 &&
            timeLeft.hours === 0 &&
            timeLeft.minutes === 0 &&
            timeLeft.seconds === 0
        );
    }, [timeLeft]);

    if (!trial) {
        return null;
    }

    const progress = Math.max(
        0,
        Math.min(
            100,
            (trial.remaining_days / Math.max(trial.remaining_days, 1)) * 100,
        ),
    );

    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mb-8"
        >
            <Card className="group relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-emerald-900/40 dark:bg-slate-950/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-linear-to-br from-emerald-50/80 via-white to-slate-50 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900" />

                {/* Glow accents */}
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />
                <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-700/10" />

                <CardContent className="relative p-6 sm:p-8">
                    <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                        {/* Informations */}
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div
                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-lg ${
                                        isExpired
                                            ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400'
                                            : 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400'
                                    }`}
                                >
                                    {isExpired ? (
                                        <Hourglass className="h-7 w-7" />
                                    ) : (
                                        <Clock3 className="h-7 w-7" />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {isExpired
                                                ? 'Période d’essai terminée'
                                                : 'Période d’essai active'}
                                        </h3>

                                        {!isExpired && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                Essai gratuit
                                            </span>
                                        )}
                                    </div>

                                    <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        {isExpired
                                            ? 'Votre période d’essai est arrivée à son terme.'
                                            : 'Profitez de toutes les fonctionnalités premium pendant votre période d’essai.'}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        <CalendarRange className="h-4 w-4 text-emerald-500" />
                                        <span>{formatDate(trial.start)}</span>
                                        <span>—</span>
                                        <span>{formatDate(trial.end)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Barre de progression */}
                            {!isExpired && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                        <span>Temps restant</span>
                                        <span>
                                            {trial.remaining_days} jour
                                            {trial.remaining_days > 1
                                                ? 's'
                                                : ''}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.8 }}
                                            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Countdown */}
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 xl:justify-end">
                            <CountdownUnit
                                value={timeLeft.days}
                                label="Jours"
                            />
                            <Separator />
                            <CountdownUnit
                                value={timeLeft.hours}
                                label="Heures"
                            />
                            <Separator />
                            <CountdownUnit
                                value={timeLeft.minutes}
                                label="Minutes"
                            />
                            <Separator />
                            <CountdownUnit
                                value={timeLeft.seconds}
                                label="Secondes"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.section>
    );
}
