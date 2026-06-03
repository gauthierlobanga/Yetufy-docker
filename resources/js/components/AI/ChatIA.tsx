/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Components/AIChatInterface.tsx
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    ArrowUpRight,
    ChevronDown,
    Clock,
    History,
    Link2,
    Mail,
    MessageSquare,
    Share2,
    Sparkles,
    Star,
    Trash2,
    Zap,
} from 'lucide-react';
import { Copy, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
type DropdownType = 'share' | 'quick' | 'history' | 'magic' | 'model' | null;

type ActionOption = {
    icon: typeof Link2;
    label: string;
    action: string;
};

const shareOptions: ActionOption[] = [
    { icon: Link2, label: 'Copier le lien', action: 'copy-link' },
    { icon: Mail, label: 'Email', action: 'email' },
    { icon: MessageSquare, label: 'Slack', action: 'slack' },
];

const quickOptions: ActionOption[] = [
    { icon: Sparkles, label: 'Résumer', action: 'summarize' },
    { icon: Sparkles, label: 'Améliorer', action: 'improve' },
    { icon: Sparkles, label: 'Traduire', action: 'translate' },
];

const historyOptions: ActionOption[] = [
    { icon: Clock, label: 'Dernière heure', action: 'history-1h' },
    { icon: Clock, label: "Aujourd'hui", action: 'history-today' },
    { icon: Clock, label: 'Cette semaine', action: 'history-week' },
];

const magicOptions: ActionOption[] = [
    { icon: Sparkles, label: 'Auto-complétion', action: 'magic-complete' },
    { icon: Sparkles, label: 'Scénario', action: 'magic-storyboard' },
    { icon: Sparkles, label: 'Reformuler', action: 'magic-rephrase' },
];

const models = ['Gemini 2.5 Pro', 'GPT-4o', 'Claude 3.5 Sonnet'];

export function ChatIA() {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
    const [selectedModel, setSelectedModel] = useState(models[0]);
    const prefersReducedMotion = useReducedMotion();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<
        { role: string; content: string }[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const shouldAnimate = !prefersReducedMotion;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [inputValue]);

    const handleSend = async () => {
        if (!inputValue.trim()) {
            return;
        }

        const userMessage = { role: 'user', content: inputValue.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
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
                    message: inputValue.trim(),
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
        } catch (err) {
            toast.error('Impossible de contacter l’assistant.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([]);
        setConversationId(null);
        toast.success('Conversation effacée.');
    };

    const executeAction = (action: string) => {
        setActiveDropdown(null);
        // Pré-remplir le champ avec une instruction en fonction de l'action
        const prompts: Record<string, string> = {
            summarize: 'Résume ce qui suit : ',
            improve: 'Améliore le texte suivant : ',
            translate: 'Traduis en français : ',
            'magic-complete': 'Complète la phrase : ',
            'magic-storyboard': 'Crée un storyboard pour : ',
            'magic-rephrase': 'Reformule : ',
        };

        if (prompts[action]) {
            setInputValue(prompts[action]);
        }

        textareaRef.current?.focus();
    };

    const renderDropdown = (
        type: DropdownType,
        options: ActionOption[],
        align: 'left' | 'right' = 'left',
    ) => (
        <AnimatePresence>
            {activeDropdown === type && (
                <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{
                        duration: 0.18,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`absolute bottom-full mb-2 ${align === 'right' ? 'right-0' : 'left-0'} z-[999] w-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-black/40`}
                    role="menu"
                >
                    {/* Header du menu */}
                    <div className="px-3 pt-1 pb-2">
                        <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500">
                            Actions disponibles
                        </p>
                    </div>

                    {/* Liste des options */}
                    <div className="space-y-1">
                        {options.map((option) => (
                            <button
                                key={option.action}
                                type="button"
                                role="menuitem"
                                onClick={() => executeAction(option.action)}
                                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-950/40 dark:group-hover:text-emerald-300">
                                    <option.icon className="h-4 w-4" />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {option.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="flex flex-col rounded-2xl border border-emerald-200/70 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
            {/* En-tête */}
            <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Assistant Yetu
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Propulsé par {selectedModel}
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title="Effacer la conversation"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* ===================== Message Assistant Premium ===================== */}
            {messages.map((msg, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                    {/* Avatar assistant */}
                    {msg.role === 'assistant' && (
                        <div className="mt-1 mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-sm">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                    )}

                    {/* Message utilisateur */}
                    {msg.role === 'user' && (
                        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-emerald-600 px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                            {msg.content}
                        </div>
                    )}

                    {/* Message assistant premium */}
                    {msg.role === 'assistant' && (
                        <div className="group max-w-[85%]">
                            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900">
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600">
                                            <Sparkles className="h-3.5 w-3.5 text-white" />
                                        </div>

                                        <div className="flex flex-col leading-tight">
                                            <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                                Assistant Yetu
                                            </span>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                                {selectedModel}
                                            </span>
                                        </div>
                                    </div>

                                    <CopyButton text={msg.content} />
                                </div>

                                {/* Contenu */}
                                <div className="px-4 py-4">
                                    <div className="prose prose-sm max-w-none prose-slate dark:prose-invert prose-p:leading-7 prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-700 prose-pre:bg-slate-950">
                                        <FormattedMessage
                                            content={msg.content}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Avatar utilisateur */}
                    {msg.role === 'user' && (
                        <div className="mt-1 ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            <span className="text-xs font-bold">M</span>
                        </div>
                    )}
                </motion.div>
            ))}

            {/* ===================== Zone de saisie IA Premium ===================== */}
            <div className="border-t border-slate-200/70 bg-linear-to-b from-white to-slate-50/70 px-5 py-5 dark:border-slate-800 dark:from-slate-950 dark:to-slate-950/80">
                <div
                    className={`group relative overflow-visible rounded-3xl border bg-white/95 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition-all duration-300 dark:bg-slate-900/95 dark:shadow-black/20 ${
                        isFocused
                            ? 'border-emerald-400/70 ring-4 ring-emerald-500/10 dark:border-emerald-500/60 dark:ring-emerald-500/10'
                            : 'border-slate-200/80 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                >
                    {/* Halo décoratif */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/70 to-transparent" />
                    <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />

                    {/* Header du prompt */}
                    <div className="flex items-center justify-between border-b border-slate-100/80 px-4 py-3 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/20">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>

                            <div className="flex flex-col leading-tight">
                                <span className="text-xs font-semibold tracking-wide text-slate-900 uppercase dark:text-white">
                                    Prompt IA
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {selectedModel}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {inputValue.trim().length > 0 && (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                    {inputValue.length} caractères
                                </span>
                            )}

                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                En ligne
                            </span>
                        </div>
                    </div>

                    {/* Textarea */}
                    <div className="px-3 pt-3">
                        <Textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Décrivez votre besoin… génération de contenu, code, analyse, résumé ou traduction."
                            className="max-h-65 min-h-27.5 w-full resize-none border-0 bg-transparent px-3 py-3 text-sm leading-7 text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-slate-100 dark:placeholder:text-slate-500"
                            rows={1}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                    </div>

                    {/* Suggestions rapides */}
                    {!inputValue.trim() && (
                        <div className="px-4 pb-3">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'Résumer un document',
                                    'Générer du code Laravel',
                                    'Créer une stratégie marketing',
                                    'Traduire en français',
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => {
                                            setInputValue(suggestion);
                                            textareaRef.current?.focus();
                                        }}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div
                        ref={dropdownRef}
                        className="flex flex-wrap items-center gap-2 border-t border-slate-100/80 px-3 py-3 dark:border-slate-800/80"
                    >
                        {/* Boutons actions */}
                        <div className="relative">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                    setActiveDropdown(
                                        activeDropdown === 'quick'
                                            ? null
                                            : 'quick',
                                    )
                                }
                                className="h-9 rounded-xl border border-transparent px-3 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-400 dark:hover:border-emerald-900/40 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-300"
                            >
                                <Zap className="mr-2 h-4 w-4" />
                                Rapide
                            </Button>
                            {renderDropdown('quick', quickOptions)}
                        </div>

                        <div className="relative">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                    setActiveDropdown(
                                        activeDropdown === 'magic'
                                            ? null
                                            : 'magic',
                                    )
                                }
                                className="h-9 rounded-xl border border-transparent px-3 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-400 dark:hover:border-emerald-900/40 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-300"
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Magic
                            </Button>
                            {renderDropdown('magic', magicOptions)}
                        </div>

                        <div className="relative">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                    setActiveDropdown(
                                        activeDropdown === 'history'
                                            ? null
                                            : 'history',
                                    )
                                }
                                className="h-9 rounded-xl border border-transparent px-3 text-slate-600 hover:border-slate-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                            >
                                <History className="mr-2 h-4 w-4" />
                                Historique
                            </Button>
                            {renderDropdown('history', historyOptions)}
                        </div>

                        {/* Spacer */}
                        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />

                        {/* Sélecteur modèle */}
                        <div className="relative ml-auto">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                    setActiveDropdown(
                                        activeDropdown === 'model'
                                            ? null
                                            : 'model',
                                    )
                                }
                                className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                            >
                                {selectedModel}
                                <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
                            </Button>

                            {/* Votre dropdown modèle existant */}
                        </div>

                        {/* Bouton envoyer */}
                        <Button
                            onClick={handleSend}
                            disabled={loading || !inputValue.trim()}
                            className="h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-600/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <ArrowUpRight className="mr-2 h-4 w-4" />
                                    Envoyer
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormattedMessage({ content }: { content: string }) {
    // Parse les retours à la ligne, le gras (**), les listes simples (-), les blocs de code (```)
    const renderContent = () => {
        const lines = content.split('\n');
        const elements: JSX.Element[] = [];
        let inCodeBlock = false;
        let codeLines: string[] = [];

        lines.forEach((line, index) => {
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    elements.push(
                        <pre
                            key={`code-${index}`}
                            className="my-2 overflow-x-auto rounded-lg bg-slate-800 p-3 text-xs text-emerald-200 dark:bg-slate-700"
                        >
                            <code>{codeLines.join('\n')}</code>
                        </pre>,
                    );
                    codeLines = [];
                    inCodeBlock = false;
                } else {
                    inCodeBlock = true;
                }

                return;
            }

            if (inCodeBlock) {
                codeLines.push(line);

                return;
            }

            if (line.startsWith('- ')) {
                elements.push(
                    <li
                        key={index}
                        className="ml-4 list-disc text-sm leading-relaxed"
                    >
                        <BoldText text={line.replace(/^- /, '')} />
                    </li>,
                );
            } else if (line === '') {
                elements.push(<div key={index} className="h-2" />);
            } else {
                elements.push(
                    <p key={index} className="text-sm leading-relaxed">
                        <BoldText text={line} />
                    </p>,
                );
            }
        });

        // Fermer un bloc de code éventuellement non fermé
        if (inCodeBlock && codeLines.length > 0) {
            elements.push(
                <pre
                    key="final-code"
                    className="my-2 overflow-x-auto rounded-lg bg-slate-800 p-3 text-xs text-emerald-200 dark:bg-slate-700"
                >
                    <code>{codeLines.join('\n')}</code>
                </pre>,
            );
        }

        return elements;
    };

    return <div className="space-y-1">{renderContent()}</div>;
}

// Petit helper pour gérer le texte en gras **...**
function BoldText({ text }: { text: string }) {
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return (
        <>
            {parts.map((part, i) =>
                part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={i} className="font-semibold text-current">
                        {part.slice(2, -2)}
                    </strong>
                ) : (
                    <span key={i}>{part}</span>
                ),
            )}
        </>
    );
}

// ===================== Copy Button Premium =====================
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Réponse copiée dans le presse-papiers.');

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
            {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </Button>
    );
}
