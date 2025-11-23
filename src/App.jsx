import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Menu, Star, Check, Instagram, Facebook, Twitter, ArrowRight, Hammer, Globe, ShieldCheck, Mail, MapPin, Phone, Crown } from 'lucide-react';

// --- REAL PRODUCT DATA (Incorporating All Images) ---
const PRODUCTS = [
  // --- KNIVES (Previous Items) ---
  { id: 101, name: "The Royal Chef", price: 185, category: "Knives", image: "/images/royal-chef.jpg", description: "Hand-forged using premium Korean POSCO stainless steel." },
  { id: 102, name: "Forged Santoku", price: 210, category: "Knives", image: "/images/santoku.jpg", description: "Precision forged blade. A tribute to our 1970 heritage." },
  { id: 103, name: "Noir Steak Knives", price: 145, category: "Knives", image: "/images/noir-steak.jpg", description: "Set of 4 forged steak knives. Heavy gauge steel." },
  { id: 104, name: "Artisan Paring Knife", price: 85, category: "Knives", image: "/images/paring.jpg", description: "Essential 3.5-inch forged blade. Sharp and precise." },

  // --- GOLD SETS ---
  { id: 1, name: "Armesh Gold", price: 340, category: "Gold", image: "/images/Armesh Gold.jpg", description: "Intricate detailing with a luxurious gold finish." },
  { id: 2, name: "Batavia Gold", price: 320, category: "Gold", image: "/images/Batavia Gold.jpg", description: "Classic curves meeting royal gold elegance." },
  { id: 3, name: "Beatrix Gold", price: 330, category: "Gold", image: "/images/Beatrix Gold.jpg", description: "Sophisticated and regal, perfect for grand banquets." },
  { id: 4, name: "Bradford Gold", price: 310, category: "Gold", image: "/images/Bradford Gold.jpg", description: "Strong, bold lines with a premium gold coating." },
  { id: 5, name: "Bree Gold", price: 300, category: "Gold", image: "/images/Bree Gold.jpg", description: "Minimalist design elevated by a warm gold tone." },
  { id: 6, name: "Cassiopeia Brushed Gold", price: 350, category: "Gold", image: "/images/Cassiopeia Brushed Gold.jpg", description: "Stunning brushed texture that catches the light beautifully." },
  { id: 7, name: "Charles Gold", price: 325, category: "Gold", image: "/images/Charles Gold.jpg", description: "Traditional grandeur with a modern gold twist." },
  { id: 8, name: "Claire Gold", price: 315, category: "Gold", image: "/images/Claire Gold.jpg", description: "Delicate and refined, a jewel for your table." },
  { id: 9, name: "Diggory Brushed Gold", price: 345, category: "Gold", image: "/images/Diggory Brushed Gold.jpg", description: "Rustic forged texture with a matte gold finish." },
  { id: 10, name: "Eira Gold", price: 335, category: "Gold", image: "/images/Eira Gold.jpg", description: "Inspired by winter light, glowing in gold." },
  { id: 11, name: "Espen Gold", price: 320, category: "Gold", image: "/images/Espen Gold.jpg", description: "Nature-inspired durability in a precious metal finish." },
  { id: 12, name: "Ivy Gold", price: 325, category: "Gold", image: "/images/Ivy Gold.jpg", description: "Organic flowing lines wrapped in gold." },
  { id: 13, name: "Jacob Gold", price: 310, category: "Gold", image: "/images/Jacob Gold.jpg", description: "Timeless simplicity for the modern king." },
  { id: 14, name: "Jaime Gold", price: 340, category: "Gold", image: "/images/Jaime Gold.jpg", description: "Bold and substantial, a statement piece." },
  { id: 15, name: "Jambi Gold", price: 330, category: "Gold", image: "/images/Jambi Gold.jpg", description: "Exotic inspiration with a flawless gold polish." },
  { id: 16, name: "Kaizen Gold", price: 350, category: "Gold", image: "/images/Kaizen Gold.jpg", description: "Continuous improvement in design, realized in gold." },
  { id: 17, name: "Karina Gold", price: 325, category: "Gold", image: "/images/Karina Gold.jpg", description: "Graceful and elegant, fit for a queen." },
  { id: 18, name: "Lucius Gold", price: 345, category: "Gold", image: "/images/Lucius Gold.jpg", description: "Light and brilliant, illuminating the dining experience." },
  { id: 19, name: "Mercy Gold", price: 315, category: "Gold", image: "/images/Mercy Gold.jpg", description: "Soft edges and a comforting grip in gold." },
  { id: 20, name: "Moon Gold", price: 360, category: "Gold", image: "/images/Moon Gold.jpg", description: "Our signature set. Celestial beauty in 24k gold finish." },
  { id: 21, name: "Murray Gold", price: 310, category: "Gold", image: "/images/Murray Gold.jpg", description: "Sturdy and reliable with a touch of luxury." },
  { id: 22, name: "Neville Gold", price: 320, category: "Gold", image: "/images/Neville Gold.jpg", description: "Classic heritage design in a warm gold hue." },
  { id: 23, name: "Noah Brushed Gold", price: 340, category: "Gold", image: "/images/Noah Brushed Gold.jpg", description: "Contemporary brushed finish for a modern table." },
  { id: 24, name: "Pandora Gold", price: 355, category: "Gold", image: "/images/Pandora Gold.jpg", description: "Unleash luxury with this premium heavy-gauge set." },
  { id: 25, name: "Sander Brushed Gold", price: 330, category: "Gold", image: "/images/Sander Brushed Gold.jpg", description: "Matte gold perfection for the industrial chic home." },
  { id: 26, name: "Sienna Gold", price: 325, category: "Gold", image: "/images/Sienna Gold.jpg", description: "Warm and inviting, like the Italian sun." },
  { id: 27, name: "Tucson Gold", price: 315, category: "Gold", image: "/images/Tucson Gold.jpg", description: "Rugged elegance with a refined gold layer." },
  { id: 28, name: "Umbridge Gold", price: 335, category: "Gold", image: "/images/Umbridge Gold.jpg", description: "Strictly superior quality and shine." },
  { id: 29, name: "Vermilio Gold", price: 340, category: "Gold", image: "/images/Vermilio Gold.jpg", description: "Vibrant and striking, the center of attention." },
  { id: 30, name: "Xena Faceted Gold", price: 370, category: "Gold", image: "/images/Xena Faceted Gold.jpg", description: "Geometric facets reflect light like diamonds." },
  { id: 31, name: "Zoya Gold", price: 325, category: "Gold", image: "/images/Zoya Gold.jpg", description: "Life and brilliance in a forged gold silhouette." },

  // --- SILVER SETS ---
  { id: 51, name: "Armesh", price: 240, category: "Silver", image: "/images/Armesh.jpg", description: "Intricate detailing in pure polished stainless steel." },
  { id: 52, name: "Batavia", price: 220, category: "Silver", image: "/images/Batavia.jpg", description: "Classic curves tailored for the silver purist." },
  { id: 53, name: "Beatrix", price: 230, category: "Silver", image: "/images/Beatrix.jpg", description: "Sophisticated stainless steel, mirror polished." },
  { id: 54, name: "Bolton Brushed", price: 250, category: "Silver", image: "/images/Bolton Brushed.jpg", description: "Textured brushed steel that hides fingerprints." },
  { id: 55, name: "Bradford", price: 210, category: "Silver", image: "/images/Bradford.jpg", description: "Strong, bold lines in heavy gauge steel." },
  { id: 56, name: "Bree", price: 200, category: "Silver", image: "/images/Bree.jpg", description: "Minimalist design for the modern home." },
  { id: 57, name: "Camille", price: 215, category: "Silver", image: "/images/Camille.jpg", description: "Elegant and fluid, like liquid silver." },
  { id: 58, name: "Cassiopeia Brushed", price: 260, category: "Silver", image: "/images/Cassiopeia Brushed.jpg", description: "Stardust texture in a cool silver tone." },
  { id: 59, name: "Celeste", price: 225, category: "Silver", image: "/images/Celeste.jpg", description: "Heavenly balance and shine." },
  { id: 60, name: "Charles", price: 235, category: "Silver", image: "/images/Charles.jpg", description: "A royal classic in pure steel." },
  { id: 61, name: "Claire", price: 215, category: "Silver", image: "/images/Claire.jpg", description: "Delicate refinement for fine dining." },
  { id: 62, name: "Diggory Brushed", price: 255, category: "Silver", image: "/images/Diggory Brushed.jpg", description: "Rustic forged texture with a matte finish." },
  { id: 63, name: "Eira", price: 235, category: "Silver", image: "/images/Eira.jpg", description: "Cool and crisp as winter snow." },
  { id: 64, name: "Espen", price: 220, category: "Silver", image: "/images/Espen.jpg", description: "Nature-inspired durability." },
  { id: 65, name: "Gaius", price: 240, category: "Silver", image: "/images/Gaius.jpg", description: "Commanding presence on any table." },
  { id: 66, name: "Ivy", price: 225, category: "Silver", image: "/images/Ivy.jpg", description: "Organic lines winding through the design." },
  { id: 67, name: "Jacob", price: 210, category: "Silver", image: "/images/Jacob.jpg", description: "Simple, honest, and built to last." },
  { id: 68, name: "Jaime", price: 240, category: "Silver", image: "/images/Jaime.jpg", description: "Bold and substantial stainless steel." },
  { id: 69, name: "Jambi", price: 230, category: "Silver", image: "/images/Jambi.jpg", description: "Exotic inspiration in polished steel." },
  { id: 70, name: "Kaizen", price: 250, category: "Silver", image: "/images/Kaizen.jpg", description: "Continuous improvement in steel crafting." },
  { id: 71, name: "Karina", price: 225, category: "Silver", image: "/images/Karina.jpg", description: "Graceful elegance." },
  { id: 72, name: "Lucius", price: 245, category: "Silver", image: "/images/Lucius.jpg", description: "Light and brilliant mirror finish." },
  { id: 73, name: "Mercy", price: 215, category: "Silver", image: "/images/Mercy.jpg", description: "Soft edges for a comfortable grip." },
  { id: 74, name: "Moon", price: 260, category: "Silver", image: "/images/Moon.jpg", description: "Celestial beauty in pure 18/10 steel." },
  { id: 75, name: "Murray", price: 210, category: "Silver", image: "/images/Murray.jpg", description: "Sturdy reliability." },
  { id: 76, name: "Neville", price: 220, category: "Silver", image: "/images/Neville.jpg", description: "Classic heritage design." },
  { id: 77, name: "Noah Brushed", price: 240, category: "Silver", image: "/images/Noah Brushed.jpg", description: "Contemporary matte finish." },
  { id: 78, name: "Pandora", price: 255, category: "Silver", image: "/images/Pandora.jpg", description: "Unleash luxury with this heavy-gauge set." },
  { id: 79, name: "Sander Brushed", price: 230, category: "Silver", image: "/images/Sander Brushed.jpg", description: "Industrial chic matte silver." },
  { id: 80, name: "Sienna", price: 225, category: "Silver", image: "/images/Sienna.jpg", description: "Warm and inviting design." },
  { id: 81, name: "Tucson", price: 215, category: "Silver", image: "/images/Tucson.jpg", description: "Rugged elegance." },
  { id: 82, name: "Umbridge", price: 235, category: "Silver", image: "/images/Umbridge.jpg", description: "Superior quality and shine." },
  { id: 83, name: "Vermilio", price: 240, category: "Silver", image: "/images/Vermilio.jpg", description: "Vibrant and striking." },
  { id: 84, name: "Xena Faceted", price: 280, category: "Silver", image: "/images/Xena Faceted.jpg", description: "Geometric facets in polished steel." },
  { id: 85, name: "Zoya", price: 225, category: "Silver", image: "/images/Zoya.jpg", description: "Life and brilliance in a forged silhouette." }
];

const REVIEWS = [
  { id: 1, text: "The Moon Gold set is absolutely stunning. The weight feels substantial and the finish is flawless.", author: "Chef Min-ho K." },
  { id: 2, text: "I love knowing this uses POSCO steel. It hasn't rusted or dulled in months.", author: "Sarah L." },
  { id: 3, text: "The balance reminds me of high-end Japanese cutlery, but at a better price point.", author: "James T." }
];

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "px-6 py-3 transition-all duration-300 font-medium tracking-wide flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-700",
    secondary: "bg-white border border-stone-200 text-stone-900 hover:bg-stone-50",
    outline: "border-2 border-white text-white hover:bg-white hover:text-stone-900"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
        // !!! REPLACE with real Stripe link
        window.location.href = "https://buy.stripe.com/YOUR_LINK_HERE"; 
    }, 1000);
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
            <h2 className="text-xl font-serif text-stone-900">Your Basket</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center text-stone-500 mt-10">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                <p>Your basket is empty.</p>
                <button onClick={onClose} className="text-stone-900 underline mt-4 hover:text-amber-700">Continue Shopping</button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded bg-stone-100" />
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-900">{item.name}</h3>
                    <p className="text-stone-500 text-sm mb-2">€{item.price}</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100">-</button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 self-start"><X size={16} /></button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-stone-50">
              <div className="flex justify-between mb-4 text-lg font-serif font-medium"><span>Total</span><span>€{total.toFixed(2)}</span></div>
              <Button onClick={handleCheckout} className="w-full">{isCheckingOut ? 'Processing...' : 'Checkout Securely'}</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ProductCard = ({ product, onAdd }) => (
  <div className="group relative">
    <div className="aspect-[4/5] overflow-hidden bg-stone-100 mb-4 cursor-pointer relative">
      <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <Button onClick={() => onAdd(product)} className="w-full shadow-lg">Add to Basket - €{product.price}</Button>
      </div>
    </div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-lg font-serif text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer">{product.name}</h3>
      </div>
      <p className="font-medium text-stone-900">€{product.price}</p>
    </div>
  </div>
);

// --- Mobile Navigation Component ---
const MobileNav = ({ isOpen, onClose, navigate }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <span className="text-xl font-serif font-bold">SURA STEEL</span>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <nav className="p-6 space-y-4 flex flex-col">
          <button onClick={() => { onClose(); navigate('home'); }} className="text-left text-lg font-medium text-stone-800 hover:text-amber-700">Shop</button>
          <button onClick={() => { onClose(); navigate('about'); }} className="text-left text-lg font-medium text-stone-800 hover:text-amber-700">About</button>
          <button onClick={() => { onClose(); navigate('contact'); }} className="text-left text-lg font-medium text-stone-800 hover:text-amber-700">Contact</button>
        </nav>
      </div>
    </>
  );
};

// --- Page Components ---

const HomePage = ({ addToCart, activeCategory, setActiveCategory }) => {
  // Updated filter logic to handle new categories
  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : activeCategory === 'Sets' 
      ? PRODUCTS.filter(p => p.category === 'Gold' || p.category === 'Silver') // Show both Gold and Silver under "Sets"
      : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <>
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/background.png" alt="Sura Steel Royal Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto mt-20">
          <div className="mb-8 flex justify-center">
            <span className="px-5 py-2 rounded-full border border-amber-200/30 text-amber-100 text-[10px] uppercase tracking-[0.3em] font-light bg-black/10 backdrop-blur-md">
              The King's Standard
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">Dining Fit For <br /> Royalty.</h1>
          <p className="text-lg text-stone-200 mb-10 max-w-2xl mx-auto font-light">
            "Sura" (수라) is the Korean word for the King's meal. <br/>
            We bring royal quality to your table using premium <b>POSCO steel</b> and centuries of <b>Tsubame craftsmanship</b>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>View Collection</Button>
          </div>
        </div>
      </header>

      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900"><Crown size={24} /></div>
              <h3 className="text-xl font-serif">The "Sura" Standard</h3>
              <p className="text-stone-500 leading-relaxed">Named after the Joseon Dynasty's royal table, our cutlery meets the exacting standards of kings.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900"><Hammer size={24} /></div>
              <h3 className="text-xl font-serif">True Forged Tech</h3>
              <p className="text-stone-500 leading-relaxed">Authentic "Danjo" (Forged) technology for superior density and edge retention.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900"><ShieldCheck size={24} /></div>
              <h3 className="text-xl font-serif">POSCO Steel</h3>
              <p className="text-stone-500 leading-relaxed">Raw materials from Korea's POSCO Steel, renowned globally for purity.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div><h2 className="text-4xl font-serif text-stone-900 mb-4">The Royal Collection</h2><p className="text-stone-500">Experience the difference of Korean Steel.</p></div>
            <div className="flex gap-4 border-b border-stone-200 pb-2 overflow-x-auto">
              {/* Updated Filter Menu */}
              {['All', 'Sets', 'Gold', 'Silver', 'Knives'].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`pb-2 text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${activeCategory === cat ? 'text-stone-900 border-b-2 border-stone-900 -mb-[9px]' : 'text-stone-400 hover:text-stone-600'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map(product => (<ProductCard key={product.id} product={product} onAdd={addToCart} />))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-amber-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-serif mb-16">From Our Forge to Your Table</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map(review => (
              <div key={review.id} className="bg-white p-8 rounded shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center text-amber-500 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                <p className="text-stone-600 mb-6 italic">"{review.text}"</p>
                <p className="font-bold text-stone-900 text-sm">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const AboutPage = () => (
  <div className="pt-32 pb-24">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-5xl font-serif text-stone-900 mb-8 text-center">The Meaning of Sura</h1>
      <div className="relative h-96 mb-12 overflow-hidden rounded-lg shadow-xl">
        <img src="/background.png" alt="Forging" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><span className="text-white text-xl tracking-widest uppercase font-bold border-2 border-white px-8 py-4">Since 1970</span></div>
      </div>
      <div className="space-y-8 text-lg text-stone-600 leading-relaxed">
        <h3 className="text-2xl font-serif text-stone-900">What is a King's Dish?</h3>
        <p>In the Joseon Dynasty of Korea, the King's daily meal was called <b>"Sura" (수라)</b>. It was not merely food; it was a symbol of the nation's prosperity, prepared with the finest ingredients and served with the utmost respect.</p>
        <p>At Sura Steel, we believe the tools used to prepare a meal should carry that same dignity. We named our brand <b>Sura</b> because we provide cutlery that possesses the quality, balance, and sharpness fit for a king's table.</p>
        
        <div className="w-full h-px bg-stone-200 my-8"></div>

        <h3 className="text-2xl font-serif text-stone-900">Our Global Journey</h3>
        <p>Our story began by learning the art of cutlery in <b>Tsubame, Japan</b>—a region legendary for its metalwork. Bringing this knowledge to Korea in 1970, we established a legacy of precision.</p>
        <p>We partner with <b>POSCO</b>, Korea's premier steel manufacturer, to source high-carbon stainless steel. Today, we continue this tradition in Indonesia, utilizing authentic <b>"Danjo" (Forged)</b> technology to create tools that last generations.</p>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="pt-32 pb-24 bg-stone-50 min-h-screen">
    <div className="container mx-auto px-6 max-w-3xl">
      <h1 className="text-4xl font-serif text-stone-900 mb-12 text-center">Contact Us</h1>
      <div className="bg-white p-8 rounded-lg shadow-sm grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><Mail size={18} /> Email</h3>
            <p className="text-stone-600">taeyong@surasteel.com</p>
          </div>
          <div>
            <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><Phone size={18} /> Phone</h3>
            <p className="text-stone-600">+31 6 8554 0430</p>
          </div>
          <div>
            <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><MapPin size={18} /> HQ</h3>
            <p className="text-stone-600">123 Artisan Way<br/>The Hague, Netherlands</p>
          </div>
        </div>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none" />
          <input type="email" placeholder="Email Address" className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none" />
          <textarea rows="4" placeholder="Message" className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none"></textarea>
          <Button className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  </div>
);

const PolicyPage = ({ title }) => (
  <div className="pt-32 pb-24 container mx-auto px-6 max-w-3xl">
    <h1 className="text-4xl font-serif text-stone-900 mb-8">{title}</h1>
    <div className="prose prose-stone">
      <p className="mb-4">At Sura Steel, we stand by the quality of our forged cutlery.</p>
      <h3 className="text-xl font-bold mt-6 mb-2">Shipping</h3>
      <p className="mb-4">We ship worldwide from our logistics center in The Hague. Standard shipping takes 3-5 business days within the EU and 7-14 days internationally.</p>
      <h3 className="text-xl font-bold mt-6 mb-2">Returns & Warranty</h3>
      <p className="mb-4">If you are not completely satisfied, you may return your unused items within 30 days. We offer a lifetime warranty against manufacturing defects on all forged products.</p>
    </div>
  </div>
);

// --- Main App Component ---

const App = () => {
  const [view, setView] = useState('home'); // home, about, contact, policy
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (page) => {
    window.scrollTo(0, 0);
    setView(page);
    setIsMobileMenuOpen(false);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) { return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p); }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    showNotification(`Added ${product.name} to cart`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* Mobile Menu */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} navigate={navigate} />

      {/* Navbar */}
      <nav className={`fixed w-full z-30 transition-all duration-300 ${scrolled || view !== 'home' ? 'bg-white/95 backdrop-blur-md shadow-sm py-4 text-stone-900' : 'bg-transparent py-6 text-white'}`}>
        {/* FIX: Used Grid instead of Flexbox for perfect centering */}
        <div className="container mx-auto px-6 grid grid-cols-3 items-center">
          
          {/* Left: Mobile Menu & Logo (Align Start) */}
          <div className="flex items-center gap-4 justify-self-start">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
              <Menu size={24} className={scrolled || view !== 'home' ? 'text-stone-900' : 'text-white'} />
            </button>
            <button onClick={() => navigate('home')} className="text-2xl font-serif tracking-tight font-bold">SURA STEEL</button>
          </div>

          {/* Center: Navigation Links (Align Center) */}
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide justify-self-center">
            <button onClick={() => navigate('home')} className="hover:opacity-70 transition-opacity">Shop</button>
            <button onClick={() => navigate('about')} className="hover:opacity-70 transition-opacity">About</button>
            <button onClick={() => navigate('contact')} className="hover:opacity-70 transition-opacity">Contact</button>
          </div>

          {/* Right: Cart (Align End) */}
          <div className="flex items-center gap-6 justify-self-end">
            <button onClick={() => setIsCartOpen(true)} className="relative hover:opacity-70 transition-opacity">
              <ShoppingBag size={24} />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {view === 'home' && <HomePage addToCart={addToCart} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />}
        {view === 'about' && <AboutPage />}
        {view === 'contact' && <ContactPage />}
        {view === 'policy' && <PolicyPage title="Shipping & Returns" />}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16 mt-auto">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <span className="text-white text-xl font-serif font-bold block mb-6">SURA STEEL</span>
              <p className="text-sm leading-relaxed mb-6">Premium forged cutlery. <br/> Korean Materials. <br/> Global Craftsmanship.</p>
              <div className="flex gap-4">
                <Instagram size={20} className="hover:text-white cursor-pointer" />
                <Facebook size={20} className="hover:text-white cursor-pointer" />
                <Twitter size={20} className="hover:text-white cursor-pointer" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Shop</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => navigate('home')} className="hover:text-white transition-colors">Chef Knives</button></li>
                <li><button onClick={() => navigate('home')} className="hover:text-white transition-colors">Steak Sets</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => navigate('policy')} className="hover:text-white transition-colors">Shipping & Returns</button></li>
                <li><button onClick={() => navigate('policy')} className="hover:text-white transition-colors">Warranty</button></li>
                <li><button onClick={() => navigate('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li>taeyong@surasteel.com</li>
                <li>+31 6 8554 0430</li>
                <li>123 Artisan Way<br/>The Hague, Netherlands</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-xs text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2024 Sura Steel. All rights reserved.</p>
            <div className="flex gap-6">
              <button onClick={() => navigate('policy')} className="hover:text-white">Privacy Policy</button>
              <button onClick={() => navigate('policy')} className="hover:text-white">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
      
      {notification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded shadow-xl z-50 flex items-center gap-3 animate-fade-in-up">
          <Check size={16} className="text-green-400" />
          {notification}
        </div>
      )}
    </div>
  );
};

export default App;