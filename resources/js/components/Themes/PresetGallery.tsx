import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemePreset {
    label: string;
    description: string;
    primaryColor: string;
    neutralColor: string;
}

interface PresetGalleryProps {
    presets: Record<string, ThemePreset>;
    currentPreset: string;
    onSelectPreset: (preset: string) => void;
    isLoading?: boolean;
}

export default function PresetGallery({
    presets,
    currentPreset,
    onSelectPreset,
    isLoading = false,
}: PresetGalleryProps) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Thèmes prédéfinis
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Choisissez un thème professionnel pour votre boutique
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(presets).map(([key, preset]) => {
                    const isSelected = currentPreset === key;
                    const primaryHsl = preset.primaryColor;
                    const neutralHsl = preset.neutralColor;

                    return (
                        <motion.div
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => !isLoading && onSelectPreset(key)}
                            className={cn(
                                'relative rounded-xl border-2 p-4 transition-all text-left overflow-hidden cursor-pointer',
                                isSelected
                                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-lg'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900',
                                isLoading && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {/* Miniature des couleurs */}
                            <div className="flex gap-2 mb-3">
                                <div
                                    className="h-8 w-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
                                    style={{ backgroundColor: `hsl(${primaryHsl})` }}
                                />
                                <div
                                    className="h-8 w-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
                                    style={{ backgroundColor: `hsl(${neutralHsl})` }}
                                />
                            </div>

                            {/* Label et description */}
                            <div className="mb-3">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                                        {preset.label}
                                    </h4>
                                    {isSelected && (
                                        <Badge className="bg-emerald-600 text-white text-xs">
                                            <Check className="h-3 w-3 mr-1" />
                                            Actif
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                    {preset.description}
                                </p>
                            </div>

                            {/* Aperçu d'exemple */}
                            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <div
                                    className="w-full h-7 rounded-md text-white text-xs font-medium transition-opacity hover:opacity-90 flex items-center justify-center cursor-default"
                                    style={{ backgroundColor: `hsl(${primaryHsl})` }}
                                >
                                    Aperçu
                                </div>
                                <div
                                    className="w-full h-7 rounded-md border border-slate-300 text-xs font-medium transition-opacity flex items-center justify-center cursor-default"
                                    style={{
                                        borderColor: `hsl(${neutralHsl})`,
                                        color: `hsl(${neutralHsl})`,
                                    }}
                                >
                                    Secondaire
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
