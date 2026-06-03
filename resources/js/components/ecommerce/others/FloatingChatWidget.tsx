/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
    Brain,
    Code,
    MessageSquare,
    Send,
    Sparkles,
    X,
    Zap,
    Trash2,
    Loader2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import getToastStyle from '@/lib/toast-style';
import { cn } from '@/lib/utils';

// Types locaux
interface Agent {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: 'online' | 'busy' | 'offline';
    icon: React.ElementType;
    linear: string;
    provider?: string; // pour l'API
}

// Agents alignés avec les modèles disponibles (vous pouvez étendre)
const AI_AGENTS: Agent[] = [
    {
        id: 'gemini',
        name: 'Gemini 2.5 Pro',
        role: 'Assistant polyvalent',
        avatar: 'https://github.com/shadcn.png',
        status: 'online',
        icon: Sparkles,
        linear: 'from-emerald-500/20 to-emerald-700/20',
        provider: 'gemini',
    },
    {
        id: 'gpt4',
        name: 'GPT-4o',
        role: 'Raisonnement avancé',
        avatar: 'https://github.com/shadcn.png',
        status: 'online',
        icon: Brain,
        linear: 'from-violet-500/20 to-purple-500/20',
        provider: 'openai',
    },
    {
        id: 'claude',
        name: 'Claude 3.5 Sonnet',
        role: 'Écriture créative',
        avatar: 'https://github.com/shadcn.png',
        status: 'online',
        icon: Zap,
        linear: 'from-orange-500/20 to-amber-500/20',
        provider: 'anthropic',
    },
];

const containerVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
        transformOrigin: 'bottom right',
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: {
        opacity: 0,
        y: 20,
        scale: 0.95,
        transition: { duration: 0.2 },
    },
};

const messageVariants: Variants = {
    hidden: { opacity: 0, y: 10, x: -10 },
    visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: { type: 'spring', stiffness: 500, damping: 30 },
    },
};

export function FloatingChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAgentId, setSelectedAgentId] = useState<string>(
        AI_AGENTS[0].id,
    );
    const [messages, setMessages] = useState<
        { role: string; content: string }[]
    >([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentAgent =
        AI_AGENTS.find((a) => a.id === selectedAgentId) || AI_AGENTS[0];
    const AgentIcon = currentAgent.icon;

    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

    // Scroll automatique
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Focus lors de l'ouverture
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleSend = async () => {
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
                    // Si vous voulez transmettre le provider, vous pouvez l'ajouter dans le contrôleur
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
        } catch (err) {
            toast.error('Impossible de contacter l’assistant.', {
                style: getToastStyle('error'),
            });
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        setConversationId(null);
        toast.success('Conversation effacée.', {
            style: getToastStyle('success'),
        });
    };

    return (
        <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-window"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-96 overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/95"
                    >
                        {/* Header */}
                        <div className="relative overflow-hidden border-b border-emerald-100 bg-linear-to-r from-emerald-50 to-white px-5 py-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
                            <div className="absolute inset-0 bg-linear-to-br opacity-30 dark:opacity-20" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm dark:border-slate-800">
                                            <AvatarImage
                                                src={currentAgent.avatar}
                                                alt={currentAgent.name}
                                            />
                                            <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                                <AgentIcon className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span
                                            className={cn(
                                                'absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-800',
                                                currentAgent.status === 'online'
                                                    ? 'bg-emerald-500'
                                                    : currentAgent.status ===
                                                        'busy'
                                                      ? 'bg-amber-500'
                                                      : 'bg-slate-400',
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {currentAgent.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {currentAgent.role}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    onClick={toggleOpen}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Agent Selector */}
                        <div className="border-b border-emerald-100 px-3 py-2 dark:border-slate-800">
                            <div className="flex gap-2">
                                {AI_AGENTS.map((agent) => {
                                    const Icon = agent.icon;
                                    const isSelected =
                                        selectedAgentId === agent.id;

                                    return (
                                        <button
                                            key={agent.id}
                                            onClick={() =>
                                                setSelectedAgentId(agent.id)
                                            }
                                            className={cn(
                                                'flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all',
                                                isSelected
                                                    ? 'bg-emerald-100 text-emerald-700 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                                            )}
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            {agent.name.split(' ')[0]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto bg-linear-to-b from-slate-50/50 to-white px-4 py-4 dark:from-slate-950/50 dark:to-slate-950">
                            {messages.length === 0 && (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="mb-3 rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                                        <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Assistant Yetu
                                    </p>
                                    <p className="mt-1 max-w-50 text-xs text-slate-500 dark:text-slate-400">
                                        Posez une question sur votre boutique.
                                    </p>
                                </div>
                            )}
                            <AnimatePresence initial={false}>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        variants={messageVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={`mb-4 flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <Avatar className="h-8 w-8 border border-slate-200 shadow-sm dark:border-slate-700">
                                            {msg.role === 'assistant' ? (
                                                <>
                                                    <AvatarImage
                                                        src={
                                                            currentAgent.avatar
                                                        }
                                                    />
                                                    <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                                        <AgentIcon className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </>
                                            ) : (
                                                <AvatarFallback className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                                    M
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div
                                            className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}
                                        >
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {msg.role === 'assistant'
                                                    ? currentAgent.name
                                                    : 'Vous'}
                                            </span>
                                            <div
                                                className={cn(
                                                    'mt-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                                                    msg.role === 'user'
                                                        ? 'rounded-tr-md bg-emerald-600 text-white'
                                                        : 'rounded-tl-md bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
                                                )}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 flex gap-3"
                                    >
                                        <Avatar className="h-8 w-8 border border-slate-200 shadow-sm dark:border-slate-700">
                                            <AvatarImage
                                                src={currentAgent.avatar}
                                            />
                                            <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                                <AgentIcon className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 dark:bg-slate-800">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* =========================
    Input Premium Moderne
========================= */}
                        <div className="border-t border-slate-200/70 bg-linear-to-b from-white to-slate-50/80 px-4 py-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-950/80">
                            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-all duration-300 focus-within:border-emerald-400/70 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-black/20 dark:focus-within:border-emerald-500/60">
                                {/* Halo décoratif */}
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/70 to-transparent" />
                                <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />

                                {/* Header compact */}
                                <div className="flex items-center justify-between border-b border-slate-100/80 px-4 py-2.5 dark:border-slate-800/80">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/20">
                                            <AgentIcon className="h-4 w-4 text-white" />
                                        </div>

                                        <div className="leading-tight">
                                            <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                                {currentAgent.name}
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {currentAgent.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {input.trim().length > 0 && (
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                {input.length} caractères
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            En ligne
                                        </span>
                                    </div>
                                </div>

                                {/* Champ de saisie */}
                                <div className="px-3 pt-3">
                                    <textarea
                                        ref={
                                            inputRef as unknown as React.RefObject<HTMLTextAreaElement>
                                        }
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        placeholder="Posez votre question, demandez du code, un résumé ou une analyse..."
                                        rows={1}
                                        disabled={loading}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' &&
                                                !e.shiftKey
                                            ) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        className="max-h-40 min-h-22.5 w-full resize-none border-0 bg-transparent px-3 py-2 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                                    />
                                </div>

                                {/* Suggestions intelligentes */}
                                {!input.trim() && (
                                    <div className="px-4 pb-3">
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                'Créer du code Laravel',
                                                'Résumer un document',
                                                'Analyser des données',
                                                'Traduire en français',
                                            ].map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    onClick={() => {
                                                        setInput(suggestion);
                                                        inputRef.current?.focus();
                                                    }}
                                                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Footer Toolbar */}
                                <div className="flex items-center justify-between border-t border-slate-100/80 px-3 py-3 dark:border-slate-800/80">
                                    {/* Actions secondaires */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={clearChat}
                                            className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Effacer
                                        </button>

                                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                            Entrée pour envoyer
                                        </span>
                                    </div>

                                    {/* Bouton Envoyer */}
                                    <Button
                                        onClick={handleSend}
                                        disabled={loading || !input.trim()}
                                        className="h-10 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Envoyer
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                                L’assistant peut commettre des erreurs. Vérifiez
                                toujours les informations importantes avant
                                utilisation.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bouton flottant */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleOpen}
                className={cn(
                    'group relative flex h-10 w-10 items-center justify-center rounded-full shadow-2xl transition-all duration-300',
                    isOpen
                        ? 'rotate-90 bg-red-500 text-white'
                        : 'bg-emerald-600 text-white hover:shadow-emerald-500/25',
                )}
            >
                <span className="absolute inset-0 -z-10 rounded-full bg-inherit opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageSquare className="h-6 w-6" />
                )}
            </motion.button>
        </div>
    );
}
