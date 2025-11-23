import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Menu, Star, ChevronRight, Check, Instagram, Facebook, Twitter, ArrowRight, Hammer, Globe, ShieldCheck } from 'lucide-react';

// --- Mock Data (Updated Descriptions) ---
const PRODUCTS = [
  {
    id: 1,
    name: "The Executive Chef",
    price: 185,
    category: "Knives",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=800",
    description: "Hand-forged using premium Korean POSCO stainless steel. Perfectly balanced."
  },
  {
    id: 2,
    name: "Gold Matte Set (24pc)",
    price: 320,
    category: "Sets",
    image: "https://images.unsplash.com/photo-1615324541783-d5a23f46f499?auto=format&fit=crop&q=80&w=800",
    description: "Tsubame-inspired design. 18/10 POSCO steel with a durable PVD gold matte finish."
  },
  {
    id: 3,
    name: "Forged Santoku",
    price: 210,
    category: "Knives",
    image: "https://images.unsplash.com/photo-1588832626888-2947df37119e?auto=format&fit=crop&q=80&w=800",
    description: "Precision forged blade. A tribute to our 1970 heritage."
  },
  {
    id: 4,
    name: "Noir Steak Knives",
    price: 145,
    category: "Sets",
    image: "https://images.unsplash.com/photo-1584269600464-3706b29d99a9?auto=format&fit=crop&q=80&w=800",
    description: "Set of 4 forged steak knives. Heavy gauge steel for a substantial feel."
  },
  {
    id: 5,
    name: "Classic Silver Service",
    price: 250,
    category: "Sets",
    image: "https://images.unsplash.com/photo-1534120914481-b659c258d532?auto=format&fit=crop&q=80&w=800",
    description: "Timeless polished finish using high-grade Korean raw materials."
  },
  {
    id: 6,
    name: "Artisan Paring Knife",
    price: 85,
    category: "Knives",
    image: "https://images.unsplash.com/photo-1560762908-1f6e09886477?auto=format&fit=crop&q=80&w=800",
    description: "Essential 3.5-inch forged blade. Sharp, durable, and precise."
  }
];

const REVIEWS = [
  { id: 1, text: "You can feel the history in the weight of these knives. The forged steel is exceptional.", author: "Chef Min-ho K." },
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
    // Redirect to Stripe or Checkout Page
    setTimeout(() => {
        // !!! IMPORTANT: You must replace this with your real Stripe link. 
        // Create one generic product in Stripe and use its link here.
        window.location.href = "https://buy.stripe.com/YOUR_REAL_STRIPE_PAYMENT_LINK_HERE"; 
    }, 1000);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
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

// --- Mobile Navigation Component ---
const MobileNav = ({ isOpen, onClose }) => {
  const links = ['Shop All', 'Knives', 'Sets', 'About', 'Journal', 'Contact'];
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
        <nav className="p-6 space-y-4">
          {links.map(link => (
            <a 
              key={link}
              href="#"
              onClick={onClose}
              className="block text-lg font-medium text-stone-800 hover:text-amber-700 transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};


// --- Main App Component ---

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu
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
      
      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Navigation */}
      <nav className={`fixed w-full z-30 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6 text-white'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} // Toggle Mobile Menu
              className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
            >
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
          <p className="text-amber-200 tracking-[0.2em] text-sm font-medium mb-6 uppercase">Since 1970</p>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
            Korean Steel. <br /> Tsubame Legacy.
          </h1>
          <p className="text-lg text-stone-200 mb-10 max-w-2xl mx-auto font-light">
            Crafted from high-grade <b>POSCO Stainless Steel</b>. Forged using techniques inherited from 
            the masters of Tsubame, Japan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>
              View Collection
            </Button>
          </div>
        </div>
      </header>

      {/* Heritage Features */}
      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-serif">POSCO Steel</h3>
              <p className="text-stone-500 leading-relaxed">
                We utilize raw materials from Korea's POSCO Steel, renowned globally for purity and durability.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900">
                <Hammer size={24} />
              </div>
              <h3 className="text-xl font-serif">True Forged Tech</h3>
              <p className="text-stone-500 leading-relaxed">
                Using authentic "Danjo" (Forged) technology, creating a denser, stronger blade than stamped alternatives.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-serif">Global Journey</h3>
              <p className="text-stone-500 leading-relaxed">
                Roots in Tsubame, born in Korea (1970), and now perfected in our specialized facility in Indonesia.
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
              <h2 className="text-4xl font-serif text-stone-900 mb-4">The Forged Collection</h2>
              <p className="text-stone-500">Experience the difference of Korean Steel.</p>
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

      {/* Our Story / About Section */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1590233633800-410d440c9d64?auto=format&fit=crop&q=80&w=1200" 
                alt="Forging steel" 
                className="rounded-lg shadow-2xl opacity-90"
              />
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <span className="text-amber-500 uppercase tracking-widest text-sm font-bold">Our Heritage</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">From Tsubame to the World.</h2>
              <p className="text-stone-400 text-lg leading-relaxed">
                Our story began by learning the art of cutlery in <b>Tsubame, Japan</b>—a region legendary for its metalwork. 
                Bringing this knowledge to Korea in 1970, we established a legacy of quality.
              </p>
              <p className="text-stone-400 text-lg leading-relaxed">
                Today, we continue this tradition in Indonesia, combining <b>Korean POSCO steel</b> with true <b>Forged (Danjo) technology</b> 
                to create cutlery that lasts generations.
              </p>
              <button className="flex items-center gap-2 text-white border-b border-amber-500 pb-1 hover:text-amber-500 transition-colors">
                Read our full history <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-amber-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-serif mb-16">From Our Forge to Your Table</h2>
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
          <p className="text-stone-500 mb-8">Sign up for early access to new forged drops and exclusive chef recipes.</p>
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
                Premium forged cutlery. <br/> Korean Materials. <br/> Global Craftsmanship.
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
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Care Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
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