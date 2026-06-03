// resources/js/Components/Posts/PostFormSheet.tsx
import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type { PostFormProps } from '@/types/posts/post-form';
import { PostForm } from './PostForm/index';

interface PostFormSheetProps extends PostFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PostFormSheet({
    open,
    onOpenChange,
    post,
    categories,
    tags = [],
    statuses,
    onSubmit,
    isSubmitting,
}: PostFormSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full overflow-y-auto p-0 sm:min-w-2xl lg:min-w-3xl">
                <div className="p-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle>
                            {post ? 'Modifier' : 'Créer'} un article
                        </SheetTitle>
                        <SheetDescription>
                            {post
                                ? 'Modifiez les informations de votre article'
                                : 'Remplissez les informations pour créer un nouvel article'}
                        </SheetDescription>
                    </SheetHeader>

                    <PostForm
                        post={post}
                        categories={categories}
                        tags={tags}
                        statuses={statuses}
                        onSubmit={onSubmit}
                        onCancel={() => onOpenChange(false)}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
