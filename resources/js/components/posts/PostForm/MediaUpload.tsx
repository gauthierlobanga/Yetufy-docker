/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/posts/PostForm/MediaUpload.tsx
import axios from 'axios';
import { ImagePlus, X, Loader2, Upload } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MediaUploadProps {
    data: any;
    setData: (key: string, value: any) => void;
    setUploading: (uploading: boolean) => void;
    errors: Record<string, string>;
    postId?: number;
}

export function MediaUpload({
    data,
    setData,
    setUploading,
    errors,
    postId,
}: MediaUploadProps) {
    const [uploadProgress, setUploadProgress] = useState<
        Record<string, number>
    >({});

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setUploading(true);

            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('collection', 'gallery');

                if (postId) {
                    formData.append('post_id', postId.toString());
                }

                try {
                    const response = await axios.post(
                        '/posts/media/upload',
                        formData,
                        {
                            headers: { 'Content-Type': 'multipart/form-data' },
                            onUploadProgress: (progressEvent) => {
                                if (progressEvent.total) {
                                    const percent = Math.round(
                                        (progressEvent.loaded * 100) /
                                            progressEvent.total,
                                    );
                                    setUploadProgress((prev) => ({
                                        ...prev,
                                        [file.name]: percent,
                                    }));
                                }
                            },
                        },
                    );

                    if (response.data?.media) {
                        const newGallery = [
                            ...(data.gallery || []),
                            response.data.media.url,
                        ];
                        setData('gallery', newGallery);
                        toast.success(`${file.name} téléchargé avec succès`);
                    }
                } catch (error) {
                    console.error('Upload error:', error);
                    toast.error(
                        `Erreur lors du téléchargement de ${file.name}`,
                    );
                } finally {
                    setUploadProgress((prev) => {
                        const newProgress = { ...prev };
                        delete newProgress[file.name];

                        return newProgress;
                    });
                }
            }

            setUploading(false);
        },
        [postId, data.gallery, setData, setUploading],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
        maxSize: 5242880, // 5MB
        multiple: true,
    });

    const removeImage = (index: number) => {
        const newGallery = [...(data.gallery || [])];
        newGallery.splice(index, 1);
        setData('gallery', newGallery);
        toast.success('Image supprimée');
    };

    const handleFeaturedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setData('featured_image_url', reader.result as string);
            setData('featured_image', file);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            {/* Image à la une */}
            <div className="space-y-2">
                <Label>Image à la une</Label>
                <div className="flex items-center gap-4">
                    {data.featured_image_url ? (
                        <div className="relative">
                            <img
                                src={data.featured_image_url}
                                alt="Featured"
                                className="h-32 w-32 rounded-lg object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6"
                                onClick={() => {
                                    setData('featured_image_url', null);
                                    setData('featured_image', null);
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFeaturedImage}
                                className="cursor-pointer"
                            />
                        </div>
                    )}
                </div>
                {errors.featured_image && (
                    <p className="text-sm text-red-500">
                        {errors.featured_image}
                    </p>
                )}
            </div>

            {/* Galerie d'images */}
            <div className="space-y-2">
                <Label>Galerie d'images</Label>

                {/* Zone de drop */}
                <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                        isDragActive
                            ? 'border-primary bg-primary/10'
                            : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        {isDragActive
                            ? 'Déposez les images ici...'
                            : 'Glissez-déposez des images ou cliquez pour sélectionner'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF, WEBP jusqu'à 5MB
                    </p>
                </div>

                {/* Progression des uploads */}
                {Object.keys(uploadProgress).length > 0 && (
                    <div className="space-y-2">
                        {Object.entries(uploadProgress).map(
                            ([name, progress]) => (
                                <div
                                    key={name}
                                    className="flex items-center gap-2"
                                >
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">{name}</span>
                                    <div className="h-2 flex-1 rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm">{progress}%</span>
                                </div>
                            ),
                        )}
                    </div>
                )}

                {/* Aperçu de la galerie */}
                {data.gallery && data.gallery.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                        {data.gallery.map((url: string, index: number) => (
                            <Card
                                key={index}
                                className="relative overflow-hidden"
                            >
                                <CardContent className="p-0">
                                    <img
                                        src={url}
                                        alt={`Gallery ${index + 1}`}
                                        className="h-24 w-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6"
                                        onClick={() => removeImage(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                {errors.gallery && (
                    <p className="text-sm text-red-500">{errors.gallery}</p>
                )}
            </div>
        </div>
    );
}
