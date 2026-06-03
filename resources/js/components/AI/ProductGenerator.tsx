// resources/js/Components/ProductGenerator.tsx
import { Loader2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProductGenerator() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        title: string;
        short_description: string;
        long_description: string;
        keywords: string[];
    } | null>(null);

    const generate = async () => {
        if (!prompt.trim()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/ai/generate-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            setResult(data);
            toast.success('Produit généré avec succès !');
        } catch {
            toast.error('Erreur lors de la génération.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex : Une montre connectée étanche pour le sport"
                    className="flex-1"
                />
                <Button
                    onClick={generate}
                    disabled={loading || !prompt.trim()}
                    className="gap-2"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="h-4 w-4" />
                    )}
                    Générer
                </Button>
            </div>

            {result && (
                <div className="space-y-4 rounded-xl border bg-muted/20 p-6">
                    <div>
                        <Label>Titre SEO</Label>
                        <p className="text-sm font-medium">{result.title}</p>
                    </div>
                    <div>
                        <Label>Description courte</Label>
                        <p className="text-sm">{result.short_description}</p>
                    </div>
                    <div>
                        <Label>Description longue</Label>
                        <p className="text-sm">{result.long_description}</p>
                    </div>
                    <div>
                        <Label>Mots-clés</Label>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {result.keywords.map((kw) => (
                                <span
                                    key={kw}
                                    className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                >
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
