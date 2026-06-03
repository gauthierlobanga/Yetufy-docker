import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    description?: string;
}

export default function ColorPicker({
    value,
    onChange,
    label = 'Couleur',
    description,
}: ColorPickerProps) {
    const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 });
    const [copied, setCopied] = useState(false);

    // Parsez la valeur HSL
    useEffect(() => {
        const match = value.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
        if (match) {
            setHsl({
                h: parseFloat(match[1]),
                s: parseFloat(match[2]),
                l: parseFloat(match[3]),
            });
        }
    }, [value]);

    const updateValue = (newHsl: typeof hsl) => {
        const newValue = `${Math.round(newHsl.h)} ${Math.round(newHsl.s)}% ${Math.round(newHsl.l)}%`;
        onChange(newValue);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success('Couleur copiée');
        setTimeout(() => setCopied(false), 2000);
    };

    const presetColors = [
        { value: '0 0% 100%', label: 'Blanc' },
        { value: '0 0% 0%', label: 'Noir' },
        { value: '0 0% 50%', label: 'Gris' },
        { value: '0 100% 50%', label: 'Rouge' },
        { value: '30 100% 50%', label: 'Orange' },
        { value: '60 100% 50%', label: 'Jaune' },
        { value: '120 100% 50%', label: 'Vert' },
        { value: '240 100% 50%', label: 'Bleu' },
    ];

    return (
        <div className="space-y-4">
            <div>
                {label && (
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {label}
                    </Label>
                )}
                {description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {description}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                {/* Aperçu couleur */}
                <div className="flex gap-3 items-center">
                    <div
                        className="h-12 w-12 rounded-lg border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                        style={{ backgroundColor: `hsl(${value})` }}
                    />
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Valeur HSL
                        </p>
                        <code className="text-sm font-mono text-slate-900 dark:text-slate-100">
                            {value}
                        </code>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyToClipboard}
                        className="ml-auto"
                    >
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Sliders HSL */}
                <div className="space-y-3">
                    {/* Hue */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Teinte
                            </span>
                            <span className="text-xs text-slate-500">{Math.round(hsl.h)}°</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={hsl.h}
                            onChange={(e) => {
                                const newHsl = { ...hsl, h: parseFloat(e.target.value) };
                                setHsl(newHsl);
                                updateValue(newHsl);
                            }}
                            className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                            style={{
                                WebkitAppearance: 'none',
                            } as any}
                        />
                    </div>

                    {/* Saturation */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Saturation
                            </span>
                            <span className="text-xs text-slate-500">{Math.round(hsl.s)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={hsl.s}
                            onChange={(e) => {
                                const newHsl = { ...hsl, s: parseFloat(e.target.value) };
                                setHsl(newHsl);
                                updateValue(newHsl);
                            }}
                            className="w-full h-2 bg-gradient-to-r from-gray-400 to-slate-600 rounded-lg appearance-none cursor-pointer"
                            style={{
                                WebkitAppearance: 'none',
                            } as any}
                        />
                    </div>

                    {/* Lightness */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Luminosité
                            </span>
                            <span className="text-xs text-slate-500">{Math.round(hsl.l)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={hsl.l}
                            onChange={(e) => {
                                const newHsl = { ...hsl, l: parseFloat(e.target.value) };
                                setHsl(newHsl);
                                updateValue(newHsl);
                            }}
                            className="w-full h-2 bg-gradient-to-r from-black via-slate-500 to-white rounded-lg appearance-none cursor-pointer"
                            style={{
                                WebkitAppearance: 'none',
                            } as any}
                        />
                    </div>
                </div>

                {/* Couleurs prédéfinies */}
                <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                        Couleurs rapides
                    </p>
                    <div className="grid grid-cols-8 gap-1">
                        {presetColors.map((preset) => (
                            <motion.button
                                key={preset.value}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onChange(preset.value)}
                                className={cn(
                                    'h-8 rounded-lg border-2 transition-all',
                                    value === preset.value
                                        ? 'border-emerald-500 shadow-md'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                )}
                                style={{ backgroundColor: `hsl(${preset.value})` }}
                                title={preset.label}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
