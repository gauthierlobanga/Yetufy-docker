// resources/js/Components/Posts/PostForm/BasicInfo.tsx
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PostFormData } from '@/types/posts/post-form';

interface BasicInfoProps {
    data: PostFormData;
    setData: (key: keyof PostFormData, value: any) => void;
    errors: Record<string, string>;
}

export function BasicInfo({ data, setData, errors }: BasicInfoProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informations de base</CardTitle>
                    <CardDescription>
                        Titre, contenu et extrait de l'article
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Titre */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Titre <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Titre de l'article"
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="titre-de-l-article"
                            className={errors.slug ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-muted-foreground">
                            Laissez vide pour génération automatique
                        </p>
                        {errors.slug && (
                            <p className="text-sm text-red-500">
                                {errors.slug}
                            </p>
                        )}
                    </div>

                    {/* Contenu */}
                    <div className="space-y-2">
                        <Label htmlFor="content">
                            Contenu <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Contenu de l'article..."
                            rows={12}
                            className={errors.content ? 'border-red-500' : ''}
                        />
                        {errors.content && (
                            <p className="text-sm text-red-500">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    {/* Extrait */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Extrait</Label>
                        <Textarea
                            id="excerpt"
                            value={data.excerpt || ''}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            placeholder="Court résumé (optionnel)"
                            rows={3}
                            className={errors.excerpt ? 'border-red-500' : ''}
                        />
                        <p className="text-xs text-muted-foreground">
                            Si vide, sera généré automatiquement depuis le
                            contenu
                        </p>
                        {errors.excerpt && (
                            <p className="text-sm text-red-500">
                                {errors.excerpt}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
