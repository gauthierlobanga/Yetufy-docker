// /* eslint-disable react-hooks/purity */
// import * as react from '@inertiajs/react';
// import { motion } from 'framer-motion';
// import { Building, Users, TrendingUp, MapPin, ArrowRight } from 'lucide-react';
// import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
// import Globe from 'react-globe.gl';
// import type { GlobeMethods } from 'react-globe.gl';
// import { Button } from '@/components/ui/button';
// import { useAppearance } from '@/hooks/use-appearance';
// import { route } from 'ziggy-js';

// // ----------------------------------------------------------------------
// // Types
// // ----------------------------------------------------------------------
// interface GlobePoint {
//     lat: number;
//     lng: number;
//     name: string;
//     value: number;
//     region: string;
// }

// interface GlobeArc {
//     startLat: number;
//     startLng: number;
//     endLat: number;
//     endLng: number;
// }

// interface GlobeStats {
//     countries: number;
//     properties: number;
//     clients: number;
// }

// export interface GlobeSectionProps {
//     globeData?: GlobePoint[];
//     arcsData?: GlobeArc[];
//     globeStats?: GlobeStats;
// }

// // ----------------------------------------------------------------------
// // Données de démonstration (fallback si aucune propriété géolocalisée)
// // ----------------------------------------------------------------------
// const FALLBACK_GLOBE_DATA: GlobePoint[] = [
//     { lat: -4.3, lng: 15.3, name: 'Kinshasa', value: 0, region: 'RDC' },
//     { lat: -11.7, lng: 27.5, name: 'Lusaka', value: 0, region: 'Zambie' },
//     {
//         lat: -33.9,
//         lng: 18.4,
//         name: 'Cape Town',
//         value: 0,
//         region: 'Afrique du Sud',
//     },
//     { lat: 48.8, lng: 2.3, name: 'Paris', value: 0, region: 'France' },
//     { lat: 40.7, lng: -74.0, name: 'New York', value: 0, region: 'USA' },
// ];

// const FALLBACK_ARCS_DATA: GlobeArc[] = [
//     { startLat: -4.3, startLng: 15.3, endLat: 48.8, endLng: 2.3 },
//     { startLat: -4.3, startLng: 15.3, endLat: 40.7, endLng: -74.0 },
// ];

// const FALLBACK_STATS: GlobeStats = { countries: 0, properties: 0, clients: 0 };

// // ----------------------------------------------------------------------
// // Composant principal
// // ----------------------------------------------------------------------
// export function GlobeSection({
//     globeData,
//     arcsData,
//     globeStats,
// }: GlobeSectionProps) {
//     const globeRef = useRef<GlobeMethods | undefined>(undefined);
//     const { resolvedAppearance } = useAppearance();
//     const isDark = resolvedAppearance === 'dark';
//     const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
//     const [isInteracting, setIsInteracting] = useState(false);
//     const [isGlobeHovered, setIsGlobeHovered] = useState(false);

//     const interactionTimeoutRef = useRef<number | null>(null);
//     const animationFrameRef = useRef<number | undefined>(undefined);

//     // Resolve effective data: prefer props, fallback to demo data
//     const effectiveGlobeData = useMemo(
//         () =>
//             globeData && globeData.length > 0 ? globeData : FALLBACK_GLOBE_DATA,
//         [globeData],
//     );
//     const effectiveArcsData = useMemo(
//         () => (arcsData && arcsData.length > 0 ? arcsData : FALLBACK_ARCS_DATA),
//         [arcsData],
//     );
//     const stats = useMemo(() => globeStats ?? FALLBACK_STATS, [globeStats]);

//     // ----------------------------------------------------------------------
//     // Animation fluide : rotation continue depuis la position actuelle
//     // Utilise des refs pour éviter de recréer la boucle à chaque changement d'état
//     // ----------------------------------------------------------------------
//     const isInteractingRef = useRef(isInteracting);
//     const isGlobeHoveredRef = useRef(isGlobeHovered);

//     useEffect(() => {
//         isInteractingRef.current = isInteracting;
//     }, [isInteracting]);

//     useEffect(() => {
//         isGlobeHoveredRef.current = isGlobeHovered;
//     }, [isGlobeHovered]);

//     const startAutoRotate = useCallback(() => {
//         if (animationFrameRef.current) {
//             cancelAnimationFrame(animationFrameRef.current);
//         }

//         const animate = () => {
//             // Pause si drag actif OU si la souris survole le globe
//             if (
//                 !globeRef.current ||
//                 isInteractingRef.current ||
//                 isGlobeHoveredRef.current
//             ) {
//                 animationFrameRef.current = requestAnimationFrame(animate);

//                 return;
//             }

//             // Lire la position actuelle du globe et incrémenter seulement lng
//             const current = globeRef.current.pointOfView();

//             globeRef.current.pointOfView(
//                 {
//                     lat: current.lat,
//                     lng: current.lng + 0.15,
//                     altitude: current.altitude,
//                 },
//                 0,
//             );

//             animationFrameRef.current = requestAnimationFrame(animate);
//         };

//         animationFrameRef.current = requestAnimationFrame(animate);
//     }, []);

//     const stopAutoRotate = () => {
//         if (animationFrameRef.current) {
//             cancelAnimationFrame(animationFrameRef.current);
//             animationFrameRef.current = undefined;
//         }
//     };

//     // Gestion des interactions souris/tactile (drag)
//     useEffect(() => {
//         const globe = globeRef.current;

//         if (!globe) {
//             return;
//         }

//         const canvas = globe.renderer()?.domElement;

//         if (!canvas) {
//             return;
//         }

//         const handleInteractionStart = () => {
//             setIsInteracting(true);

//             if (interactionTimeoutRef.current) {
//                 clearTimeout(interactionTimeoutRef.current);
//             }
//         };

//         const handleInteractionEnd = () => {
//             if (interactionTimeoutRef.current) {
//                 clearTimeout(interactionTimeoutRef.current);
//             }

//             interactionTimeoutRef.current = window.setTimeout(() => {
//                 setIsInteracting(false);
//             }, 150);
//         };

//         canvas.addEventListener('mousedown', handleInteractionStart);
//         canvas.addEventListener('mouseup', handleInteractionEnd);
//         canvas.addEventListener('touchstart', handleInteractionStart);
//         canvas.addEventListener('touchend', handleInteractionEnd);

//         return () => {
//             canvas.removeEventListener('mousedown', handleInteractionStart);
//             canvas.removeEventListener('mouseup', handleInteractionEnd);
//             canvas.removeEventListener('touchstart', handleInteractionStart);
//             canvas.removeEventListener('touchend', handleInteractionEnd);

//             if (interactionTimeoutRef.current) {
//                 clearTimeout(interactionTimeoutRef.current);
//             }

//             stopAutoRotate();
//         };
//     }, []);

//     // Démarrage initial (une seule fois)
//     useEffect(() => {
//         if (!globeRef.current) {
//             return;
//         }

//         // Position initiale uniquement au montage
//         globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 0);
//         startAutoRotate();

//         return () => stopAutoRotate();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     // ----------------------------------------------------------------------
//     // Accesseurs
//     // ----------------------------------------------------------------------
//     const pointColor = (point: any) =>
//         hoveredPoint === point.name
//             ? '#facc15' // Yellow on hover
//             : isDark
//               ? '#14b8a6' // Teal-400
//               : '#0f766e'; // Teal-700

//     const pointRadius = (point: any) =>
//         hoveredPoint === point.name ? 1.2 : 0.8;

//     const pointAltitude = () => 0.1;

//     const arcColor = () =>
//         isDark
//             ? ['rgba(94, 234, 212, 1)', 'rgba(20, 184, 166, 0)']
//             : ['rgba(13, 148, 136, 1)', 'rgba(15, 118, 110, 0)'];
//     const arcDashLength = () => 0.9;
//     const arcDashGap = () => 2;
//     const arcDashAnimateTime = () => 2000;

//     // ----------------------------------------------------------------------
//     // Rendu JSX
//     // ----------------------------------------------------------------------
//     return (
//         <>
//             <section className="relative overflow-hidden bg-white py-32 dark:bg-slate-950">
//                 {/* Arrière-plan artistique */}
//                 <div className="absolute inset-0 overflow-hidden">
//                     <div className="absolute top-1/2 -right-75 h-225 w-225 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[180px]" />
//                     <div className="absolute top-1/2 left-1/2 h-175 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[160px]" />
//                 </div>
//                 {Array.from({ length: 80 }).map((_, i) => (
//                     <motion.div
//                         key={i}
//                         animate={{ opacity: [0.2, 1, 0.2] }}
//                         transition={{
//                             duration: 2 + Math.random() * 4,
//                             repeat: Infinity,
//                         }}
//                         className="absolute rounded-full bg-white"
//                         style={{
//                             left: `${Math.random() * 100}%`,
//                             top: `${Math.random() * 100}%`,
//                             width: `${Math.random() * 3}px`,
//                             height: `${Math.random() * 3}px`,
//                         }}
//                     />
//                 ))}

//                 <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                     <div className="relative grid min-h-150 items-center gap-16 lg:grid-cols-2">
//                         {/* GLOBE 3D avec animations au survol */}
//                         <div
//                             className="pointer-events-auto absolute inset-0 z-0 hidden items-center justify-end lg:flex"
//                             onMouseEnter={() => setIsGlobeHovered(true)}
//                             onMouseLeave={() => setIsGlobeHovered(false)}
//                             style={{
//                                 transition:
//                                     'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
//                             }}
//                         >
//                             <div
//                                 className="relative h-full w-full max-w-2xl"
//                                 style={{
//                                     transform: isGlobeHovered
//                                         ? 'scale(1.02)'
//                                         : 'scale(1)',
//                                     transition: 'transform 0.4s ease-out',
//                                     cursor: isGlobeHovered ? 'grab' : 'default',
//                                 }}
//                             >
//                                 <div className="relative flex h-full w-full items-center justify-center bg-transparent">
//                                     <Globe
//                                         ref={globeRef}
//                                         width={1000}
//                                         height={1000}
//                                         backgroundColor="rgba(0, 0, 0, 0)"
//                                         globeImageUrl={
//                                             isDark
//                                                 ? '//unpkg.com/three-globe/example/img/earth-night.jpg'
//                                                 : '//unpkg.com/three-globe/example/img/earth-day.jpg'
//                                         }
//                                         bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
//                                         showAtmosphere
//                                         atmosphereColor="" // ✅ demandé : vide
//                                         atmosphereAltitude={0.3}
//                                         // Points
//                                         pointsData={effectiveGlobeData}
//                                         pointLat="lat"
//                                         pointLng="lng"
//                                         pointColor={pointColor}
//                                         pointRadius={pointRadius}
//                                         pointAltitude={pointAltitude}
//                                         pointResolution={16}
//                                         onPointHover={(point: any) =>
//                                             setHoveredPoint(point?.name || null)
//                                         }
//                                         // Arcs Sarcelle effet étoile filante
//                                         arcsData={effectiveArcsData}
//                                         arcStartLat="startLat"
//                                         arcStartLng="startLng"
//                                         arcEndLat="endLat"
//                                         arcEndLng="endLng"
//                                         arcColor={arcColor}
//                                         arcDashLength={arcDashLength()}
//                                         arcDashGap={arcDashGap()}
//                                         arcDashInitialGap={0}
//                                         arcDashAnimateTime={arcDashAnimateTime()}
//                                         arcStroke={0.3}
//                                         // HTML Elements (Floating Cards)
//                                         htmlElementsData={effectiveGlobeData}
//                                         htmlLat="lat"
//                                         htmlLng="lng"
//                                         htmlAltitude={0.12}
//                                         htmlElement={(d: any) => {
//                                             const el =
//                                                 document.createElement('div');
//                                             el.innerHTML = `
//                                                 <div style="position: absolute; left: -26px; top: -24px;">
//                                                     <div
//                                                         class="
//                                                             group
//                                                             pointer-events-auto
//                                                             relative
//                                                             flex
//                                                             cursor-pointer
//                                                             items-center
//                                                             gap-3
//                                                             rounded-full
//                                                             border
//                                                             border-white/20
//                                                             bg-white/20
//                                                             py-2
//                                                             pr-5
//                                                             pl-2.5
//                                                             shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]
//                                                             backdrop-blur-md
//                                                             transition-all
//                                                             duration-500
//                                                             hover:scale-[1.08]
//                                                             hover:border-teal-400/50
//                                                             hover:bg-white/30
//                                                             dark:border-white/10
//                                                             dark:bg-slate-900/40
//                                                             dark:hover:bg-slate-800/60
//                                                         "
//                                                     >
//                                                         <!-- Outer Glow behind the card on hover -->
//                                                         <div class="absolute inset-0 -z-10 rounded bg-teal-400/0 blur-md transition-all duration-500 group-hover:bg-teal-400/20"></div>

//                                                     <!-- The pulsating point / Radar effect -->
//                                                     <div class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white/40 dark:bg-slate-800/50">
//                                                         <!-- Radar ripples -->
//                                                         <span class="absolute h-full w-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-teal-400/60"></span>
//                                                         <span class="absolute h-full w-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_0.5s] rounded-full border border-teal-400/40"></span>

//                                                         <!-- Core dot -->
//                                                         <span class="relative h-2.5 w-2.5 rounded-full bg-linear-to-tr from-teal-500 to-cyan-300 shadow-[0_0_10px_rgba(45,212,191,0.8)] group-hover:animate-pulse"></span>
//                                                     </div>

//                                                     <!-- Info text -->
//                                                     <div class="flex flex-col justify-center">
//                                                         <span class="whitespace-nowrap text-[13px] font-bold tracking-wide text-slate-800 transition-colors group-hover:text-teal-600 dark:text-slate-100 dark:group-hover:text-teal-300">
//                                                             ${d.name}
//                                                         </span>
//                                                         ${
//                                                             d.region
//                                                                 ? `
//                                                         <span class="-mt-0.5 text-[9px] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
//                                                             ${d.region}
//                                                         </span>
//                                                         `
//                                                                 : ''
//                                                         }
//                                                     </div>

//                                                     <!-- Badge -->
//                                                     ${
//                                                         d.value > 0
//                                                             ? `
//                                                     <div class="ml-1 flex items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-black text-teal-700 ring-1 ring-inset ring-teal-500/30 backdrop-blur-sm dark:text-teal-300">
//                                                         ${d.value}
//                                                     </div>
//                                                     `
//                                                             : ''
//                                                     }
//                                                 </div>
//                                                 </div>
//                                             `;

//                                             return el;
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Contenu texte (inchangé) */}
//                         <motion.div
//                             initial={{ opacity: 0, x: -40 }}
//                             whileInView={{ opacity: 1, x: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ duration: 0.8 }}
//                             className="pointer-events-auto relative z-20"
//                         >
//                             <div className="mb-6 h-1 w-12 bg-teal-600 dark:bg-teal-500" />
//                             <h2 className="mb-6 text-4xl leading-[1.1] font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
//                                 Présence{' '}
//                                 <span className="text-teal-600 dark:text-teal-500">
//                                     mondiale
//                                 </span>
//                                 <br />
//                                 dans l'immobilier
//                             </h2>
//                             <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
//                                 Explorez nos opportunités immobilières dans les
//                                 plus grandes villes du monde. De Kinshasa à New
//                                 York, nous connectons investisseurs et
//                                 propriétés d'exception.
//                             </p>

//                             <div className="mb-12 space-y-6">
//                                 {[
//                                     {
//                                         icon: Building,
//                                         title: `${stats.countries}+ Pays`,
//                                         desc: 'Présence internationale',
//                                     },
//                                     {
//                                         icon: Users,
//                                         title: `${stats.properties}+ Propriétés`,
//                                         desc: 'Portefeuille diversifié',
//                                     },
//                                     {
//                                         icon: TrendingUp,
//                                         title: '+350% ROI',
//                                         desc: 'Potentiel de rendement',
//                                     },
//                                 ].map((item, i) => {
//                                     const Icon = item.icon;

//                                     return (
//                                         <motion.div
//                                             key={i}
//                                             initial={{ opacity: 0, x: -20 }}
//                                             whileInView={{ opacity: 1, x: 0 }}
//                                             viewport={{ once: true }}
//                                             transition={{ delay: i * 0.1 }}
//                                             className="flex gap-4"
//                                         >
//                                             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
//                                                 <Icon className="h-6 w-6" />
//                                             </div>
//                                             <div>
//                                                 <h4 className="font-semibold text-slate-900 dark:text-white">
//                                                     {item.title}
//                                                 </h4>
//                                                 <p className="text-sm text-slate-500 dark:text-slate-400">
//                                                     {item.desc}
//                                                 </p>
//                                             </div>
//                                         </motion.div>
//                                     );
//                                 })}
//                             </div>

//                             {/* Pilules flottantes */}
//                             <div className="mb-12 flex flex-wrap gap-3">
//                                 <motion.div
//                                     animate={{ y: [0, -8, 0] }}
//                                     transition={{
//                                         repeat: Infinity,
//                                         duration: 4,
//                                         ease: 'easeInOut',
//                                     }}
//                                     className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-4 py-2 backdrop-blur-md dark:border-slate-800/30 dark:bg-slate-900/60"
//                                 >
//                                     <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
//                                         <MapPin className="h-4 w-4" />
//                                     </div>
//                                     <span className="text-sm font-bold text-slate-900 dark:text-white">
//                                         {stats.countries} pays
//                                     </span>
//                                 </motion.div>
//                                 <motion.div
//                                     animate={{ y: [0, -6, 0] }}
//                                     transition={{
//                                         repeat: Infinity,
//                                         duration: 4,
//                                         delay: 0.3,
//                                         ease: 'easeInOut',
//                                     }}
//                                     className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-4 py-2 backdrop-blur-md dark:border-slate-800/30 dark:bg-slate-900/60"
//                                 >
//                                     <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
//                                         <Building className="h-4 w-4" />
//                                     </div>
//                                     <span className="text-sm font-bold text-slate-900 dark:text-white">
//                                         {stats.properties}+ Biens
//                                     </span>
//                                 </motion.div>
//                                 <motion.div
//                                     animate={{ y: [0, -5, 0] }}
//                                     transition={{
//                                         repeat: Infinity,
//                                         duration: 4,
//                                         delay: 0.6,
//                                         ease: 'easeInOut',
//                                     }}
//                                     className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-4 py-2 backdrop-blur-md dark:border-slate-800/30 dark:bg-slate-900/60"
//                                 >
//                                     <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white">
//                                         <Users className="h-4 w-4" />
//                                     </div>
//                                     <span className="text-sm font-bold text-slate-900 dark:text-white">
//                                         {stats.clients}+ Clients
//                                     </span>
//                                 </motion.div>
//                             </div>

//                             <Button
//                                 size="lg"
//                                 className="h-14 rounded-full bg-teal-600 px-8 text-white shadow-xl shadow-teal-500/20 transition-all hover:scale-105 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
//                                 asChild
//                             >
//                                 <react.Link href={route('properties.index')}>
//                                     Découvrir nos offres mondiales
//                                     <ArrowRight className="ml-2 h-5 w-5" />
//                                 </react.Link>
//                             </Button>
//                         </motion.div>
//                     </div>
//                 </div>
//                 {/* Section Chiffres (Design Premium) */}
//                 <section className="py-32">
//                     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                         <div className="mb-20 grid gap-12 text-center md:grid-cols-3">
//                             <div>
//                                 <p className="text-6xl leading-[1.1] font-semibold tracking-tight text-teal-600 dark:text-teal-500">
//                                     {stats.properties}+
//                                 </p>
//                                 <p className="mt-4 text-lg font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
//                                     Biens Exclusifs
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-6xl leading-[1.1] font-semibold tracking-tight text-teal-600 dark:text-teal-500">
//                                     98%
//                                 </p>
//                                 <p className="mt-4 text-lg font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
//                                     Taux de Satisfaction
//                                 </p>
//                             </div>
//                             <div>
//                                 <p className="text-6xl leading-[1.1] font-semibold tracking-tight text-teal-600 dark:text-teal-500">
//                                     24h
//                                 </p>
//                                 <p className="mt-4 text-lg font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
//                                     Délai de Réponse
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="rounded-[3rem] border border-slate-200 bg-white p-12 text-center shadow-xl dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-xl">
//                             <h3 className="text-3xl leading-[1.1] font-semibold tracking-tight text-slate-900 dark:text-white">
//                                 Pourquoi nous faire confiance ?
//                             </h3>
//                             <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
//                                 Nous sommes bien plus qu'une simple agence. Nous
//                                 sommes vos partenaires pour construire votre
//                                 avenir en RDC. Sécurité juridique, expertise
//                                 locale et support sans faille.
//                             </p>
//                         </div>
//                     </div>
//                 </section>
//             </section>
//         </>
//     );
// }
