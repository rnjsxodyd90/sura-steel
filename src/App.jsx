import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Menu, Star, ChevronRight, Check, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';

// --- Mock Data ---
const PRODUCTS = [
  {
    id: 1,
    name: "The Executive Chef",
    price: 185,
    category: "Knives",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800",
    description: "Hand-forged 8-inch high-carbon steel chef knife with walnut handle."
  },
  {
    id: 2,
    name: "Gold Matte Set (24pc)",
    price: 320,
    category: "Sets",
    image: "https://images.unsplash.com/photo-1615324541783-d5a23f46f499?auto=format&fit=crop&q=80&w=800",
    description: "Complete service for 6. 18/10 stainless steel with a durable PVD gold matte finish."
  },
  {
    id: 3,
    name: "Damascus Santoku",
    price: 210,
    category: "Knives",
    image: "https://images.unsplash.com/photo-1588832626888-2947df37119e?auto=format&fit=crop&q=80&w=800",
    description: "67 layers of Damascus steel with a razor-sharp edge and rosewood handle."
  },
  {
    id: 4,
    name: "Noir Steak Knives",
    price: 145,
    category: "Sets",
    image: "https://images.unsplash.com/photo-1584269600464-3706b29d99a9?auto=format&fit=crop&q=80&w=800",
    description: "Set of 4 serrated steak knives in matte black titanium coating."
  },
  {
    id: 5,
    name: "Classic Silver Service",
    price: 250,
    category: "Sets",
    image: "https://images.unsplash.com/photo-1534120914481-b659c258d532?auto=format&fit=crop&q=80&w=800",
    description: "Timeless polished silver finish. Heavy gauge steel for perfect balance."
  },
  {
    id: 6,
    name: "Artisan Paring Knife",
    price: 85,
    category: "Knives",
    image: "https://images.unsplash.com/photo-1560762908-1f6e09886477?auto=format&fit=crop&q=80&w=800",
    description: "Essential 3.5-inch blade for intricate tasks. Olive wood handle."
  }
];

const REVIEWS = [
  { id: 1, text: "The balance on the chef knife is incredible. It feels like an extension of my hand.", author: "Marcus R., Head Chef" },
  { id: 2, text: "Absolutely stunning on my dinner table. Guests always ask where I got them.", author: "Sarah L." },
  { id: 3, text: "Razor sharp out of the box and holds an edge beautifully.", author: "James T." }
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
    // --- STRIPE LINK LOGIC HERE ---
    // Replace this URL with your actual Stripe Payment Link later
    window.location.href = "https://buy.stripe.com/test_link"; 
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
            <h2 className="text-xl font-serif text-stone-900">Your Basket</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
              <X size={20} />
            </button>
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
                    <p className="text-stone-500 text-sm mb-2">${item.price}</p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                      >-</button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                      >+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 self-start">
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-stone-50">
              <div className="flex justify-between mb-4 text-lg font-serif font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full">
                {isCheckingOut ? 'Processing...' : 'Checkout Securely'}
              </Button>
              <p className="text-center text-xs text-stone-400 mt-3">Free shipping on orders over $150</p>
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
      <img 
        src={product.image} 
        alt={product.name} 
        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <Button onClick={() => onAdd(product)} className="w-full shadow-lg">
          Add to Basket - ${product.price}
        </Button>
      </div>
    </div>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-lg font-serif text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer">
          {product.name}
        </h3>
      </div>
      <p className="font-medium text-stone-900">${product.price}</p>
    </div>
  </div>
);

// --- Main App Component ---

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    showNotification(`Added ${product.name} to cart`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-30 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6 text-white'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden">
              <Menu size={24} className={scrolled ? 'text-stone-900' : 'text-white'} />
            </button>
            <span className={`text-2xl font-serif tracking-tight font-bold ${scrolled ? 'text-stone-900' : 'text-white'}`}>
              SURA STEEL
            </span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            {['Shop All', 'Knives', 'Sets', 'About', 'Journal'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className={`hover:opacity-70 transition-opacity ${scrolled ? 'text-stone-900' : 'text-white'}`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`relative hover:opacity-70 transition-opacity ${scrolled ? 'text-stone-900' : 'text-white'}`}
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=2400" 
            alt="Dark elegant kitchen" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto mt-20">
          <p className="text-amber-200 tracking-[0.2em] text-sm font-medium mb-6 uppercase">Mastery in Metal</p>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
            Culinary Precision <br /> Meets Timeless Art.
          </h1>
          <p className="text-lg text-stone-200 mb-10 max-w-2xl mx-auto font-light">
            Hand-forged blades and artisan flatware designed for the modern table. 
            Experience the weight, balance, and beauty of true craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>
              View Collection
            </Button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-serif">Premium Steel</h3>
              <p className="text-stone-500 leading-relaxed">
                We use only high-carbon VG-10 and 18/10 stainless steel, ensuring lasting sharpness and rust resistance.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900">
                <Check size={24} />
              </div>
              <h3 className="text-xl font-serif">Lifetime Guarantee</h3>
              <p className="text-stone-500 leading-relaxed">
                We stand behind our craftsmanship. Every piece comes with a lifetime warranty against defects.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-serif">Artisan Made</h3>
              <p className="text-stone-500 leading-relaxed">
                Forged by master smiths with decades of experience in traditional Japanese and Western techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-4">The Collection</h2>
              <p className="text-stone-500">Elevate your culinary experience.</p>
            </div>
            
            <div className="flex gap-4 border-b border-stone-200 pb-2">
              {['All', 'Knives', 'Sets'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`pb-2 text-sm uppercase tracking-wider transition-colors ${
                    activeCategory === cat 
                      ? 'text-stone-900 border-b-2 border-stone-900 -mb-[9px]' 
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship/About Preview */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1590233633800-410d440c9d64?auto=format&fit=crop&q=80&w=1200" 
                alt="Blacksmith working" 
                className="rounded-lg shadow-2xl opacity-90"
              />
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <span className="text-amber-500 uppercase tracking-widest text-sm font-bold">Our Process</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">Forged in Fire, <br/>Finished by Hand.</h2>
              <p className="text-stone-400 text-lg leading-relaxed">
                Mass production has no place here. Each knife takes over 60 hours to create, passing through 
                the hands of four distinct masters: the forger, the grinder, the polisher, and the assembler.
              </p>
              <button className="flex items-center gap-2 text-white border-b border-amber-500 pb-1 hover:text-amber-500 transition-colors">
                Read our story <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-amber-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-serif mb-16">From Our Table to Yours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map(review => (
              <div key={review.id} className="bg-white p-8 rounded shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-stone-600 mb-6 italic">"{review.text}"</p>
                <p className="font-bold text-stone-900 text-sm">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 border-t border-stone-200">
        <div className="container mx-auto px-6 text-center max-w-xl">
          <h2 className="text-2xl font-serif mb-4">Join the Inner Circle</h2>
          <p className="text-stone-500 mb-8">Sign up for early access to new drops and exclusive chef recipes.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <span className="text-white text-xl font-serif font-bold block mb-6">SURA STEEL</span>
              <p className="text-sm leading-relaxed mb-6">
                Premium cutlery for those who respect the ingredients.
              </p>
              <div className="flex gap-4">
                <Instagram size={20} className="hover:text-white cursor-pointer" />
                <Facebook size={20} className="hover:text-white cursor-pointer" />
                <Twitter size={20} className="hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Shop</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Chef Knives</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Steak Sets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Care Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Warranty</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li>hello@surasteel.com</li>
                <li>+1 (555) 012-3456</li>
                <li>123 Artisan Way<br/>Portland, OR 97209</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-xs text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2024 Sura Steel. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      {/* Notification Toast */}
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