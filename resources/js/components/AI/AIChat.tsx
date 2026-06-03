// resources/js/Components/AIChat.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Send, Sparkles, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function AIChat() {
    const [messages, setMessages] = useState<
        { role: string; content: string }[]
    >([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Défilement automatique vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Ajuste automatiquement la hauteur du textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [input]);

    const sendMessage = async () => {
        if (!input.trim()) {
            return;
        }

        const userMessage = { role: 'user', content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    message: input.trim(),
                    conversation_id: conversationId,
                }),
            });

            if (!res.ok) {
                throw new Error(`Erreur ${res.status}`);
            }

            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.content },
            ]);
            setConversationId(data.conversation_id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error('Impossible de contacter l’assistant.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setConversationId(null);
        toast.success('Conversation effacée.');
    };

    return (
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            {/* En-tête */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Assistant Yetu
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Propulsé par Gemini
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title="Effacer la conversation"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <div className="scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 max-h-100 flex-1 space-y-6 overflow-y-auto px-4 py-6">
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="mt-1 mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-sm">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user'
                                        ? 'rounded-br-md bg-emerald-600 text-white'
                                        : 'rounded-bl-md bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                                }`}
                            >
                                {msg.content}
                            </div>

                            {msg.role === 'user' && (
                                <div className="mt-1 ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                    <span className="text-xs font-bold">M</span>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {/* Indicateur de frappe */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start"
                        >
                            <div className="mt-1 mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-sm">
                                <Sparkles className="h-4 w-4 animate-pulse text-white" />
                            </div>
                            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800">
                                <div className="flex items-center gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:0ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:150ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:300ms]" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="border-t border-slate-100 px-4 py-4 dark:border-slate-800">
                <div className="flex items-end gap-2 rounded-2xl bg-slate-50 p-2 ring-1 ring-slate-200 transition-all focus-within:ring-2 focus-within:ring-emerald-500 dark:bg-slate-900 dark:ring-slate-700">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Écrivez votre message..."
                        disabled={loading}
                        rows={1}
                        className="min-h-10 flex-1 resize-none border-0 bg-transparent p-2 text-sm shadow-none placeholder:text-slate-400 focus-visible:ring-0 dark:placeholder:text-slate-500"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
                    L'assistant peut faire des erreurs. Vérifiez les
                    informations importantes.
                </p>
            </div>
        </div>
    );
}
