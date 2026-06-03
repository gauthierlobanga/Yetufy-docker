// resources/js/components/posts/PostForm/index.tsx
import { useForm } from '@inertiajs/react';
import { AlertCircle, Save, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PostFormProps, PostFormData } from '@/types/posts/post-form';
import type { GalleryImage, SimpleTag } from '@/types/posts/posts';
import { BasicInfo } from './BasicInfo';
import { CategoriesSection } from './Categories';
import { MediaUpload } from './MediaUpload';
import { PublishSettings } from './PublishSettings';
import { SeoFields } from './SeoFields';
import { TagsSection } from './Tags';

// Interface étendue pour le formulaire
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ExtendedPost {
    id?: number;
    title?: string;
    slug?: string;
    content?: string | Record<string, any> | null;
    excerpt?: string | Record<string, any> | null;
    status?: 'draft' | 'published' | 'scheduled' | 'expired' | 'archived';
    is_pinned?: boolean;
    published_at?: string | null;
    scheduled_for?: string | null;
    expires_at?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    metadata?: Record<string, any> | null;
    featured_image_url?: string | null;
    category_id?: number | null;
    categories?: Array<{ id: number }>;
    tags?: SimpleTag[];
    gallery_images?: GalleryImage[];
}

export function PostForm({
    post,
    categories,
    tags = [],
    statuses,
    onSubmit,
    onCancel,
    isSubmitting: externalSubmitting,
}: PostFormProps) {
    const [activeTab, setActiveTab] = useState('basic');
    const [uploadingMedia, setUploadingMedia] = useState(false);

    // Transformer les tags du post pour le formulaire
    const formattedPostTags = (post?.tags || []).map(
        (tag: SimpleTag) => tag.id,
    );

    // Configuration du formulaire Inertia
    const { data, setData, errors, processing } = useForm<PostFormData>({
        // Infos de base
        title: post?.title || '',
        slug: post?.slug || '',
        content:
            typeof post?.content === 'string'
                ? post.content
                : JSON.stringify(post?.content || ''),
        excerpt: typeof post?.excerpt === 'string' ? post.excerpt : '',

        // Relations
        category_id: post?.category_id || null,
        categories: post?.categories?.map((c) => c.id) || [],
        tags: formattedPostTags,

        // Statut
        status: (post?.status || 'draft') as
            | 'draft'
            | 'published'
            | 'scheduled'
            | 'expired'
            | 'archived',
        is_pinned: post?.is_pinned || false,
        published_at: post?.published_at || null,
        scheduled_for: post?.scheduled_for || null,
        expires_at: post?.expires_at || null,

        // Médias
        featured_image: null,
        featured_image_url: post?.featured_image_url || null,
        gallery: [],

        // SEO
        meta_title: post?.meta_title || '',
        meta_description: post?.meta_description || '',
        meta_keywords: post?.meta_keywords || '',

        // Métadonnées
        metadata: post?.metadata || {},

        // Méthode pour update
        _method: post?.id ? 'put' : 'post',
    });

    // Génération automatique du slug
    useEffect(() => {
        if (!data.slug && data.title) {
            const slug = data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-')
                .trim();
            setData('slug', slug);
        }
    }, [data.title, data.slug, setData]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation de base
        if (!data.title?.trim()) {
            toast.error('Le titre est requis');

            return;
        }

        if (!data.content?.trim()) {
            toast.error('Le contenu est requis');

            return;
        }

        // Soumission
        if (onSubmit) {
            onSubmit(data);
        }
    };

    const isSubmitting = processing || externalSubmitting || uploadingMedia;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Barre d'actions sticky */}
            <div className="sticky top-0 z-10 -mx-6 mb-4 flex items-center justify-between border-b bg-white px-6 py-4 dark:bg-gray-950">
                <h2 className="text-lg font-semibold">
                    {post?.id ? 'Modifier' : 'Créer'} un article
                </h2>
                <div className="flex items-center gap-3">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Annuler
                        </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting
                            ? 'Enregistrement...'
                            : post?.id
                              ? 'Mettre à jour'
                              : 'Publier'}
                    </Button>
                </div>
            </div>

            {/* Messages d'erreur globaux */}
            {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Veuillez corriger les erreurs ci-dessous
                    </AlertDescription>
                </Alert>
            )}

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="basic">Contenu</TabsTrigger>
                    <TabsTrigger value="categories">Catégories</TabsTrigger>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                    <TabsTrigger value="media">Médias</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="publish">Publication</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-6">
                    <BasicInfo data={data} setData={setData} errors={errors} />
                </TabsContent>

                <TabsContent value="categories" className="mt-6">
                    <CategoriesSection
                        data={data}
                        setData={setData}
                        categories={categories}
                        errors={errors}
                    />
                </TabsContent>

                <TabsContent value="tags" className="mt-6">
                    <TagsSection
                        data={data}
                        setData={setData}
                        errors={errors}
                        availableTags={tags}
                    />
                </TabsContent>

                <TabsContent value="media" className="mt-6">
                    <MediaUpload
                        data={data}
                        setData={setData}
                        setUploading={setUploadingMedia}
                        errors={errors}
                        postId={post?.id}
                    />
                </TabsContent>

                <TabsContent value="seo" className="mt-6">
                    <SeoFields data={data} setData={setData} errors={errors} />
                </TabsContent>

                <TabsContent value="publish" className="mt-6">
                    <PublishSettings
                        data={data}
                        setData={setData}
                        statuses={statuses}
                        errors={errors}
                    />
                </TabsContent>
            </Tabs>

            {/* Boutons fixes en bas (mobile) */}
            <div className="flex justify-end gap-3 border-t px-4 pt-4 md:hidden">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? 'Enregistrement...'
                        : post?.id
                          ? 'Mettre à jour'
                          : 'Publier'}
                </Button>
            </div>
        </form>
    );
}
