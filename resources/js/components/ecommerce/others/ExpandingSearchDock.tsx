// 'use client';

// import { AnimatePresence, motion } from 'framer-motion';
// import { Search, X } from 'lucide-react';
// import { useState } from 'react';

// type ExpandingSearchDockProps = {
//     onSearch?: (query: string) => void;
//     placeholder?: string;
// };

// export function ExpandingSearchDock({
//     onSearch,
//     placeholder = 'Rechercher…',
// }: ExpandingSearchDockProps) {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [query, setQuery] = useState('');

//     const handleExpand = () => setIsExpanded(true);

//     const handleCollapse = () => {
//         setIsExpanded(false);
//         setQuery('');
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (onSearch && query.trim()) {
//             onSearch(query.trim());
//         }
//     };

//     return (
//         <div className="relative">
//             <AnimatePresence mode="wait">
//                 {!isExpanded ? (
//                     <motion.button
//                         key="icon"
//                         initial={{ scale: 0, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         exit={{ scale: 0, opacity: 0 }}
//                         onClick={handleExpand}
//                         className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200/60 bg-white text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-400 dark:hover:border-emerald-600 dark:hover:bg-slate-800"
//                     >
//                         <Search className="h-5 w-5" />
//                     </motion.button>
//                 ) : (
//                     <motion.form
//                         key="input"
//                         initial={{ width: 48, opacity: 0 }}
//                         animate={{ width: 320, opacity: 1 }}
//                         exit={{ width: 48, opacity: 0 }}
//                         transition={{
//                             type: 'spring',
//                             stiffness: 300,
//                             damping: 30,
//                         }}
//                         onSubmit={handleSubmit}
//                         className="relative"
//                     >
//                         <motion.div
//                             initial={{ backdropFilter: 'blur(0px)' }}
//                             animate={{ backdropFilter: 'blur(16px)' }}
//                             className="relative flex items-center gap-2 overflow-hidden rounded border border-emerald-200/70 bg-white/80 backdrop-blur-xl transition-colors focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-200 dark:border-slate-700 dark:bg-slate-900/80 dark:focus-within:border-emerald-500 dark:focus-within:ring-emerald-800"
//                         >
//                             <div className="ml-4">
//                                 <Search className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
//                             </div>
//                             <input
//                                 type="text"
//                                 value={query}
//                                 onChange={(e) => setQuery(e.target.value)}
//                                 placeholder={placeholder}
//                                 autoFocus
//                                 className="h-9 flex-1 bg-transparent pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
//                             />
//                             <motion.button
//                                 type="button"
//                                 onClick={handleCollapse}
//                                 initial={{ scale: 0 }}
//                                 animate={{ scale: 1 }}
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                                 className="mr-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
//                             >
//                                 <X className="h-4 w-4" />
//                             </motion.button>
//                         </motion.div>
//                     </motion.form>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

type ExpandingSearchDockProps = {
    onSearch?: (query: string) => void;
    placeholder?: string;
};

export function ExpandingSearchDock({
    onSearch,
    placeholder = 'Rechercher un produit, une commande…',
}: ExpandingSearchDockProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (query.trim()) {
            onSearch?.(query.trim());
        }
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        setQuery('');
    };

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.button
                        key="search-trigger"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setIsExpanded(true)}
                        className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 text-slate-600 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:text-emerald-600 hover:shadow-lg hover:shadow-emerald-100/50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-emerald-800/60 dark:hover:text-emerald-400"
                    >
                        <span className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <Search className="relative h-4.5 w-4.5" />
                    </motion.button>
                ) : (
                    <motion.form
                        key="search-form"
                        initial={{ width: 44, opacity: 0 }}
                        animate={{ width: 340, opacity: 1 }}
                        exit={{ width: 44, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 28,
                        }}
                        onSubmit={handleSubmit}
                        className="relative"
                    >
                        <div className="relative flex h-11 items-center overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-xl shadow-slate-900/5 backdrop-blur-2xl transition-all duration-300 focus-within:border-emerald-300 focus-within:shadow-emerald-100/50 dark:border-slate-800 dark:bg-slate-900/85 dark:focus-within:border-emerald-700 dark:focus-within:shadow-emerald-950/20">
                            {/* Glow */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] via-transparent to-emerald-500/[0.03]" />

                            <Search className="ml-4 h-4.5 w-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                            <input
                                type="text"
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={placeholder}
                                className="flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                            />

                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    className="mr-1 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleCollapse}
                                className="mr-1 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
