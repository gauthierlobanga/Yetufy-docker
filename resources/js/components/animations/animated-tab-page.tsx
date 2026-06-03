// import { Button } from '@/components/ui/button';
// import { AnimatedTab } from './animated-tab';

// export default function AnimatedTabPage({ categories }) {
//     return (
//         <AnimatedTab
//             tabs={[
//                 {
//                     name: 'Toutes',
//                     content: <CategoryGrid categories={categories} />,
//                 },
//                 ...categories.map((cat) => ({
//                     name: cat.nom,
//                     content: <CategoryProducts category={cat} />,
//                 })),
//             ]}
//         />
//     );
// }

// function CategoryGrid({ categories }) {
//     return (
//         <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
//             {categories.map((cat) => (
//                 <div
//                     key={cat.id}
//                     className="group cursor-pointer rounded-xl border p-4 transition hover:shadow-lg"
//                 >
//                     <img src={cat.image} className="mx-auto mb-2 h-12" />
//                     <p className="text-center text-sm font-medium">{cat.nom}</p>
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default function ProducstList({ title, products }) {
//     return (
//         <section className="py-16">
//             <div className="mx-auto max-w-7xl px-4">
//                 <h2 className="mb-6 text-2xl font-bold">{title}</h2>

//                 <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//                     {products.map((product) => (
//                         <ProductCard key={product.id} product={product} />
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }

// function ProductCard({ product }) {
//     return (
//         <div className="group overflow-hidden rounded-xl border bg-white transition hover:shadow-xl">
//             {/* IMAGE */}
//             <div className="relative aspect-square overflow-hidden">
//                 <img
//                     src={product.image_principale}
//                     className="h-full w-full object-cover transition group-hover:scale-110"
//                 />

//                 {product.est_en_promotion && (
//                     <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
//                         -{product.reduction_pourcentage}%
//                     </span>
//                 )}
//             </div>

//             {/* CONTENT */}
//             <div className="space-y-2 p-4">
//                 <h3 className="line-clamp-2 text-sm font-medium">
//                     {product.nom}
//                 </h3>

//                 {/* PRICE */}
//                 <div className="flex items-center gap-2">
//                     <span className="text-lg font-bold text-primary">
//                         {product.prix_actuel} €
//                     </span>

//                     {product.est_en_promotion && (
//                         <span className="text-sm text-gray-400 line-through">
//                             {product.prix_ttc} €
//                         </span>
//                     )}
//                 </div>

//                 {/* RATING */}
//                 <div className="text-xs text-yellow-500">
//                     ⭐ {product.note_moyenne} ({product.nombre_avis})
//                 </div>
//             </div>
//         </div>
//     );
// }
