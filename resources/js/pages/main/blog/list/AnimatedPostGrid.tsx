// resources/js/components/blog/AnimatedPostGrid.tsx
'use client';

import { motion, AnimatePresence } from 'motion/react';
import type { ProcessedPost } from '@/types/posts/posts';

interface AnimatedPostGridProps {
    posts: ProcessedPost[];
    renderItem: (post: ProcessedPost) => React.ReactNode;
}

export function AnimatedPostGrid({ posts, renderItem }: AnimatedPostGridProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        {renderItem(post)}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
