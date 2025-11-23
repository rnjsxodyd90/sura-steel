import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, X, Menu, Star, Check, Instagram, Facebook, Twitter, ArrowRight, Hammer, Globe, ShieldCheck, Mail, MapPin, Phone, Crown, Ruler, Scale, ArrowLeft, Plus, Minus } from 'lucide-react';

// --- REAL PRODUCT DATA (With Premium Pricing Strategy) ---
const PRODUCTS = [
  // --- GOLD COLLECTION ---
  { 
    id: 20, 
    name: "Moon Gold", 
    category: "Gold", 
    image: "/images/Moon Gold.jpg", 
    description: "Our signature set. Celestial beauty in 24k gold finish. Hand-polished for a brilliant shine.",
    specs: { material: "18/10 Stainless Steel", finish: "Mirror Polish + PVD Gold" },
    // Pricing Strategy
    price_full_set: 380,     // 24 Pieces
    price_place_setting: 72, // 4 Pieces (Knife, Fork, Spoon, Tea Spoon)
    components: [
      { name: "Dinner Knife", len: "232mm", thick: "7.0mm", material: "13/0", price: 22 },
      { name: "Dinner Spoon", len: "200mm", thick: "3.5mm", material: "18/10", price: 20 },
      { name: "Dinner Fork", len: "201mm", thick: "3.5mm", material: "18/10", price: 20 },
      { name: "Tea Spoon", len: "143mm", thick: "2.5mm", material: "18/10", price: 16 },
      { name: "Dessert Knife", len: "208mm", thick: "7.0mm", material: "13/0", price: 21 },
      { name: "Dessert Fork", len: "181mm", thick: "3.0mm", material: "18/10", price: 19 },
      { name: "Cake Fork", len: "161mm", thick: "6.0mm", material: "13/0", price: 19 }
    ]
  },
  { 
    id: 24, 
    name: "Pandora Gold", 
    category: "Gold", 
    image: "/images/Pandora Gold.jpg", 
    description: "Unleash luxury with this premium heavy-gauge set. Bold, substantial, and unforgettable.",
    specs: { material: "18/10 Stainless Steel", finish: "Mirror Polish + PVD Gold" },
    price_full_set: 395,
    price_place_setting: 75,
    components: [
      { name: "Dinner Knife", len: "248mm", thick: "9.0mm", material: "13/0", price: 24 },
      { name: "Dinner Spoon", len: "208mm", thick: "5.5mm", material: "18/10", price: 22 },
      { name: "Dinner Fork", len: "212mm", thick: "5.5mm", material: "18/10", price: 22 },
      { name: "Tea Spoon", len: "142mm", thick: "4.0mm", material: "18/10", price: 18 }
    ]
  },
  // ... Standard Pricing applied to others for brevity (You can customize per item)
  { id: 1, name: "Ivy Gold", category: "Gold", image: "/images/Ivy Gold.jpg", description: "Organic flowing lines wrapped in gold.", price_full_set: 350, price_place_setting: 65, components: [] },
  { id: 2, name: "Jacob Gold", category: "Gold", image: "/images/Jacob Gold.jpg", description: "Timeless simplicity for the modern king.", price_full_set: 340, price_place_setting: 62, components: [] },
  { id: 3, name: "Jaime Gold", category: "Gold", image: "/images/Jaime Gold.jpg", description: "Bold and substantial, a statement piece.", price_full_set: 360, price_place_setting: 68, components: [] },
  { id: 4, name: "Jambi Gold", category: "Gold", image: "/images/Jambi Gold.jpg", description: "Exotic inspiration with a flawless gold polish.", price_full_set: 350, price_place_setting: 65, components: [] },
  { id: 5, name: "Kaizen Gold", category: "Gold", image: "/images/Kaizen Gold.jpg", description: "Continuous improvement in design, realized in gold.", price_full_set: 370, price_place_setting: 70, components: [] },
  { id: 6, name: "Karina Gold", category: "Gold", image: "/images/Karina Gold.jpg", description: "Graceful and elegant, fit for a queen.", price_full_set: 350, price_place_setting: 65, components: [] },
  { id: 7, name: "Lucius Gold", category: "Gold", image: "/images/Lucius Gold.jpg", description: "Light and brilliant, illuminating the dining experience.", price_full_set: 365, price_place_setting: 69, components: [] },
  { id: 8, name: "Mercy Gold", category: "Gold", image: "/images/Mercy Gold.jpg", description: "Soft edges and a comforting grip in gold.", price_full_set: 340, price_place_setting: 64, components: [] },
  { id: 9, name: "Murray Gold", category: "Gold", image: "/images/Murray Gold.jpg", description: "Sturdy and reliable with a touch of luxury.", price_full_set: 330, price_place_setting: 60, components: [] },
  { id: 10, name: "Neville Gold", category: "Gold", image: "/images/Neville Gold.jpg", description: "Classic heritage design in a warm gold hue.", price_full_set: 345, price_place_setting: 65, components: [] },
  { id: 11, name: "Noah Brushed Gold", category: "Gold", image: "/images/Noah Brushed Gold.jpg", description: "Contemporary brushed finish for a modern table.", price_full_set: 360, price_place_setting: 68, components: [] },
  { id: 12, name: "Sander Brushed Gold", category: "Gold", image: "/images/Sander Brushed Gold.jpg", description: "Matte gold perfection for the industrial chic home.", price_full_set: 355, price_place_setting: 67, components: [] },
  { id: 13, name: "Sienna Gold", category: "Gold", image: "/images/Sienna Gold.jpg", description: "Warm and inviting, like the Italian sun.", price_full_set: 350, price_place_setting: 65, components: [] },
  { id: 14, name: "Tucson Gold", category: "Gold", image: "/images/Tucson Gold.jpg", description: "Rugged elegance with a refined gold layer.", price_full_set: 340, price_place_setting: 64, components: [] },
  { id: 15, name: "Umbridge Gold", category: "Gold", image: "/images/Umbridge Gold.jpg", description: "Strictly superior quality and shine.", price_full_set: 360, price_place_setting: 68, components: [] },
  { id: 16, name: "Vermilio Gold", category: "Gold", image: "/images/Vermilio Gold.jpg", description: "Vibrant and striking, the center of attention.", price_full_set: 365, price_place_setting: 69, components: [] },
  { id: 17, name: "Xena Faceted Gold", category: "Gold", image: "/images/Xena Faceted Gold.jpg", description: "Geometric facets reflect light like diamonds.", price_full_set: 390, price_place_setting: 74, components: [] },
  { id: 18, name: "Zoya Gold", category: "Gold", image: "/images/Zoya Gold.jpg", description: "Life and brilliance in a forged gold silhouette.", price_full_set: 350, price_place_setting: 65, components: [] },

  // --- SILVER COLLECTION ---
  { 
    id: 56, 
    name: "Bree", 
    category: "Silver", 
    image: "/images/Bree.jpg", 
    description: "Minimalist design for the modern home. 18/0 Stainless Steel.",
    specs: { material: "18/0 Stainless Steel", finish: "Mirror Finish" },
    price_full_set: 220,
    price_place_setting: 45,
    components: [
      { name: "Dinner Knife", len: "225mm", thick: "6.0mm", material: "13/0", price: 15 },
      { name: "Dinner Fork", len: "200mm", thick: "4.0mm", material: "18/0", price: 12 },
      { name: "Dessert Spoon", len: "186mm", thick: "3.5mm", material: "18/0", price: 12 },
      { name: "Tea Spoon", len: "150mm", thick: "3.5mm", material: "18/0", price: 9 }
    ]
  },
  { id: 51, name: "Armesh", category: "Silver", image: "/images/Armesh.jpg", description: "Intricate detailing in pure polished stainless steel.", price_full_set: 260, price_place_setting: 49, components: [] },
  // ... (Standard silver pricing applied ~€220-€260 range)
  { id: 52, name: "Jacob", category: "Silver", image: "/images/Jacob.jpg", description: "Simple, honest, and built to last.", price_full_set: 230, price_place_setting: 45, components: [] },
  { id: 53, name: "Jaime", category: "Silver", image: "/images/Jaime.jpg", description: "Bold and substantial stainless steel.", price_full_set: 260, price_place_setting: 50, components: [] },
  { id: 54, name: "Jambi", category: "Silver", image: "/images/Jambi.jpg", description: "Exotic inspiration in polished steel.", price_full_set: 250, price_place_setting: 48, components: [] },
  { id: 55, name: "Kaizen", category: "Silver", image: "/images/Kaizen.jpg", description: "Continuous improvement in steel crafting.", price_full_set: 270, price_place_setting: 52, components: [] },
  { id: 57, name: "Karina", category: "Silver", image: "/images/Karina.jpg", description: "Graceful elegance.", price_full_set: 245, price_place_setting: 48, components: [] },
  { id: 58, name: "Lucius", category: "Silver", image: "/images/Lucius.jpg", description: "Light and brilliant mirror finish.", price_full_set: 265, price_place_setting: 51, components: [] },
  { id: 59, name: "Mercy", category: "Silver", image: "/images/Mercy.jpg", description: "Soft edges for a comfortable grip.", price_full_set: 235, price_place_setting: 46, components: [] },
  { id: 60, name: "Moon", category: "Silver", image: "/images/Moon.jpg", description: "Celestial beauty in pure 18/10 steel.", price_full_set: 280, price_place_setting: 54, components: [] },
  { id: 61, name: "Murray", category: "Silver", image: "/images/Murray.jpg", description: "Sturdy reliability.", price_full_set: 230, price_place_setting: 45, components: [] },
  { id: 62, name: "Neville", category: "Silver", image: "/images/Neville.jpg", description: "Classic heritage design.", price_full_set: 240, price_place_setting: 47, components: [] },
  { id: 63, name: "Noah Brushed", category: "Silver", image: "/images/Noah Brushed.jpg", description: "Contemporary matte finish.", price_full_set: 260, price_place_setting: 50, components: [] },
  { id: 64, name: "Pandora", category: "Silver", image: "/images/Pandora.jpg", description: "Unleash luxury with this heavy-gauge set.", price_full_set: 275, price_place_setting: 53, components: [] },
  { id: 65, name: "Sander Brushed", category: "Silver", image: "/images/Sander Brushed.jpg", description: "Industrial chic matte silver.", price_full_set: 250, price_place_setting: 49, components: [] },
  { id: 66, name: "Sienna", category: "Silver", image: "/images/Sienna.jpg", description: "Warm and inviting design.", price_full_set: 245, price_place_setting: 48, components: [] },
  { id: 67, name: "Tucson", category: "Silver", image: "/images/Tucson.jpg", description: "Rugged elegance.", price_full_set: 235, price_place_setting: 46, components: [] },
  { id: 68, name: "Umbridge", category: "Silver", image: "/images/Umbridge.jpg", description: "Superior quality and shine.", price_full_set: 255, price_place_setting: 50, components: [] },
  { id: 69, name: "Vermilio", category: "Silver", image: "/images/Vermilio.jpg", description: "Vibrant and striking.", price_full_set: 260, price_place_setting: 51, components: [] },
  { id: 70, name: "Xena Faceted", category: "Silver", image: "/images/Xena Faceted.jpg", description: "Geometric facets in polished steel.", price_full_set: 300, price_place_setting: 58, components: [] },
  { id: 71, name: "Zoya", category: "Silver", image: "/images/Zoya.jpg", description: "Life and brilliance in a forged silhouette.", price_full_set: 245, price_place_setting: 48, components: [] }
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
    outline: "border-2 border-white text-white hover:bg-white hover:text-stone-900",
    sm: "bg-stone-900 text-white hover:bg-stone-700 px-3 py-1 text-xs"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- Mobile Navigation Component (FIXED: Defined Before Usage) ---
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

const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
        window.location.href = "https://buy.stripe.com/YOUR_LINK_HERE"; 
    }, 1000);
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
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
              cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded bg-stone-100" />
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-900">{item.name}</h3>
                    {/* Show Variant Name if it exists (e.g. "Place Setting" or "Dinner Knife") */}
                    <p className="text-xs text-stone-500">{item.variant}</p>
                    <p className="text-stone-900 text-sm mb-2">€{item.price}</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.variant, -1)} className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100">-</button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.variant, 1)} className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.variant)} className="text-stone-400 hover:text-red-500 self-start"><X size={16} /></button>
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

const ProductCard = React.memo(({ product, onViewDetails }) => (
  <div className="group relative">
    <div className="aspect-[4/5] overflow-hidden bg-stone-100 mb-4 cursor-pointer relative" onClick={() => onViewDetails(product)}>
      {/* OPTIMIZATION: loading="lazy" ensures images off-screen don't slow down initial load */}
      <img 
        src={product.image} 
        alt={product.name} 
        loading="lazy"
        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
      />
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <Button className="w-full shadow-lg">View Details</Button>
      </div>
    </div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-lg font-serif text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer" onClick={() => onViewDetails(product)}>{product.name}</h3>
      </div>
      <p className="font-medium text-stone-900">from €{product.price_place_setting}</p>
    </div>
  </div>
));

// --- PAGE: Product Details (Updated with Purchase Options) ---
const ProductDetailPage = ({ product, onBack, onAddToCart }) => {
  const [selectedOption, setSelectedOption] = useState('set'); // 'set' or 'place'

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) return null;

  // Handle adding the main set types
  const handleAddMainSet = () => {
    const variantName = selectedOption === 'set' ? '24-Piece Full Set' : '4-Piece Place Setting';
    const price = selectedOption === 'set' ? product.price_full_set : product.price_place_setting;
    onAddToCart({ ...product, name: product.name, price: price, variant: variantName });
  };

  // Handle adding individual components
  const handleAddSingle = (comp) => {
     onAddToCart({ 
       id: product.id, // Keep same ID for grouping, or unique ID if preferred
       image: product.image,
       name: product.name, 
       price: comp.price || 20, // Fallback price
       variant: `${comp.name} (Single)`,
       category: product.category
     });
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6 mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-6">
          <ArrowLeft size={20} /> Back to Shop
        </button>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image */}
          <div className="w-full lg:w-1/2">
             <div className="aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden shadow-xl sticky top-24">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
             </div>
          </div>

          {/* Info & Purchase Options */}
          <div className="w-full lg:w-1/2 flex flex-col">
             <h1 className="text-4xl font-serif text-stone-900 mb-2">{product.name}</h1>
             <span className="text-amber-600 text-sm font-bold tracking-widest uppercase mb-6">{product.category} Collection</span>
             <p className="text-stone-600 text-lg mb-8 leading-relaxed">{product.description}</p>
             
             {/* --- Purchase Option Selector --- */}
             <div className="bg-white border border-stone-200 rounded-lg p-6 mb-8 shadow-sm">
                <h3 className="text-sm font-bold text-stone-900 uppercase mb-4">Choose Your Set</h3>
                
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${selectedOption === 'set' ? 'border-amber-500 bg-amber-50' : 'border-stone-200 hover:border-stone-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="set-type" checked={selectedOption === 'set'} onChange={() => setSelectedOption('set')} className="text-amber-600 focus:ring-amber-500" />
                      <div>
                        <span className="block font-bold text-stone-900">24-Piece Full Set</span>
                        <span className="text-xs text-stone-500">Service for 6 People</span>
                      </div>
                    </div>
                    <span className="font-serif text-xl text-stone-900">€{product.price_full_set}</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${selectedOption === 'place' ? 'border-amber-500 bg-amber-50' : 'border-stone-200 hover:border-stone-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="set-type" checked={selectedOption === 'place'} onChange={() => setSelectedOption('place')} className="text-amber-600 focus:ring-amber-500" />
                      <div>
                        <span className="block font-bold text-stone-900">4-Piece Place Setting</span>
                        <span className="text-xs text-stone-500">Service for 1 Person</span>
                      </div>
                    </div>
                    <span className="font-serif text-xl text-stone-900">€{product.price_place_setting}</span>
                  </label>
                </div>

                <Button onClick={handleAddMainSet} className="w-full mt-6 py-4 text-lg">Add to Basket</Button>
             </div>
             
             {/* Specs Mini-Table */}
             {product.specs && (
               <div className="grid grid-cols-2 gap-4 text-sm border-t border-stone-100 pt-6">
                  <div>
                    <span className="block text-stone-400 text-xs uppercase tracking-wider mb-1">Material</span>
                    <span className="font-medium text-stone-900">{product.specs.material}</span>
                  </div>
                  <div>
                    <span className="block text-stone-400 text-xs uppercase tracking-wider mb-1">Finish</span>
                    <span className="font-medium text-stone-900">{product.specs.finish || "Standard"}</span>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* --- Individual Pieces / Technical Breakdown --- */}
      <div className="bg-stone-50 py-20 border-t border-stone-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif text-stone-900 mb-3">Shop Individual Pieces</h2>
              <p className="text-stone-500 max-w-2xl mx-auto">Need a replacement or want to build a custom collection? Select individual components below.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {(product.components && product.components.length > 0 ? product.components : [
                  // Fallback components if data is missing
                  { name: "Dinner Knife", len: "Standard", thick: "Standard", material: "13/0", price: 22 },
                  { name: "Dinner Fork", len: "Standard", thick: "Standard", material: "18/10", price: 20 },
                  { name: "Dinner Spoon", len: "Standard", thick: "Standard", material: "18/10", price: 20 },
                  { name: "Tea Spoon", len: "Standard", thick: "Standard", material: "18/10", price: 16 },
              ]).map((comp, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 text-center group relative overflow-hidden flex flex-col h-full">
                  
                  <h3 className="font-bold text-lg text-stone-900 mb-2">{comp.name}</h3>
                  <div className="text-xs text-stone-500 space-y-1 mb-4 flex-grow">
                     <p>Length: {comp.len}</p>
                     <p>Material: {comp.material}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                     <span className="font-serif text-lg text-stone-900">€{comp.price || 20}</span>
                     <button 
                        onClick={() => handleAddSingle(comp)}
                        className="bg-stone-900 text-white p-2 rounded-full hover:bg-amber-600 transition-colors"
                        title="Add to Cart"
                     >
                        <Plus size={16} />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

// --- Page Components (Home, About, etc.) ---
const HomePage = ({ addToCart, activeCategory, setActiveCategory, onViewDetails }) => {
  const filteredProducts = useMemo(() => {
    return activeCategory === 'All' 
      ? PRODUCTS 
      : activeCategory === 'Sets' 
        ? PRODUCTS.filter(p => p.category === 'Gold' || p.category === 'Silver') 
        : PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/background.png" alt="Sura Steel Royal Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto mt-20">
          <div className="mb-8 flex justify-center">
            <span className="px-5 py-2 rounded-full border border-amber-200/30 text-amber-100 text-[10px] uppercase tracking-[0.3em] font-light bg-black/10 backdrop-blur-md">The King's Standard</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">Dining Fit For <br /> Royalty.</h1>
          <p className="text-lg text-stone-200 mb-10 max-w-2xl mx-auto font-light">"Sura" (수라) is the Korean word for the King's meal. <br/>We bring royal quality to your table using premium <b>POSCO steel</b> and centuries of <b>Tsubame craftsmanship</b>.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>View Collection</Button>
          </div>
        </div>
      </header>

      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4"><div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900"><Crown size={24} /></div><h3 className="text-xl font-serif">The "Sura" Standard</h3><p className="text-stone-500 leading-relaxed">Named after the Joseon Dynasty's royal table, our cutlery meets the exacting standards of kings.</p></div>
            <div className="space-y-4"><div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900"><Hammer size={24} /></div><h3 className="text-xl font-serif">True Forged Tech</h3><p className="text-stone-500 leading-relaxed">Authentic "Danjo" (Forged) technology for superior density and edge retention.</p></div>
            <div className="space-y-4"><div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900"><ShieldCheck size={24} /></div><h3 className="text-xl font-serif">POSCO Steel</h3><p className="text-stone-500 leading-relaxed">Raw materials from Korea's POSCO Steel, renowned globally for purity.</p></div>
          </div>
        </div>
      </section>

      <section id="shop" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div><h2 className="text-4xl font-serif text-stone-900 mb-4">The Royal Collection</h2><p className="text-stone-500">Experience the difference of Korean Steel.</p></div>
            <div className="flex gap-4 border-b border-stone-200 pb-2 overflow-x-auto">
              {['All', 'Sets', 'Gold', 'Silver'].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`pb-2 text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${activeCategory === cat ? 'text-stone-900 border-b-2 border-stone-900 -mb-[9px]' : 'text-stone-400 hover:text-stone-600'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map(product => (<ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />))}
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
          <div><h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><Mail size={18} /> Email</h3><p className="text-stone-600">taeyong@surasteel.com</p></div>
          <div><h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><Phone size={18} /> Phone</h3><p className="text-stone-600">+31 6 8554 0430</p></div>
          <div><h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><MapPin size={18} /> HQ</h3><p className="text-stone-600">123 Artisan Way<br/>The Hague, Netherlands</p></div>
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
  const [view, setView] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setView('product');
    window.scrollTo(0,0);
  };

  const addToCart = (item) => {
    setCart(prev => {
      // Create unique ID based on product ID + variant
      const uniqueId = `${item.id}-${item.variant}`;
      const existing = prev.find(p => `${p.id}-${p.variant}` === uniqueId);
      
      if (existing) { 
        return prev.map(p => `${p.id}-${p.variant}` === uniqueId ? { ...p, quantity: p.quantity + 1 } : p); 
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
    showNotification(`Added ${item.name} (${item.variant})`);
  };

  const updateQuantity = (id, variant, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.variant === variant) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id, variant) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.variant === variant)));
  };

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
        <div className="container mx-auto px-6 grid grid-cols-3 items-center">
          <div className="flex items-center gap-4 justify-self-start">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
              <Menu size={24} className={scrolled || view !== 'home' ? 'text-stone-900' : 'text-white'} />
            </button>
            <button onClick={() => navigate('home')} className="text-2xl font-serif tracking-tight font-bold">SURA STEEL</button>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide justify-self-center">
            <button onClick={() => navigate('home')} className="hover:opacity-70 transition-opacity">Shop</button>
            <button onClick={() => navigate('about')} className="hover:opacity-70 transition-opacity">About</button>
            <button onClick={() => navigate('contact')} className="hover:opacity-70 transition-opacity">Contact</button>
          </div>
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
        {view === 'home' && <HomePage addToCart={addToCart} activeCategory={activeCategory} setActiveCategory={setActiveCategory} onViewDetails={handleViewDetails} />}
        {view === 'product' && <ProductDetailPage product={selectedProduct} onBack={() => setView('home')} onAddToCart={addToCart} />}
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
                <li><button onClick={() => navigate('home')} className="hover:text-white transition-colors">Gold Collection</button></li>
                <li><button onClick={() => navigate('home')} className="hover:text-white transition-colors">Silver Collection</button></li>
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

      {/* Overlays */}
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