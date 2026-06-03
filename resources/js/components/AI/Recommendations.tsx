import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button } from '@/components/ui/button';

interface Recommendation {
    id: string;
    content: string;
    type: string;
    created_at: string;
}

export default function Recommendations() {
    const [items, setItems] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/ai/recommendations', {
            headers: {
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
            },
        })
            .then((res) => res.json())
            .then((data) => setItems(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-sm text-muted-foreground">Chargement…</div>;
    }

    if (items.length === 0) {
        return <p className="text-sm">Aucune suggestion pour le moment.</p>;
    }

    return (
        <div className="space-y-3">
            {items.map((rec) => (
                <div key={rec.id} className="rounded-xl border bg-card p-4">
                    <p className="text-sm">{rec.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(rec.created_at).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    );
}
