import DOMPurify from 'dompurify';
import React, { useState } from 'react';

interface Comment {
    id: number;
    user: {
        id: number;
        name: string;
        avatar_url: string | null;
    };
    content_html: string;
    time_ago: string;
    likes_count: number;
    replies_count: number;
    replies: Comment[];
}

interface CommentSectionProps {
    commentableType: string;
    commentableId: number;
}

export function CommentSection({
    commentableType,
    commentableId,
}: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    commentable_type: commentableType,
                    commentable_id: commentableId,
                    content: newComment,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setComments([data.comment, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">
                Commentaires ({comments.length})
            </h3>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Écrivez votre commentaire... Utilisez @ pour mentionner quelqu'un"
                        className="w-full rounded-lg border border-gray-300 p-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                        rows={4}
                    />
                    <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                        <button
                            type="button"
                            onClick={() => {
                                // Insérer un emoji
                                setNewComment(newComment + '😊');
                            }}
                            className="mr-2 hover:text-primary"
                        >
                            😊
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !newComment.trim()}
                    className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                    {isLoading ? 'Envoi...' : 'Publier'}
                </button>
            </form>

            {/* Liste des commentaires */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
}

function CommentItem({
    comment,
    depth = 0,
}: {
    comment: Comment;
    depth?: number;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        // Logique de réponse
        setShowReplyForm(false);
        setReplyContent('');
    };

    return (
        <div
            className={`rounded-lg border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${
                depth > 0 ? 'ml-6' : ''
            }`}
        >
            <div className="flex items-start gap-3">
                <img
                    src={
                        comment.user.avatar_url ||
                        `https://ui-avatars.com/api/?name=${comment.user.name}`
                    }
                    alt={comment.user.name}
                    className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-gray-500">
                            {comment.time_ago}
                        </span>
                    </div>
                    <div
                        className="prose prose-sm mt-1 max-w-none text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(comment.content_html),
                        }}
                    />
                    <div className="mt-2 flex items-center gap-4 text-sm">
                        <button className="text-gray-500 hover:text-primary">
                            👍 {comment.likes_count}
                        </button>
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-gray-500 hover:text-primary"
                        >
                            Répondre
                        </button>
                    </div>

                    {showReplyForm && (
                        <form onSubmit={handleReply} className="mt-3">
                            <textarea
                                value={replyContent}
                                onChange={(e) =>
                                    setReplyContent(e.target.value)
                                }
                                placeholder="Écrivez votre réponse..."
                                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                                rows={2}
                            />
                            <div className="mt-2 flex gap-2">
                                <button
                                    type="submit"
                                    className="rounded bg-primary px-3 py-1 text-xs text-white"
                                >
                                    Répondre
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReplyForm(false)}
                                    className="rounded bg-gray-500 px-3 py-1 text-xs text-white"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Réponses imbriquées */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
