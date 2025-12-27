import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingBag, X, Menu, Star, Check, Instagram, Facebook, Twitter, ArrowRight, Hammer, Globe, ShieldCheck, Mail, MapPin, Phone, Crown, Ruler, Scale, ArrowLeft, Plus, Minus, Languages, Lock, LogOut, Package, BarChart3, Boxes, RefreshCw, TrendingUp, DollarSign, ShoppingCart, Eye, EyeOff, User, History, Settings, ChevronRight, Truck } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CLIENT ---
// Note: These values should be set in environment variables
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// Vite requires VITE_ prefix for client-side environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// --- AUTH CONTEXT ---
const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
    cart: {
      title: "Your Basket",
      empty: "Your basket is empty.",
      continue: "Continue Shopping",
      total: "Total",
      checkout: "Checkout Securely",
      discountCode: "Discount Code",
      discountPlaceholder: "Enter code",
      apply: "Apply",
      remove: "Remove",
      discount: "Discount",
      subtotal: "Subtotal"
    },
    footer: { privacy: "Privacy Policy", terms: "Terms of Service", rights: "All rights reserved." },
    stock: { inStock: "In Stock", lowStock: "Only {count} left!", outOfStock: "Out of Stock", soldOut: "Sold Out" },
    account: {
      title: "My Account",
      profile: "Profile",
      orders: "My Orders",
      logout: "Logout",
      loggedOut: "Logged out successfully",
      noOrders: "You haven't placed any orders yet",
      orderNumber: "Order #",
      orderDate: "Order Date",
      orderTotal: "Total",
      orderStatus: "Status",
      viewDetails: "View Details",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      save: "Save Changes",
      saved: "Profile updated!"
    },
    login: {
      title: "Login to Your Account",
      email: "Email Address",
      password: "Password",
      submit: "Login",
      noAccount: "Don't have an account?",
      signup: "Sign up here",
      error: "Invalid email or password",
      loading: "Logging in..."
    },
    signup: {
      title: "Create an Account",
      name: "Full Name",
      email: "Email Address",
      password: "Password",
      submit: "Create Account",
      haveAccount: "Already have an account?",
      login: "Login here",
      error: "Failed to create account",
      loading: "Creating account...",
      passwordHint: "At least 6 characters"
    },
    admin: {
      login: "Admin Login",
      password: "Password",
      loginBtn: "Login",
      logout: "Logout",
      dashboard: "Dashboard",
      orders: "Orders",
      inventory: "Inventory",
      analytics: "Analytics",
      loading: "Loading...",
      error: "Error loading data",
      noOrders: "No orders found",
      orderId: "Order ID",
      date: "Date",
      customer: "Customer",
      total: "Total",
      items: "Items",
      status: "Status",
      product: "Product",
      variant: "Variant",
      stock: "Stock",
      update: "Update",
      save: "Save",
      saved: "Saved!",
      totalRevenue: "Total Revenue",
      orderCount: "Total Orders",
      avgOrder: "Average Order",
      popularProducts: "Popular Products",
      quantity: "Qty Sold",
      revenue: "Revenue",
      last30Days: "Last 30 Days",
      last7Days: "Last 7 Days",
      last90Days: "Last 90 Days",
      revenueChart: "Daily Revenue",
      invalidPassword: "Invalid password",
      updateSuccess: "Inventory updated successfully",
      updateError: "Failed to update inventory"
    },
    account: {
      title: "My Account",
      login: "Login",
      signup: "Sign Up",
      logout: "Log Out",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      fullName: "Full Name",
      phone: "Phone Number",
      loginBtn: "Log In",
      signupBtn: "Create Account",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      orders: "Order History",
      profile: "Profile Settings",
      noOrders: "No orders yet",
      orderNumber: "Order",
      orderDate: "Date",
      orderStatus: "Status",
      orderTotal: "Total",
      viewDetails: "View Details",
      trackOrder: "Track Order",
      items: "Items",
      shippingAddress: "Shipping Address",
      trackingNumber: "Tracking Number",
      processing: "Processing",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      saveProfile: "Save Changes",
      profileSaved: "Profile saved successfully",
      welcomeBack: "Welcome back",
      guestCheckout: "Continue as Guest",
      orContinueWith: "or",
      loginRequired: "Please log in to view your orders",
      passwordMismatch: "Passwords do not match",
      signupSuccess: "Account created! Please check your email to verify.",
      loginError: "Invalid email or password",
      signupError: "Could not create account. Please try again."
    }
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
    cart: {
      title: "Uw Winkelwagen",
      empty: "Uw winkelwagen is leeg.",
      continue: "Verder Winkelen",
      total: "Totaal",
      checkout: "Veilig Afrekenen",
      discountCode: "Kortingscode",
      discountPlaceholder: "Voer code in",
      apply: "Toepassen",
      remove: "Verwijderen",
      discount: "Korting",
      subtotal: "Subtotaal"
    },
    footer: { privacy: "Privacybeleid", terms: "Algemene Voorwaarden", rights: "Alle rechten voorbehouden." },
    stock: { inStock: "Op Voorraad", lowStock: "Nog maar {count}!", outOfStock: "Niet op Voorraad", soldOut: "Uitverkocht" },
    account: {
      title: "Mijn Account",
      profile: "Profiel",
      orders: "Mijn Bestellingen",
      logout: "Uitloggen",
      loggedOut: "Succesvol uitgelogd",
      noOrders: "U heeft nog geen bestellingen geplaatst",
      orderNumber: "Bestelling #",
      orderDate: "Besteldatum",
      orderTotal: "Totaal",
      orderStatus: "Status",
      viewDetails: "Details Bekijken",
      name: "Volledige Naam",
      email: "E-mail",
      phone: "Telefoon",
      save: "Wijzigingen Opslaan",
      saved: "Profiel bijgewerkt!"
    },
    login: {
      title: "Inloggen op Uw Account",
      email: "E-mailadres",
      password: "Wachtwoord",
      submit: "Inloggen",
      noAccount: "Heeft u geen account?",
      signup: "Registreer hier",
      error: "Ongeldig e-mailadres of wachtwoord",
      loading: "Inloggen..."
    },
    signup: {
      title: "Account Aanmaken",
      name: "Volledige Naam",
      email: "E-mailadres",
      password: "Wachtwoord",
      submit: "Account Aanmaken",
      haveAccount: "Heeft u al een account?",
      login: "Log hier in",
      error: "Kan account niet aanmaken",
      loading: "Account aanmaken...",
      passwordHint: "Minimaal 6 tekens"
    },
    admin: {
      login: "Admin Inloggen",
      password: "Wachtwoord",
      loginBtn: "Inloggen",
      logout: "Uitloggen",
      dashboard: "Dashboard",
      orders: "Bestellingen",
      inventory: "Voorraad",
      analytics: "Analyses",
      loading: "Laden...",
      error: "Fout bij laden",
      noOrders: "Geen bestellingen gevonden",
      orderId: "Bestelling ID",
      date: "Datum",
      customer: "Klant",
      total: "Totaal",
      items: "Artikelen",
      status: "Status",
      product: "Product",
      variant: "Variant",
      stock: "Voorraad",
      update: "Bijwerken",
      save: "Opslaan",
      saved: "Opgeslagen!",
      totalRevenue: "Totale Omzet",
      orderCount: "Totaal Bestellingen",
      avgOrder: "Gemiddelde Bestelling",
      popularProducts: "Populaire Producten",
      quantity: "Aantal Verkocht",
      revenue: "Omzet",
      last30Days: "Laatste 30 Dagen",
      last7Days: "Laatste 7 Dagen",
      last90Days: "Laatste 90 Dagen",
      revenueChart: "Dagelijkse Omzet",
      invalidPassword: "Ongeldig wachtwoord",
      updateSuccess: "Voorraad bijgewerkt",
      updateError: "Voorraad bijwerken mislukt"
    }
  }
};

// --- REAL PRODUCT DATA ---
const PRODUCTS = [
  { 
    id: 60, 
    name: "Dal", 
    category: "Silver", 
    image: "/images/Dal.jpg", 
    description: "Our signature set. Celestial beauty with a mirror polish finish. Hand-crafted for timeless elegance.",
    description_nl: "Onze kenmerkende set. Hemelse schoonheid met een spiegelglans afwerking. Handgemaakt voor tijdloze elegantie.",
    specs: { material: "18/10 Stainless Steel", finish: "Mirror Polish" },
    price_full_set: 280,     
    price_place_setting: 54, 
    stripe_link: "", 
    components: [
      { name: "Dinner Knife", name_nl: "Diner mes", len: "232mm", thick: "7.0mm", material: "13/0", price: 18 },
      { name: "Dinner Spoon", name_nl: "Diner lepel", len: "200mm", thick: "3.5mm", material: "18/10", price: 16 },
      { name: "Dinner Fork", name_nl: "Diner vork", len: "201mm", thick: "3.5mm", material: "18/10", price: 16 },
      { name: "Tea Spoon", name_nl: "Theelepel", len: "143mm", thick: "2.5mm", material: "18/10", price: 12 },
      { name: "Dessert Knife", name_nl: "Dessert mes", len: "208mm", thick: "7.0mm", material: "13/0", price: 17 },
      { name: "Dessert Fork", name_nl: "Dessert vork", len: "181mm", thick: "3.0mm", material: "18/10", price: 15 },
      { name: "Cake Fork", name_nl: "Gebaksvorkje", len: "161mm", thick: "6.0mm", material: "13/0", price: 15 }
    ]
  }
];

const REVIEWS = [
  { id: 1, text: "The Dal set is absolutely stunning. The weight feels substantial and the mirror finish is flawless.", author: "Chef Min-ho K." },
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

const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, lang, user }) => {
  const t = TRANSLATIONS[lang].cart;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Calculate discount amount and total
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.discount_percent / 100) : 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    if (!user) {
      setDiscountError(lang === 'nl' ? 'Log in om een kortingscode te gebruiken' : 'Please log in to use a discount code');
      return;
    }

    setIsValidating(true);
    setDiscountError('');

    try {
      const response = await fetch('/.netlify/functions/validate-discount-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode.trim(),
          customer_id: user.id,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setAppliedDiscount({
          code: data.code,
          discount_percent: data.discount_percent,
        });
        setDiscountError('');
      } else {
        setDiscountError(data.error || (lang === 'nl' ? 'Ongeldige code' : 'Invalid code'));
      }
    } catch (error) {
      console.error('Discount validation error:', error);
      setDiscountError(lang === 'nl' ? 'Fout bij valideren' : 'Validation error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    setDiscountError('');
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Prepare checkout data with customer info if logged in
      const checkoutData = {
        cart,
        customer_id: user?.id || null,
        customer_email: user?.email || null,
        discount_code: appliedDiscount?.code || null,
      };

      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error creating checkout session. Please try again.');
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
            <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-4">
              {/* Discount Code Input */}
              <div>
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wide mb-2 block">{t.discountCode}</label>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <span className="font-medium text-green-800">{appliedDiscount.code}</span>
                      <span className="text-green-600 text-sm">(-{appliedDiscount.discount_percent}%)</span>
                    </div>
                    <button onClick={handleRemoveDiscount} className="text-stone-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder={t.discountPlaceholder}
                      className="flex-1 px-3 py-2 border border-stone-300 rounded text-sm focus:border-amber-500 outline-none transition-colors"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={isValidating || !discountCode.trim()}
                      className="px-4 py-2 bg-stone-900 text-white text-sm rounded hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isValidating ? '...' : t.apply}
                    </button>
                  </div>
                )}
                {discountError && (
                  <p className="text-red-500 text-xs mt-1">{discountError}</p>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>{t.subtotal}</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>{t.discount} (-{appliedDiscount.discount_percent}%)</span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-serif font-medium pt-2 border-t border-stone-200">
                  <span>{t.total}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

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

const HomePage = ({ addToCart, onViewDetails, lang, t, getStock }) => {

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
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-stone-900 mb-4">{t.shop.title}</h2>
            <p className="text-stone-500">{t.shop.subtitle}</p>
          </div>
          <div className="max-w-xl mx-auto">
            {PRODUCTS.map(product => (<ProductCard key={product.id} product={product} onViewDetails={onViewDetails} lang={lang} t={t} getStock={getStock} />))}
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

// --- Customer Account Components ---

const LoginPage = ({ lang, onLogin, navigate }) => {
  const t = TRANSLATIONS[lang].login;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      onLogin(data.user);
      navigate('account');
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-6 max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          <h1 className="text-3xl font-serif text-stone-900 mb-6 text-center">{t.title}</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.loading : t.submit}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-stone-600">
            {t.noAccount}{' '}
            <button
              onClick={() => navigate('signup')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              {t.signup}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignupPage = ({ lang, onSignup, navigate }) => {
  const t = TRANSLATIONS[lang].signup;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (authError) throw authError;

      if (data.user) {
        onSignup(data.user);
        navigate('account');
      }
    } catch (err) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-6 max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
          <h1 className="text-3xl font-serif text-stone-900 mb-6 text-center">{t.title}</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t.name}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-stone-500 mt-1">{t.passwordHint}</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.loading : t.submit}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-stone-600">
            {t.haveAccount}{' '}
            <button
              onClick={() => navigate('login')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              {t.login}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountPage = ({ lang, user, onLogout, navigate }) => {
  const t = TRANSLATIONS[lang].account;
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user && supabase) {
      // Fetch user profile
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile({
            full_name: data.full_name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
          });
        }
      };

      // Fetch orders
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const { data } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false });

          setOrders(data || []);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user || !supabase) return;

    setSaving(true);
    try {
      await supabase
        .from('customers')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
        })
        .eq('id', user.id);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    navigate('login');
    return null;
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-stone-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-stone-900">{t.title}</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <LogOut size={20} />
            {t.logout}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-stone-200 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-stone-900 border-b-2 border-stone-900 -mb-px'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Package size={20} className="inline mr-2" />
            {t.orders}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-stone-900 border-b-2 border-stone-900 -mb-px'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <User size={20} className="inline mr-2" />
            {t.profile}
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            {loading ? (
              <div className="text-center py-12 text-stone-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto mb-4 text-stone-300" />
                <p className="text-stone-600">{t.noOrders}</p>
                <button
                  onClick={() => navigate('home')}
                  className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-stone-900">
                          {t.orderNumber} {order.order_number}
                        </p>
                        <p className="text-sm text-stone-500">
                          {new Date(order.created_at).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-US')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-stone-900">€{order.total_amount.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'delivered' ? 'bg-stone-100 text-stone-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {order.items && Array.isArray(order.items) && (
                      <div className="mt-3 text-sm text-stone-600">
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.name}</label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.email}</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full p-3 border border-stone-200 rounded bg-stone-50 text-stone-500 cursor-not-allowed"
                />
                <p className="text-xs text-stone-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.phone}</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-3 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving...' : t.save}
                </Button>
                {saved && (
                  <span className="text-green-600 text-sm flex items-center gap-1">
                    <Check size={16} /> {t.saved}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Admin Dashboard Component ---

const AdminDashboard = ({ lang, products, onLogout }) => {
  const t = TRANSLATIONS[lang].admin;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token === 'admin-authenticated') {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/.netlify/functions/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setLoginError(t.invalidPassword);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(t.error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuthToken(null);
    setIsAuthenticated(false);
    if (onLogout) onLogout();
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">{t.login}</h1>
            <p className="text-stone-500 mt-2">SURA STEEL</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password}
                className="w-full p-4 border border-stone-200 rounded focus:border-stone-900 outline-none transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-stone-900 text-white py-4 rounded font-medium hover:bg-stone-700 transition-colors disabled:bg-stone-400"
            >
              {isLoggingIn ? t.loading : t.loginBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Tabs
  const tabs = [
    { id: 'orders', label: t.orders, icon: Package },
    { id: 'inventory', label: t.inventory, icon: Boxes },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Admin Header */}
      <header className="bg-stone-900 text-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif font-bold">SURA STEEL</h1>
            <span className="text-stone-400 text-sm">| {t.dashboard}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            {t.logout}
          </button>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-stone-100 text-stone-900 rounded-t-lg'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'orders' && <OrdersTab authToken={authToken} t={t} lang={lang} />}
        {activeTab === 'inventory' && <InventoryTab authToken={authToken} t={t} lang={lang} products={products} />}
        {activeTab === 'analytics' && <AnalyticsTab authToken={authToken} t={t} lang={lang} />}
      </main>
    </div>
  );
};

// Orders Tab Component
const OrdersTab = ({ authToken, t, lang }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/admin-get-orders', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || t.error);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-stone-400" size={32} />
        <span className="ml-3 text-stone-500">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        {error}
        <button onClick={fetchOrders} className="ml-4 underline hover:no-underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-stone-900">{t.orders}</h2>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center text-stone-500">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          {t.noOrders}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.orderId}</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.date}</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.customer}</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.items}</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.total}</th>
                  <th className="text-center px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-stone-600">
                        {order.id.substring(0, 16)}...
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      {formatDate(order.created)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-stone-900">{order.customer.name}</div>
                      <div className="text-xs text-stone-500">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-stone-600">
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-serif text-lg text-stone-900">
                        {order.currency.toUpperCase()} {order.amount_total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Inventory Tab Component
const InventoryTab = ({ authToken, t, lang, products }) => {
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/get-inventory');
      const data = await response.json();

      if (data.inventory && Array.isArray(data.inventory)) {
        const inventoryMap = {};
        data.inventory.forEach(item => {
          const key = `${item.product_id}-${item.variant}`;
          inventoryMap[key] = item.stock;
        });
        setInventory(inventoryMap);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId, variant) => {
    const key = `${productId}-${variant}`;
    setEditingItem(key);
    setEditValue(inventory[key] !== undefined ? inventory[key].toString() : '0');
    setSaveMessage(null);
  };

  const handleSave = async (productId, variant) => {
    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/.netlify/functions/admin-update-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          product_id: productId,
          variant: variant,
          stock: parseInt(editValue) || 0,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const key = `${productId}-${variant}`;
        setInventory(prev => ({ ...prev, [key]: parseInt(editValue) || 0 }));
        setEditingItem(null);
        setSaveMessage({ type: 'success', text: t.updateSuccess });
      } else {
        setSaveMessage({ type: 'error', text: data.error || t.updateError });
      }
    } catch (err) {
      console.error('Error saving inventory:', err);
      setSaveMessage({ type: 'error', text: t.updateError });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const getStock = (productId, variant) => {
    const key = `${productId}-${variant}`;
    return inventory[key];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-stone-400" size={32} />
        <span className="ml-3 text-stone-500">{t.loading}</span>
      </div>
    );
  }

  // Create inventory rows for all products with both variants
  const inventoryRows = [];
  products.forEach(product => {
    ['full_set', 'place_setting'].forEach(variant => {
      inventoryRows.push({
        productId: product.id,
        productName: product.name,
        category: product.category,
        variant: variant,
        variantLabel: variant === 'full_set' ? '24-Piece Full Set' : '4-Piece Place Setting',
      });
    });
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-stone-900">{t.inventory}</h2>
        <button
          onClick={fetchInventory}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {saveMessage && (
        <div className={`mb-4 px-4 py-3 rounded ${saveMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {saveMessage.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.product}</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.variant}</th>
                <th className="text-center px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.stock}</th>
                <th className="text-center px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">{t.update}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {inventoryRows.map((row) => {
                const key = `${row.productId}-${row.variant}`;
                const stock = getStock(row.productId, row.variant);
                const isEditing = editingItem === key;

                return (
                  <tr key={key} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-stone-900">{row.productName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${row.category === 'Gold' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      {row.variantLabel}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-3 py-2 border border-stone-300 rounded text-center focus:border-stone-900 outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className={`inline-flex items-center justify-center w-16 py-1 rounded text-sm font-medium ${
                          stock === undefined ? 'bg-stone-100 text-stone-500' :
                          stock === 0 ? 'bg-red-100 text-red-700' :
                          stock <= 5 ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {stock !== undefined ? stock : '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSave(row.productId, row.variant)}
                            disabled={saving}
                            className="px-3 py-1 bg-stone-900 text-white rounded text-sm hover:bg-stone-700 disabled:bg-stone-400"
                          >
                            {saving ? '...' : t.save}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 border border-stone-300 rounded text-sm hover:bg-stone-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(row.productId, row.variant)}
                          className="px-4 py-1 border border-stone-300 rounded text-sm hover:bg-stone-50 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ authToken, t, lang }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/.netlify/functions/admin-get-analytics?days=${period}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAnalytics(data);
      } else {
        setError(data.error || t.error);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-stone-400" size={32} />
        <span className="ml-3 text-stone-500">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        {error}
        <button onClick={fetchAnalytics} className="ml-4 underline hover:no-underline">
          Retry
        </button>
      </div>
    );
  }

  const maxRevenue = analytics?.revenueByDay ? Math.max(...analytics.revenueByDay.map(d => d.revenue), 1) : 1;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-stone-900">{t.analytics}</h2>
        <div className="flex items-center gap-4">
          <select
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value))}
            className="px-4 py-2 border border-stone-200 rounded bg-white focus:border-stone-900 outline-none"
          >
            <option value={7}>{t.last7Days}</option>
            <option value={30}>{t.last30Days}</option>
            <option value={90}>{t.last90Days}</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm uppercase tracking-wider">{t.totalRevenue}</p>
              <p className="text-3xl font-serif font-bold text-stone-900 mt-2">
                EUR {analytics?.totalRevenue?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm uppercase tracking-wider">{t.orderCount}</p>
              <p className="text-3xl font-serif font-bold text-stone-900 mt-2">
                {analytics?.orderCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm uppercase tracking-wider">{t.avgOrder}</p>
              <p className="text-3xl font-serif font-bold text-stone-900 mt-2">
                EUR {analytics?.averageOrderValue?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 mb-4">{t.revenueChart}</h3>
          <div className="h-64 flex items-end gap-1">
            {analytics?.revenueByDay?.map((day, idx) => (
              <div
                key={idx}
                className="flex-1 bg-stone-200 hover:bg-amber-500 transition-colors rounded-t relative group"
                style={{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {day.date}: EUR {day.revenue.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-stone-400 mt-2">
            <span>{analytics?.revenueByDay?.[0]?.date}</span>
            <span>{analytics?.revenueByDay?.[analytics.revenueByDay.length - 1]?.date}</span>
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 mb-4">{t.popularProducts}</h3>
          {analytics?.popularProducts?.length > 0 ? (
            <div className="space-y-4">
              {analytics.popularProducts.slice(0, 5).map((product, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-xs font-bold text-stone-500">
                      {idx + 1}
                    </span>
                    <span className="text-stone-900 font-medium">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-900 font-bold">{product.quantity}</span>
                    <span className="text-stone-400 text-sm ml-1">{t.quantity}</span>
                    <span className="text-stone-500 text-sm ml-3">EUR {product.revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Footer Component ---

const Footer = ({ navigate, lang, user }) => {
  const t = TRANSLATIONS[lang].footer;
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState(null); // 'success', 'error', 'already'
  const [subscribeMessage, setSubscribeMessage] = useState('');

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
      newsletterLoggedOut: "Create an account to subscribe and receive a 15% discount code!",
      newsletterSuccess: "Check your email for your 15% discount code!",
      newsletterAlready: "You're already subscribed!",
      newsletterError: "Something went wrong. Please try again.",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      createAccount: "Create Account"
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
      newsletterLoggedOut: "Maak een account aan om je in te schrijven en ontvang 15% korting!",
      newsletterSuccess: "Check je e-mail voor je 15% kortingscode!",
      newsletterAlready: "Je bent al ingeschreven!",
      newsletterError: "Er ging iets mis. Probeer het opnieuw.",
      emailPlaceholder: "Voer uw e-mail in",
      subscribe: "Aanmelden",
      createAccount: "Account Aanmaken"
    }
  };

  const c = content[lang] || content.en;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubscribing(true);
    setSubscribeStatus(null);
    setSubscribeMessage('');

    try {
      const response = await fetch('/.netlify/functions/subscribe-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubscribeStatus('success');
        setSubscribeMessage(c.newsletterSuccess);
      } else if (data.error?.includes('already subscribed')) {
        setSubscribeStatus('already');
        setSubscribeMessage(c.newsletterAlready);
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || c.newsletterError);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscribeStatus('error');
      setSubscribeMessage(c.newsletterError);
    } finally {
      setIsSubscribing(false);
    }
  };

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

            {subscribeStatus === 'success' || subscribeStatus === 'already' ? (
              <div className={`p-4 rounded ${subscribeStatus === 'success' ? 'bg-green-900/50 border border-green-700' : 'bg-amber-900/50 border border-amber-700'}`}>
                <div className="flex items-center gap-2">
                  <Check size={18} className={subscribeStatus === 'success' ? 'text-green-400' : 'text-amber-400'} />
                  <p className={`text-sm ${subscribeStatus === 'success' ? 'text-green-300' : 'text-amber-300'}`}>
                    {subscribeMessage}
                  </p>
                </div>
              </div>
            ) : !user ? (
              <div>
                <p className="text-amber-400 text-sm mb-3">{c.newsletterLoggedOut}</p>
                <button
                  onClick={() => navigate('signup')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-sm font-medium transition-colors"
                >
                  {c.createAccount}
                </button>
              </div>
            ) : (
              <div>
                <form className="flex gap-2" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="flex-1 px-4 py-2 bg-stone-800 border border-stone-700 rounded text-sm text-stone-400 cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? '...' : c.subscribe}
                  </button>
                </form>
                {subscribeStatus === 'error' && (
                  <p className="text-red-400 text-xs mt-2">{subscribeMessage}</p>
                )}
              </div>
            )}
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
  const [scrolled, setScrolled] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lang, setLang] = useState('nl'); // 'nl' or 'en'
  const [inventory, setInventory] = useState({});
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  const t = TRANSLATIONS[lang];

  // Auth state management
  useEffect(() => {
    if (supabase) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

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

  // Check for URL-based routing on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    // Check for admin route
    if (path === '/admin' || path === '/admin/') {
      setView('admin');
      return;
    }

    // Check for successful payment
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

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('home');
      showNotification(t.account?.loggedOut || 'Logged out successfully');
    }
  };

  // Admin view has its own layout, render separately
  if (view === 'admin') {
    return (
      <AdminDashboard
        lang={lang}
        products={PRODUCTS}
        onLogout={() => {
          window.history.replaceState({}, document.title, '/');
          navigate('home');
        }}
      />
    );
  }

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
            {user ? (
              <button onClick={() => navigate('account')} className="hidden md:block" title={t.account?.title || 'Account'}><User size={24} /></button>
            ) : (
              <button onClick={() => navigate('login')} className="hidden md:block" title={t.login?.title || 'Login'}><User size={24} /></button>
            )}
            <button onClick={() => setIsCartOpen(true)}><ShoppingBag size={24} /></button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {view === 'home' && <HomePage addToCart={addToCart} onViewDetails={handleViewDetails} lang={lang} t={t} getStock={getStock} />}
        {view === 'product' && <ProductDetailPage product={selectedProduct} onBack={() => setView('home')} onAddToCart={addToCart} lang={lang} getStock={getStock} />}
        {view === 'about' && <AboutPage />}
        {view === 'contact' && <ContactPage lang={lang} />}
        {view === 'policy' && <PolicyPage title="Shipping & Returns" />}
        {view === 'success' && <SuccessPage onContinueShopping={() => navigate('home')} lang={lang} />}
        {view === 'login' && <LoginPage lang={lang} onLogin={setUser} navigate={navigate} />}
        {view === 'signup' && <SignupPage lang={lang} onSignup={setUser} navigate={navigate} />}
        {view === 'account' && user && <AccountPage lang={lang} user={user} onLogout={handleLogout} navigate={navigate} />}
        {view === 'account' && !user && navigate('login')}
      </main>

      <Footer navigate={navigate} lang={lang} user={user} />

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} lang={lang} user={user} />
      {notification && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded shadow-xl z-50 flex items-center gap-3"><Check size={16} /> {notification}</div>}
    </div>
  );
};

export default App;