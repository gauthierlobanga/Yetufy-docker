// resources/js/Components/Posts/PostForm/SeoFields.tsx

import React from 'react';
import { Badge } from '@/components/ui/badge';
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

interface SeoFieldsProps {
    data: PostFormData;
    setData: (key: keyof PostFormData, value: any) => void;
    errors: Record<string, string>;
}

export function SeoFields({ data, setData, errors }: SeoFieldsProps) {
    // Compteurs pour SEO
    const titleLength = data.meta_title?.length || 0;
    const descLength = data.meta_description?.length || 0;

    const getTitleStatus = () => {
        if (titleLength === 0) {
            return 'default';
        }

        if (titleLength < 30) {
            return 'warning';
        }

        if (titleLength > 60) {
            return 'warning';
        }

        return 'success';
    };

    const getDescStatus = () => {
        if (descLength === 0) {
            return 'default';
        }

        if (descLength < 120) {
            return 'warning';
        }

        if (descLength > 160) {
            return 'warning';
        }

        return 'success';
    };

    const statusColors = {
        default: 'bg-gray-100 text-gray-800',
        warning: 'bg-yellow-100 text-yellow-800',
        success: 'bg-green-100 text-green-800',
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Optimisation SEO</CardTitle>
                <CardDescription>
                    Améliorez le référencement de votre article
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Meta Title */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="meta_title">Meta Title</Label>
                        <Badge className={statusColors[getTitleStatus()]}>
                            {titleLength}/60
                        </Badge>
                    </div>
                    <Input
                        id="meta_title"
                        value={data.meta_title || ''}
                        onChange={(e) => setData('meta_title', e.target.value)}
                        placeholder={data.title || 'Titre SEO'}
                        maxLength={60}
                        className={errors.meta_title ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                        Laissez vide pour utiliser le titre par défaut
                    </p>
                    {errors.meta_title && (
                        <p className="text-sm text-red-500">
                            {errors.meta_title}
                        </p>
                    )}
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="meta_description">
                            Meta Description
                        </Label>
                        <Badge className={statusColors[getDescStatus()]}>
                            {descLength}/160
                        </Badge>
                    </div>
                    <Textarea
                        id="meta_description"
                        value={data.meta_description || ''}
                        onChange={(e) =>
                            setData('meta_description', e.target.value)
                        }
                        placeholder={
                            data.excerpt ||
                            'Description pour les moteurs de recherche'
                        }
                        maxLength={160}
                        rows={3}
                        className={
                            errors.meta_description ? 'border-red-500' : ''
                        }
                    />
                    <p className="text-xs text-muted-foreground">
                        Laissez vide pour utiliser l'extrait
                    </p>
                    {errors.meta_description && (
                        <p className="text-sm text-red-500">
                            {errors.meta_description}
                        </p>
                    )}
                </div>

                {/* Meta Keywords */}
                <div className="space-y-2">
                    <Label htmlFor="meta_keywords">Mots-clés</Label>
                    <Input
                        id="meta_keywords"
                        value={data.meta_keywords || ''}
                        onChange={(e) =>
                            setData('meta_keywords', e.target.value)
                        }
                        placeholder="laravel, react, blog, actualités"
                        className={errors.meta_keywords ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                        Séparez les mots-clés par des virgules
                    </p>
                    {errors.meta_keywords && (
                        <p className="text-sm text-red-500">
                            {errors.meta_keywords}
                        </p>
                    )}
                </div>

                {/* Aperçu Google */}
                {(data.meta_title || data.title) && (
                    <div className="mt-6 rounded-lg border bg-gray-50 p-4">
                        <p className="mb-2 text-xs text-gray-600">
                            Aperçu Google :
                        </p>
                        <div className="space-y-1">
                            <p className="cursor-pointer text-lg font-medium text-blue-600 hover:underline">
                                {data.meta_title || data.title}
                            </p>
                            <p className="text-sm text-green-600">
                                www.votresite.com/{data.slug || 'article'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {data.meta_description ||
                                    data.excerpt ||
                                    data.content?.substring(0, 150)}
                                ...
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
