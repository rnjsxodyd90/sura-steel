import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, X, Menu, Star, Check, Instagram, Facebook, Twitter, ArrowRight, Hammer, Globe, ShieldCheck, Mail, MapPin, Phone, Crown, Ruler, Scale, ArrowLeft, Plus, Minus, Languages } from 'lucide-react';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    nav: { shop: "Shop", about: "About", contact: "Contact" },
    hero: { 
      badge: "The King's Standard", 
      title: "Dining Fit For Royalty.", 
      desc: "\"Sura\" (수라) is the Korean word for the King's meal. We bring royal quality to your table using the highest grade stainless steel and centuries of Tsubame craftsmanship.",
      cta: "View Collection"
    },
    features: {
      std_title: "The \"Sura\" Standard", std_desc: "Named after the Joseon Dynasty's royal table, our cutlery meets the exacting standards of kings.",
      tech_title: "True Forged Tech", tech_desc: "Authentic \"Danjo\" (Forged) technology for superior density and edge retention.",
      mat_title: "Premium Steel", mat_desc: "Crafted from the highest grade stainless steel, renowned globally for purity and durability."
    },
    shop: { title: "The Royal Collection", subtitle: "Experience the difference of Korean Steel.", from: "from" },
    filters: { all: "All", sets: "Sets", gold: "Gold", silver: "Silver" },
    product: { 
      back: "Back to Shop", 
      collection: "Collection", 
      set_price: "Set Price", 
      add_set: "Add Full Set to Basket",
      choose_set: "Choose Your Set",
      full_set: "24-Piece Full Set",
      service_6: "Service for 6 People",
      place_setting: "4-Piece Place Setting",
      service_1: "Service for 1 Person",
      tech_specs: "Technical Specifications",
      tech_desc: "Every piece is crafted to the exacting Sura Standard. Review the precise dimensions and materials of each component below.",
      shop_individual: "Shop Individual Pieces",
      shop_ind_desc: "Need a replacement or want to build a custom collection? Select individual components below.",
      drawing: "Drawing",
      length: "Length",
      gauge: "Gauge",
      steel: "Steel",
      pc: "/ pc",
      material: "Material",
      finish: "Finish",
      origin: "Origin",
      origin_val: "South Korea / Indonesia",
      in_stock: "In Stock - Ships from The Hague"
    },
    cart: { title: "Your Basket", empty: "Your basket is empty.", continue: "Continue Shopping", total: "Total", checkout: "Checkout Securely" },
    footer: { privacy: "Privacy Policy", terms: "Terms of Service", rights: "All rights reserved." },
    stock: { inStock: "In Stock", lowStock: "Only {count} left!", outOfStock: "Out of Stock", soldOut: "Sold Out" }
  },
  nl: {
    nav: { shop: "Winkel", about: "Over Ons", contact: "Contact" },
    hero: { 
      badge: "De Koningsstandaard", 
      title: "Dineren Als Een Koning.", 
      desc: "\"Sura\" (수라) is het Koreaanse woord voor de maaltijd van de koning. Wij brengen koninklijke kwaliteit naar uw tafel met hoogwaardig roestvrij staal en eeuwenoud Tsubame-vakmanschap.",
      cta: "Bekijk Collectie"
    },
    features: {
      std_title: "De \"Sura\" Standaard", std_desc: "Genoemd naar de koninklijke tafel van de Joseon-dynastie, voldoet ons bestek aan de eisen van koningen.",
      tech_title: "Echt Gesmeed", tech_desc: "Authentieke \"Danjo\" (Gesmede) technologie voor superieure dichtheid en scherptebehoud.",
      mat_title: "Premium Staal", mat_desc: "Vervaardigd van hoogwaardig roestvrij staal, wereldwijd bekend om zuiverheid en duurzaamheid."
    },
    shop: { title: "De Koninklijke Collectie", subtitle: "Ervaar het verschil van Koreaans staal.", from: "vanaf" },
    filters: { all: "Alles", sets: "Sets", gold: "Goud", silver: "Zilver" },
    product: { 
      back: "Terug naar Winkel", 
      collection: "Collectie", 
      set_price: "Setprijs", 
      add_set: "Voeg Volledige Set toe",
      choose_set: "Kies Uw Set",
      full_set: "24-Delige Volledige Set",
      service_6: "Service voor 6 Personen",
      place_setting: "4-Delige Couvert",
      service_1: "Service voor 1 Persoon",
      tech_specs: "Technische Specificaties",
      tech_desc: "Elk stuk is vervaardigd volgens de strenge Sura Standaard. Bekijk hieronder de precieze afmetingen en materialen.",
      shop_individual: "Koop Losse Stukken",
      shop_ind_desc: "Vervanging nodig of een eigen collectie samenstellen? Selecteer hieronder individuele onderdelen.",
      drawing: "Tekening",
      length: "Lengte",
      gauge: "Dikte",
      steel: "Staal",
      pc: "/ st",
      material: "Materiaal",
      finish: "Afwerking",
      origin: "Herkomst",
      origin_val: "Zuid-Korea / Indonesië",
      in_stock: "Op Voorraad - Verzonden vanuit Den Haag"
    },
    cart: { title: "Uw Winkelwagen", empty: "Uw winkelwagen is leeg.", continue: "Verder Winkelen", total: "Totaal", checkout: "Veilig Afrekenen" },
    footer: { privacy: "Privacybeleid", terms: "Algemene Voorwaarden", rights: "Alle rechten voorbehouden." },
    stock: { inStock: "Op Voorraad", lowStock: "Nog maar {count}!", outOfStock: "Niet op Voorraad", soldOut: "Uitverkocht" }
  }
};

// --- REAL PRODUCT DATA ---
const PRODUCTS = [
  // --- GOLD COLLECTION ---
  { 
    id: 20, 
    name: "Moon Gold", 
    category: "Gold", 
    image: "/images/Moon Gold.jpg", 
    description: "Our signature set. Celestial beauty in 24k gold finish. Hand-polished for a brilliant shine.",
    description_nl: "Onze kenmerkende set. Hemelse schoonheid in 24k gouden afwerking. Handgepolijst voor een schitterende glans.",
    specs: { material: "18/10 Stainless Steel", finish: "Mirror Polish + PVD Gold" },
    price_full_set: 380,     
    price_place_setting: 72, 
    stripe_link: "", 
    components: [
      { name: "Dinner Knife", name_nl: "Diner mes", len: "232mm", thick: "7.0mm", material: "13/0", price: 22 },
      { name: "Dinner Spoon", name_nl: "Diner lepel", len: "200mm", thick: "3.5mm", material: "18/10", price: 20 },
      { name: "Dinner Fork", name_nl: "Diner vork", len: "201mm", thick: "3.5mm", material: "18/10", price: 20 },
      { name: "Tea Spoon", name_nl: "Theelepel", len: "143mm", thick: "2.5mm", material: "18/10", price: 16 },
      { name: "Dessert Knife", name_nl: "Dessert mes", len: "208mm", thick: "7.0mm", material: "13/0", price: 21 },
      { name: "Dessert Fork", name_nl: "Dessert vork", len: "181mm", thick: "3.0mm", material: "18/10", price: 19 },
      { name: "Cake Fork", name_nl: "Gebaksvorkje", len: "161mm", thick: "6.0mm", material: "13/0", price: 19 }
    ]
  },
  { 
    id: 24, 
    name: "Pandora Gold", 
    category: "Gold", 
    image: "/images/Pandora Gold.jpg", 
    description: "Unleash luxury with this premium heavy-gauge set. Bold, substantial, and unforgettable.",
    description_nl: "Ontketen luxe met deze premium zware set. Gedurfd, substantieel en onvergetelijk.",
    specs: { material: "18/10 Stainless Steel", finish: "Mirror Polish + PVD Gold" },
    price_full_set: 395,
    price_place_setting: 75,
    stripe_link: "",
    components: [
      { name: "Dinner Knife", name_nl: "Diner mes", len: "248mm", thick: "9.0mm", material: "13/0", price: 24 },
      { name: "Dinner Spoon", name_nl: "Diner lepel", len: "208mm", thick: "5.5mm", material: "18/10", price: 22 },
      { name: "Dinner Fork", name_nl: "Diner vork", len: "212mm", thick: "5.5mm", material: "18/10", price: 22 },
      { name: "Tea Spoon", name_nl: "Theelepel", len: "142mm", thick: "4.0mm", material: "18/10", price: 18 }
    ]
  },
  // ... Other Gold Sets
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
    description_nl: "Minimalistisch ontwerp voor het moderne huis. 18/0 roestvrij staal.",
    specs: { material: "18/0 Stainless Steel", finish: "Mirror Finish" },
    price_full_set: 220,
    price_place_setting: 45,
    stripe_link: "",
    components: [
      { name: "Dinner Knife", name_nl: "Diner mes", len: "225mm", thick: "6.0mm", material: "13/0", price: 15 },
      { name: "Dinner Fork", name_nl: "Diner vork", len: "200mm", thick: "4.0mm", material: "18/0", price: 12 },
      { name: "Dessert Spoon", name_nl: "Dessert lepel", len: "186mm", thick: "3.5mm", material: "18/0", price: 12 },
      { name: "Tea Spoon", name_nl: "Theelepel", len: "150mm", thick: "3.5mm", material: "18/0", price: 9 }
    ]
  },
  { id: 51, name: "Armesh", category: "Silver", image: "/images/Armesh.jpg", description: "Intricate detailing.", price_full_set: 260, price_place_setting: 49, components: [] },
  { id: 52, name: "Jacob", category: "Silver", image: "/images/Jacob.jpg", description: "Simple, honest, and built to last.", price_full_set: 230, price_place_setting: 45, components: [] },
  { id: 53, name: "Jaime", category: "Silver", image: "/images/Jaime.jpg", description: "Bold and substantial.", price_full_set: 260, price_place_setting: 50, components: [] },
  { id: 54, name: "Jambi", category: "Silver", image: "/images/Jambi.jpg", description: "Exotic inspiration.", price_full_set: 250, price_place_setting: 48, components: [] },
  { id: 55, name: "Kaizen", category: "Silver", image: "/images/Kaizen.jpg", description: "Continuous improvement.", price_full_set: 270, price_place_setting: 52, components: [] },
  { id: 57, name: "Karina", category: "Silver", image: "/images/Karina.jpg", description: "Graceful elegance.", price_full_set: 245, price_place_setting: 48, components: [] },
  { id: 58, name: "Lucius", category: "Silver", image: "/images/Lucius.jpg", description: "Light and brilliant.", price_full_set: 265, price_place_setting: 51, components: [] },
  { id: 59, name: "Mercy", category: "Silver", image: "/images/Mercy.jpg", description: "Soft edges.", price_full_set: 235, price_place_setting: 46, components: [] },
  { id: 60, name: "Moon", category: "Silver", image: "/images/Moon.jpg", description: "Celestial beauty.", price_full_set: 280, price_place_setting: 54, components: [] },
  { id: 61, name: "Murray", category: "Silver", image: "/images/Murray.jpg", description: "Sturdy reliability.", price_full_set: 230, price_place_setting: 45, components: [] },
  { id: 62, name: "Neville", category: "Silver", image: "/images/Neville.jpg", description: "Classic heritage.", price_full_set: 240, price_place_setting: 47, components: [] },
  { id: 63, name: "Noah Brushed", category: "Silver", image: "/images/Noah Brushed.jpg", description: "Contemporary matte.", price_full_set: 260, price_place_setting: 50, components: [] },
  { id: 64, name: "Pandora", category: "Silver", image: "/images/Pandora.jpg", description: "Unleash luxury.", price_full_set: 275, price_place_setting: 53, components: [] },
  { id: 65, name: "Sander Brushed", category: "Silver", image: "/images/Sander Brushed.jpg", description: "Industrial chic.", price_full_set: 250, price_place_setting: 49, components: [] },
  { id: 66, name: "Sienna", category: "Silver", image: "/images/Sienna.jpg", description: "Warm and inviting.", price_full_set: 245, price_place_setting: 48, components: [] },
  { id: 67, name: "Tucson", category: "Silver", image: "/images/Tucson.jpg", description: "Rugged elegance.", price_full_set: 235, price_place_setting: 46, components: [] },
  { id: 68, name: "Umbridge", category: "Silver", image: "/images/Umbridge.jpg", description: "Superior quality.", price_full_set: 255, price_place_setting: 50, components: [] },
  { id: 69, name: "Vermilio", category: "Silver", image: "/images/Vermilio.jpg", description: "Vibrant and striking.", price_full_set: 260, price_place_setting: 51, components: [] },
  { id: 70, name: "Xena Faceted", category: "Silver", image: "/images/Xena Faceted.jpg", description: "Geometric facets.", price_full_set: 300, price_place_setting: 58, components: [] },
  { id: 71, name: "Zoya", category: "Silver", image: "/images/Zoya.jpg", description: "Life and brilliance.", price_full_set: 245, price_place_setting: 48, components: [] }
];

const REVIEWS = [
  { id: 1, text: "The Moon Gold set is absolutely stunning. The weight feels substantial and the finish is flawless.", author: "Chef Min-ho K." },
  { id: 2, text: "The quality of the steel is exceptional. It hasn't rusted or dulled in months.", author: "Sarah L." },
  { id: 3, text: "The balance reminds me of high-end Japanese cutlery, but at a better price point.", author: "James T." }
];

// --- COMPONENTS (Defined BEFORE Usage) ---

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

// Moved Component Definitions BEFORE App
const MobileNav = ({ isOpen, onClose, navigate, lang, setLang, t }) => {
  return (
    <>
      <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <span className="text-xl font-serif font-bold">SURA STEEL</span>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full"><X size={20} /></button>
        </div>
        <nav className="p-6 space-y-4 flex flex-col">
          <button onClick={() => { onClose(); navigate('home'); }} className="text-left text-lg font-medium text-stone-800 hover:text-amber-700">{t.nav.shop}</button>
          <button onClick={() => { onClose(); navigate('about'); }} className="text-left text-lg font-medium text-stone-800 hover:text-amber-700">{t.nav.about}</button>
          <button onClick={() => { onClose(); navigate('contact'); }} className="text-left text-lg font-medium text-stone-800 hover:text-amber-700">{t.nav.contact}</button>
          <div className="border-t border-stone-100 pt-4 mt-2">
            <button onClick={() => setLang('en')} className={`mr-4 font-bold ${lang === 'en' ? 'text-amber-700' : 'text-stone-400'}`}>EN</button>
            <button onClick={() => setLang('nl')} className={`font-bold ${lang === 'nl' ? 'text-amber-700' : 'text-stone-400'}`}>NL</button>
          </div>
        </nav>
      </div>
    </>
  );
};

const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, lang }) => {
  const t = TRANSLATIONS[lang].cart;
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session. Please try again.');
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error processing checkout. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
            <h2 className="text-xl font-serif text-stone-900">{t.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center text-stone-500 mt-10">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                <p>{t.empty}</p>
                <button onClick={onClose} className="text-stone-900 underline mt-4 hover:text-amber-700">{t.continue}</button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded bg-stone-100" />
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-900">{item.name}</h3>
                    <p className="text-xs text-stone-500">{item.variantDisplay || item.variant}</p>
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
              <div className="flex justify-between mb-4 text-lg font-serif font-medium"><span>{t.total}</span><span>€{total.toFixed(2)}</span></div>
              <Button onClick={handleCheckout} className="w-full">{isCheckingOut ? '...' : t.checkout}</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ProductCard = React.memo(({ product, onViewDetails, lang, t, getStock }) => {
  // Check stock for the place setting variant (most common purchase, using database variant name)
  const stock = getStock ? getStock(product.id, 'place_setting') : null;
  const isOutOfStock = stock !== null && stock === 0;
  const isLowStock = stock !== null && stock > 0 && stock <= 5;

  return (
    <div className="group relative">
      <div className="aspect-[4/5] overflow-hidden bg-stone-100 mb-4 cursor-pointer relative" onClick={() => onViewDetails(product)}>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
            <span className="bg-white text-stone-900 px-4 py-2 font-bold text-sm uppercase tracking-wider">{t.stock?.outOfStock || 'Out of Stock'}</span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded">
            {(t.stock?.lowStock || 'Only {count} left!').replace('{count}', stock)}
          </div>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className={`h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ${isOutOfStock ? 'grayscale' : ''}`}
        />
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button className="w-full shadow-lg">{t.product.collection}</Button>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">{product.category} {t.product.collection}</p>
          <h3 className="text-lg font-serif text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer" onClick={() => onViewDetails(product)}>{product.name}</h3>
        </div>
        <p className="font-medium text-stone-900">{t.shop.from} €{product.price_place_setting}</p>
      </div>
    </div>
  );
});

// --- PAGES (Defined BEFORE App) ---

const HomePage = ({ addToCart, activeCategory, setActiveCategory, onViewDetails, lang, t, getStock }) => {
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
            <span className="px-5 py-2 rounded-full border border-amber-200/30 text-amber-100 text-[10px] uppercase tracking-[0.3em] font-light bg-black/10 backdrop-blur-md">{t.hero.badge}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">{t.hero.title}</h1>
          <p className="text-lg text-stone-200 mb-10 max-w-2xl mx-auto font-light">{t.hero.desc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>{t.hero.cta}</Button>
          </div>
        </div>
      </header>

      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4"><div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900"><Crown size={24} /></div><h3 className="text-xl font-serif">{t.features.std_title}</h3><p className="text-stone-500 leading-relaxed">{t.features.std_desc}</p></div>
            <div className="space-y-4"><div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900"><Hammer size={24} /></div><h3 className="text-xl font-serif">{t.features.tech_title}</h3><p className="text-stone-500 leading-relaxed">{t.features.tech_desc}</p></div>
            <div className="space-y-4"><div className="w-16 h-16 mx-auto bg-stone-200 rounded-full flex items-center justify-center text-stone-900"><ShieldCheck size={24} /></div><h3 className="text-xl font-serif">{t.features.mat_title}</h3><p className="text-stone-500 leading-relaxed">{t.features.mat_desc}</p></div>
          </div>
        </div>
      </section>

      <section id="shop" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div><h2 className="text-4xl font-serif text-stone-900 mb-4">{t.shop.title}</h2><p className="text-stone-500">{t.shop.subtitle}</p></div>
            <div className="flex gap-4 border-b border-stone-200 pb-2 overflow-x-auto">
              {['All', 'Sets', 'Gold', 'Silver'].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`pb-2 text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${activeCategory === cat ? 'text-stone-900 border-b-2 border-stone-900 -mb-[9px]' : 'text-stone-400 hover:text-stone-600'}`}>{cat === 'All' ? t.filters.all : cat === 'Sets' ? t.filters.sets : cat === 'Gold' ? t.filters.gold : t.filters.silver}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map(product => (<ProductCard key={product.id} product={product} onViewDetails={onViewDetails} lang={lang} t={t} getStock={getStock} />))}
          </div>
        </div>
      </section>
    </>
  );
};

const ProductDetailPage = ({ product, onBack, onAddToCart, lang, getStock }) => {
  const [selectedOption, setSelectedOption] = useState('set');
  const t = TRANSLATIONS[lang].product;
  const tStock = TRANSLATIONS[lang].stock;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) return null;

  const description = lang === 'nl' && product.description_nl ? product.description_nl : product.description;

  // Get stock for both variants (using database variant names)
  const fullSetStock = getStock ? getStock(product.id, 'full_set') : null;
  const placeSettingStock = getStock ? getStock(product.id, 'place_setting') : null;
  
  // Check if current selection is out of stock
  const currentStock = selectedOption === 'set' ? fullSetStock : placeSettingStock;
  const isOutOfStock = currentStock !== null && currentStock === 0;
  const isLowStock = currentStock !== null && currentStock > 0 && currentStock <= 5;

  const handleAddMainSet = () => {
    if (isOutOfStock) return;
    const variantDisplay = selectedOption === 'set' ? t.full_set : t.place_setting;
    const variantDb = selectedOption === 'set' ? 'full_set' : 'place_setting';
    const price = selectedOption === 'set' ? product.price_full_set : product.price_place_setting;
    onAddToCart({ ...product, name: product.name, price: price, variant: variantDb, variantDisplay: variantDisplay });
  };

  const handleAddSingle = (comp) => {
     const compName = lang === 'nl' && comp.name_nl ? comp.name_nl : comp.name;
     onAddToCart({ 
       id: product.id, 
       image: product.image,
       name: product.name, 
       price: comp.price || 20, 
       variant: `${compName} (Single)`,
       category: product.category
     });
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6 mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-6">
          <ArrowLeft size={20} /> {t.back}
        </button>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2">
             <div className="aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden shadow-xl sticky top-24">
               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
             </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col">
             <h1 className="text-4xl font-serif text-stone-900 mb-2">{product.name}</h1>
             <span className="text-amber-600 text-sm font-bold tracking-widest uppercase mb-6">{product.category} {t.collection}</span>
             <p className="text-stone-600 text-lg mb-8 leading-relaxed">{description}</p>
             
             <div className="bg-white border border-stone-200 rounded-lg p-6 mb-8 shadow-sm">
                <h3 className="text-sm font-bold text-stone-900 uppercase mb-4">{t.choose_set}</h3>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${selectedOption === 'set' ? 'border-amber-500 bg-amber-50' : 'border-stone-200 hover:border-stone-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="set-type" checked={selectedOption === 'set'} onChange={() => setSelectedOption('set')} className="text-amber-600 focus:ring-amber-500" />
                      <div>
                        <span className="block font-bold text-stone-900">{t.full_set}</span>
                        <span className="text-xs text-stone-500">{t.service_6}</span>
                      </div>
                    </div>
                    <span className="font-serif text-xl text-stone-900">€{product.price_full_set}</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 border rounded cursor-pointer transition-all ${selectedOption === 'place' ? 'border-amber-500 bg-amber-50' : 'border-stone-200 hover:border-stone-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="set-type" checked={selectedOption === 'place'} onChange={() => setSelectedOption('place')} className="text-amber-600 focus:ring-amber-500" />
                      <div>
                        <span className="block font-bold text-stone-900">{t.place_setting}</span>
                        <span className="text-xs text-stone-500">{t.service_1}</span>
                      </div>
                    </div>
                    <span className="font-serif text-xl text-stone-900">€{product.price_place_setting}</span>
                  </label>
                </div>
                {/* Stock Status */}
                {currentStock !== null && (
                  <div className={`mt-4 text-center py-2 rounded ${isOutOfStock ? 'bg-red-50 text-red-700' : isLowStock ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                    {isOutOfStock 
                      ? (tStock?.outOfStock || 'Out of Stock')
                      : isLowStock 
                        ? (tStock?.lowStock || 'Only {count} left!').replace('{count}', currentStock)
                        : (tStock?.inStock || 'In Stock')}
                  </div>
                )}
                <Button 
                  onClick={handleAddMainSet} 
                  className={`w-full mt-4 py-4 text-lg ${isOutOfStock ? 'bg-stone-400 cursor-not-allowed hover:bg-stone-400' : ''}`}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? (tStock?.soldOut || 'Sold Out') : t.add_set}
                </Button>
             </div>
             
             {product.specs && (
               <div className="grid grid-cols-2 gap-4 text-sm border-t border-stone-100 pt-6">
                  <div><span className="block text-stone-400 text-xs uppercase tracking-wider mb-1">{t.material}</span><span className="font-medium text-stone-900">{product.specs.material}</span></div>
                  <div><span className="block text-stone-400 text-xs uppercase tracking-wider mb-1">{t.finish}</span><span className="font-medium text-stone-900">{product.specs.finish || "Standard"}</span></div>
               </div>
             )}
          </div>
        </div>
      </div>

      {product.components && (
        <div className="bg-stone-50 py-20 border-t border-stone-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif text-stone-900 mb-3">{t.tech_specs}</h2>
              <p className="text-stone-500 max-w-2xl mx-auto">{t.tech_desc}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {(product.components.length > 0 ? product.components : [
                  { name: "Dinner Knife", len: "Standard", thick: "Standard", material: "13/0", price: 22 },
                  { name: "Dinner Fork", len: "Standard", thick: "Standard", material: "18/10", price: 20 },
              ]).map((comp, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 text-center group relative overflow-hidden flex flex-col h-full">
                  <div className="h-24 mb-6 flex items-center justify-center text-stone-300 relative">
                     <div className="border border-dashed border-stone-200 w-full h-full flex items-center justify-center rounded bg-stone-50/50">
                        <span className="text-xs text-stone-400 font-mono tracking-widest uppercase">{t.drawing}</span>
                     </div>
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 mb-2">{lang === 'nl' && comp.name_nl ? comp.name_nl : comp.name}</h3>
                  <div className="text-xs text-stone-500 space-y-1 mb-4 flex-grow">
                     <p>{t.length}: {comp.len}</p>
                     <p>{t.gauge}: {comp.thick}</p>
                     <p>{t.steel}: {comp.material}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                     <span className="font-serif text-lg text-stone-900">€{comp.price || 20} {t.pc}</span>
                     <button onClick={() => handleAddSingle(comp)} className="bg-stone-900 text-white p-2 rounded-full hover:bg-amber-600 transition-colors"><Plus size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AboutPage = () => (
  <div className="pt-32 pb-24">
    <div className="container mx-auto px-6 max-w-3xl">
      <div className="space-y-8 text-lg text-stone-600 leading-relaxed">
        
        {/* Origin Story */}
        <h2 className="text-2xl font-bold text-stone-900">It started with a meatball.</h2>
        
        <p>I was 18 years old, sitting in the crowded cafeteria of that famous Swedish furniture store. I remember the moment vividly: I was enjoying a plate of their iconic meatballs. The food was delicious, comforting, and warm. But something felt wrong.</p>
        
        <p>It wasn't the meatball, it was the fork.</p>
        
        <p>It was flimsy. It felt light and cheap in my hand. The edges were rough against my lip, and the finish looked dull and tarnished. I realized then that the joy of eating isn't just about the taste, it is a tactile experience. The tool we use to deliver food to our mouths is just as important as the ingredients on the plate.</p>
        
        <p>That single meal sparked an obsession that would last over a decade.</p>
        
        <p>I went back home to my parents' basement, not to build furniture, but to deconstruct the dining experience. I wanted to understand why some fork feels "right" and other fork feels "wrong." What followed were hundreds—eventually thousands of experiments.</p>
        
        <p>We tested specific gravity to find the perfect <b>weight</b>. We contoured handles to discover the ultimate <b>grip</b>. We studied metallurgy to maximize <b>resistance to tarnishing</b>. We chased a specific "mouthfeel"—smooth, substantial, and invisible.</p>
        
        <p>It took ten years of trial, error, and obsession to get it right. But we finally did.</p>
        
        <p>The perfect grip, perfect weight, perfect aesthetics, resistance to time. We engineered the bridge between you and your food. Welcome to the result of a decade of perfectionism.</p>

        {/* The Meaning of Sura */}
        <h2 className="text-2xl font-bold text-stone-900 pt-8">The Meaning of Sura</h2>
        
        <p>In the Joseon Dynasty of Korea, the King's daily meal was called "Sura" (수라).</p>
        
        <p>It was not merely food, it was a symbol of the nation's prosperity, prepared with the finest ingredients and served with the utmost respect. We named our brand Sura because we believe the tools used to enjoy a meal should carry that same dignity. We offer quality, balance, and refinement fit for a king's table.</p>

        {/* Our Heritage */}
        <h2 className="text-2xl font-bold text-stone-900 pt-8">Our Heritage: Precision Meets Tradition</h2>
        
        <p>While our vision began in a basement, our quality is born from history.</p>
        
        <p>Our roots run deep into the metalworking legends of Tsubame, Japan - a city world renowned for metal polishing—and have been refined in Korea since 1970.</p>
        
        <p>By partnering with Korean experts for high-grade stainless steel and employing authentic "Danjo" (Forged) technology, we create enduring tools designed to last generations. This is where modern obsession meets ancient craft.</p>
        
        <p className="font-bold text-stone-900 pt-4">Welcome to the result of a decade of perfectionism.</p>
        
      </div>
    </div>
  </div>
);

const ContactPage = ({ lang }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    en: {
      title: "Contact Us",
      name: "Your Name",
      email: "Email Address",
      message: "Message",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent! We'll get back to you soon.",
      error: "Failed to send. Please try again or email us directly."
    },
    nl: {
      title: "Neem Contact Op",
      name: "Uw Naam",
      email: "E-mailadres",
      message: "Bericht",
      send: "Verstuur Bericht",
      sending: "Versturen...",
      success: "Bericht verzonden! We nemen snel contact met u op.",
      error: "Verzenden mislukt. Probeer het opnieuw of mail ons direct."
    }
  };

  const t = content[lang] || content.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/.netlify/functions/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: t.success });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || t.error });
      }
    } catch (error) {
      setStatus({ type: 'error', message: t.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl font-serif text-stone-900 mb-12 text-center">{t.title}</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><Mail size={18} /> Email</h3>
              <a href="mailto:info@surasteel.com" className="text-stone-600 hover:text-amber-700 transition-colors">info@surasteel.com</a>
            </div>
            <div>
              <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><Phone size={18} /> Phone</h3>
              <a href="tel:+31685540430" className="text-stone-600 hover:text-amber-700 transition-colors">+31 6 8554 0430</a>
            </div>
            <div>
              <h3 className="font-bold text-stone-900 mb-2 flex items-center gap-2"><MapPin size={18} /> HQ</h3>
              <p className="text-stone-600">The Hague, Netherlands</p>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <h3 className="font-bold text-stone-900 mb-3">Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-amber-100 hover:text-amber-700 transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-amber-100 hover:text-amber-700 transition-colors">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder={t.name}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors" 
            />
            <input 
              type="email" 
              placeholder={t.email}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors" 
            />
            <textarea 
              rows="4" 
              placeholder={t.message}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors resize-none"
            />
            {status.message && (
              <div className={`p-3 rounded text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {status.type === 'success' && <Check size={16} className="inline mr-2" />}
                {status.message}
              </div>
            )}
            <Button className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t.sending : t.send}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

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

const SuccessPage = ({ onContinueShopping, lang }) => {
  const content = {
    en: {
      title: "Thank You for Your Order!",
      subtitle: "Your order has been confirmed",
      message: "We've received your payment and are preparing your cutlery. You'll receive a confirmation email shortly with your order details.",
      orderInfo: "What happens next?",
      steps: [
        { icon: "📧", title: "Confirmation Email", desc: "You'll receive an order confirmation within a few minutes." },
        { icon: "📦", title: "Preparation", desc: "Our artisans will carefully package your cutlery set." },
        { icon: "🚚", title: "Shipping", desc: "Ships from The Hague within 1-2 business days." },
        { icon: "🏠", title: "Delivery", desc: "EU: 3-5 days (depending on the country) | International: 7-14 days" }
      ],
      cta: "Continue Shopping",
      support: "Questions? Contact us at info@surasteel.com"
    },
    nl: {
      title: "Bedankt voor uw bestelling!",
      subtitle: "Uw bestelling is bevestigd",
      message: "We hebben uw betaling ontvangen en bereiden uw koninklijk bestek voor. U ontvangt binnenkort een bevestigingsmail met uw bestelgegevens.",
      orderInfo: "Wat gebeurt er nu?",
      steps: [
        { icon: "📧", title: "Bevestigingsmail", desc: "U ontvangt binnen enkele minuten een orderbevestiging." },
        { icon: "📦", title: "Voorbereiding", desc: "Onze ambachtslieden zullen uw bestekset zorgvuldig inpakken." },
        { icon: "🚚", title: "Verzending", desc: "Verzonden vanuit Den Haag binnen 1-2 werkdagen." },
        { icon: "🏠", title: "Levering", desc: "EU: 3-5 dagen | Internationaal: 7-14 dagen" }
      ],
      cta: "Verder Winkelen",
      support: "Vragen? Neem contact op via info@surasteel.com"
    }
  };

  const t = content[lang] || content.en;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Success Icon */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-[pulse_2s_ease-in-out_1]">
            <Check size={48} className="text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-3">{t.title}</h1>
          <p className="text-xl text-amber-600 font-medium">{t.subtitle}</p>
        </div>

        {/* Message */}
        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm mb-10 text-center">
          <p className="text-stone-600 text-lg leading-relaxed">{t.message}</p>
        </div>

        {/* Order Timeline */}
        <div className="bg-stone-900 text-white rounded-xl p-8 mb-10">
          <h2 className="text-xl font-serif mb-8 text-center">{t.orderInfo}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {t.steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-stone-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button onClick={onContinueShopping} className="px-12 py-4 text-lg">
            {t.cta} <ArrowRight size={20} />
          </Button>
          <p className="text-stone-500 text-sm mt-6">{t.support}</p>
        </div>
      </div>
    </div>
  );
};

// --- Footer Component ---

const Footer = ({ navigate, lang }) => {
  const t = TRANSLATIONS[lang].footer;
  
  const content = {
    en: {
      tagline: "Dining Fit For Royalty",
      desc: "Premium Korean steel cutlery crafted with Tsubame precision. Serving royalty since 1970.",
      quickLinks: "Quick Links",
      shop: "Shop Collection",
      about: "Our Story",
      contact: "Contact Us",
      shipping: "Shipping & Returns",
      connect: "Connect",
      newsletter: "Newsletter",
      newsletterDesc: "Get updates on new collections and exclusive offers.",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe"
    },
    nl: {
      tagline: "Dineren Als Een Koning",
      desc: "Premium Koreaans stalen bestek vervaardigd met Tsubame-precisie. Koninklijke service sinds 1970.",
      quickLinks: "Snelle Links",
      shop: "Collectie Bekijken",
      about: "Ons Verhaal",
      contact: "Contact",
      shipping: "Verzending & Retour",
      connect: "Volg Ons",
      newsletter: "Nieuwsbrief",
      newsletterDesc: "Ontvang updates over nieuwe collecties en exclusieve aanbiedingen.",
      emailPlaceholder: "Voer uw e-mail in",
      subscribe: "Aanmelden"
    }
  };

  const c = content[lang] || content.en;

  return (
    <footer className="bg-stone-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-serif font-bold mb-2">SURA STEEL</h3>
            <p className="text-amber-400 text-sm mb-4">{c.tagline}</p>
            <p className="text-stone-400 text-sm leading-relaxed">{c.desc}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">{c.quickLinks}</h4>
            <ul className="space-y-3 text-stone-400">
              <li><button onClick={() => navigate('home')} className="hover:text-amber-400 transition-colors">{c.shop}</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-amber-400 transition-colors">{c.about}</button></li>
              <li><button onClick={() => navigate('contact')} className="hover:text-amber-400 transition-colors">{c.contact}</button></li>
              <li><button onClick={() => navigate('policy')} className="hover:text-amber-400 transition-colors">{c.shipping}</button></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">{c.connect}</h4>
            <div className="flex gap-3 mb-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
            <div className="text-stone-400 text-sm space-y-2">
              <p className="flex items-center gap-2"><Mail size={14} /> info@surasteel.com</p>
              <p className="flex items-center gap-2"><Phone size={14} /> +31 6 8554 0430</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> The Hague, NL</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">{c.newsletter}</h4>
            <p className="text-stone-400 text-sm mb-4">{c.newsletterDesc}</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={c.emailPlaceholder}
                className="flex-1 px-4 py-2 bg-stone-800 border border-stone-700 rounded text-sm text-white placeholder-stone-500 focus:border-amber-500 outline-none transition-colors"
              />
              <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-sm font-medium transition-colors">
                {c.subscribe}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-stone-500 text-sm">
            <p>© {new Date().getFullYear()} Sura Steel. {t.rights}</p>
            <div className="flex gap-6">
              <button onClick={() => navigate('policy')} className="hover:text-amber-400 transition-colors">{t.privacy}</button>
              <button onClick={() => navigate('policy')} className="hover:text-amber-400 transition-colors">{t.terms}</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

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
  const [lang, setLang] = useState('nl'); // 'nl' or 'en'
  const [inventory, setInventory] = useState({});

  const t = TRANSLATIONS[lang];

  // Fetch inventory on load
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        console.log('Fetching inventory...');
        const response = await fetch('/.netlify/functions/get-inventory');
        const data = await response.json();
        console.log('Inventory response:', data);
        
        if (data.inventory && Array.isArray(data.inventory)) {
          // Convert array to object keyed by product_id + variant
          const inventoryMap = {};
          data.inventory.forEach(item => {
            const key = `${item.product_id}-${item.variant}`;
            inventoryMap[key] = item.stock;
            console.log(`Inventory item: ${key} = ${item.stock}`);
          });
          setInventory(inventoryMap);
          console.log('Inventory loaded:', Object.keys(inventoryMap).length, 'items');
        } else {
          console.log('No inventory data or empty array:', data.message || 'No message');
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    fetchInventory();
  }, []);

  // Helper function to get stock for a product variant
  const getStock = (productId, variant) => {
    const key = `${productId}-${variant}`;
    const stock = inventory[key] ?? null;
    console.log(`Stock check: ${key} = ${stock} (inventory has ${Object.keys(inventory).length} items)`);
    return stock; // null means not tracked (unlimited)
  };

  // Check for successful payment on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setView('success');
      setCart([]); // Clear cart after successful purchase
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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
      const uniqueId = `${item.id}-${item.variant}`;
      const existing = prev.find(p => `${p.id}-${p.variant}` === uniqueId);
      if (existing) { return prev.map(p => `${p.id}-${p.variant}` === uniqueId ? { ...p, quantity: p.quantity + 1 } : p); }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
    showNotification(`Added ${item.name}`);
  };

  const updateQuantity = (id, variant, delta) => {
    setCart(prev => prev.map(item => (item.id === id && item.variant === variant) ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id, variant) => setCart(prev => prev.filter(item => !(item.id === id && item.variant === variant)));

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} navigate={navigate} lang={lang} setLang={setLang} t={t} />

      <nav className={`fixed w-full z-30 transition-all duration-300 ${scrolled || view !== 'home' ? 'bg-white/95 backdrop-blur-md shadow-sm py-4 text-stone-900' : 'bg-transparent py-6 text-white'}`}>
        <div className="container mx-auto px-6 grid grid-cols-3 items-center">
          <div className="flex items-center gap-4 justify-self-start">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"><Menu size={24} /></button>
            <button onClick={() => navigate('home')} className="text-2xl font-serif tracking-tight font-bold">SURA STEEL</button>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide justify-self-center">
            <button onClick={() => navigate('home')}>{t.nav.shop}</button>
            <button onClick={() => navigate('about')}>{t.nav.about}</button>
            <button onClick={() => navigate('contact')}>{t.nav.contact}</button>
          </div>
          <div className="flex items-center gap-6 justify-self-end">
            <button onClick={() => setLang(lang === 'en' ? 'nl' : 'en')} className="hidden md:block font-bold text-xs uppercase border border-current px-2 py-1 rounded">{lang}</button>
            <button onClick={() => setIsCartOpen(true)}><ShoppingBag size={24} /></button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {view === 'home' && <HomePage addToCart={addToCart} activeCategory={activeCategory} setActiveCategory={setActiveCategory} onViewDetails={handleViewDetails} lang={lang} t={t} getStock={getStock} />}
        {view === 'product' && <ProductDetailPage product={selectedProduct} onBack={() => setView('home')} onAddToCart={addToCart} lang={lang} getStock={getStock} />}
        {view === 'about' && <AboutPage />}
        {view === 'contact' && <ContactPage lang={lang} />}
        {view === 'policy' && <PolicyPage title="Shipping & Returns" />}
        {view === 'success' && <SuccessPage onContinueShopping={() => navigate('home')} lang={lang} />}
      </main>

      <Footer navigate={navigate} lang={lang} />

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} lang={lang} />
      {notification && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded shadow-xl z-50 flex items-center gap-3"><Check size={16} /> {notification}</div>}
    </div>
  );
};

export default App;