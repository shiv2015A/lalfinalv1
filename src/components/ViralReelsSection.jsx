// src/components/ViralReelsSection.jsx
import React from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, Play, Heart, ShoppingBag, Eye, Volume2 } from 'lucide-react';

export default function ViralReelsSection() {
  const { setSelectedProduct, products } = useStore();

  const viralPosts = [
    {
      id: 1,
      creator: '@ananya.couture',
      caption: 'The way this chinon mirror work shines under the lights ✨ Unboxing @labelandloom',
      views: '482K',
      likes: '34.2K',
      image: '/uploads/product-1-main.jpg',
      audio: 'Original Audio • Indian Aesthetic',
      productId: 'prod-1'
    },
    {
      id: 2,
      creator: '@meera_ethnic',
      caption: 'Found the most aesthetic wine georgette palazzo set on reels! Link in bio 🍷',
      views: '310K',
      likes: '28.9K',
      image: '/uploads/product-2-main.jpg',
      audio: 'Trending Audio • Sitar Lo-Fi',
      productId: 'prod-2'
    },
    {
      id: 3,
      creator: '@tanya_aesthetic',
      caption: 'POV: Wearing pure handloom khadi with hot pink rani dupatta for day haldi 🌸',
      views: '620K',
      likes: '51.4K',
      image: '/uploads/product-3-main.jpg',
      audio: 'Viral Punjabi • Acoustic Folk',
      productId: 'prod-3'
    },
    {
      id: 4,
      creator: '@diya.looks',
      caption: 'Royal festive vibes with real mirror bustier! Compliments all evening ❤️',
      views: '290K',
      likes: '22.1K',
      image: '/uploads/product-1-closeup.jpg',
      audio: 'Original Voice • Lookbook',
      productId: 'prod-1'
    }
  ];

  const handlePostClick = (prodId) => {
    const prod = products.find(p => p.id === prodId) || products[0];
    if (prod) setSelectedProduct(prod);
  };

  return (
    <section className="py-14 bg-ivory border-b border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <Flame className="w-4 h-4 fill-current" />
              <span>Viral On Instagram &amp; Pinterest</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-charcoal">
              Styled by Creators &amp; Our Muses
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/60 mt-1">
              Tag <span className="font-semibold text-brand-600">@labelandloom</span> on Instagram to be featured on our viral wall!
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 underline flex items-center gap-1 self-start sm:self-auto"
          >
            Follow @labelandloom ↗
          </a>
        </div>

        {/* Reels Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {viralPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.productId)}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-charcoal"
            >
              <img
                src={post.image}
                alt={post.creator}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80";
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-black/30 pointer-events-none" />

              {/* Top Bar: Play Icon & Views */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between text-white text-[11px] font-bold">
                <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                  <Play className="w-2.5 h-2.5 fill-current" /> {post.views}
                </span>
                <span className="flex items-center gap-1 text-gold-300">
                  <Heart className="w-3.5 h-3.5 fill-current text-rose-500" /> {post.likes}
                </span>
              </div>

              {/* Center Play Button on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-700 shadow-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3 inset-x-3 text-white space-y-1">
                <p className="text-xs font-bold text-gold-300">{post.creator}</p>
                <p className="text-[11px] text-white/90 line-clamp-2 leading-tight">
                  {post.caption}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-white/70 pt-1">
                  <Volume2 className="w-3 h-3 text-gold-400" />
                  <span className="truncate">{post.audio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

