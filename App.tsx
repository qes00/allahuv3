import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, CartItem } from './types';
import { MOCK_PRODUCTS } from './constants';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import { LandingPage } from './components/LandingPage';

// Helper for navbar to highlight active link
const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to}
      onClick={onClick}
      className={isActive ? styles.navLink.active : styles.navLink.inactive}
    >
      {children}
    </Link>
  );
};

// Navbar Component
const Navbar: React.FC<{ cartCount: number; onOpenCart: () => void }> = ({ cartCount, onOpenCart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar.container}>
      <div className={styles.navbar.wrapper}>
        <div className={styles.navbar.content}>
          <div className="flex items-center">
            <Link to="/" className={styles.navbar.brand}>
              PERÚ<span className={styles.navbar.brandHighlight}>SHOP</span>
            </Link>
            <div className={styles.navbar.desktopMenu}>
              <NavLink to="/">Inicio</NavLink>
              <NavLink to="/shop">Tienda</NavLink>
              <NavLink to="/profile">Mi Cuenta</NavLink>
              <NavLink to="/admin">Admin</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Link to="/profile" className={styles.navbar.iconButton}>
               <span className="sr-only">Perfil</span>
               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
             </Link>
             <button 
              onClick={onOpenCart}
              className={styles.navbar.cartButton}
             >
               <span className="sr-only">Ver carrito</span>
               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
               </svg>
               {cartCount > 0 && (
                 <span className={styles.navbar.cartCount}>
                   {cartCount}
                 </span>
               )}
             </button>
             
             {/* Mobile menu button */}
             <div className="md:hidden ml-2">
               <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={styles.navbar.mobileMenuBtn}
               >
                 {isMobileMenuOpen ? (
                   <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 ) : (
                   <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                 )}
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu.container}>
          <div className={styles.mobileMenu.content}>
            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</NavLink>
            <NavLink to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Tienda</NavLink>
            <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Mi Cuenta</NavLink>
            <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

const Storefront: React.FC<{ addToCart: (p: Product) => void }> = ({ addToCart }) => (
  <div className={styles.storefront.container}>
    <div className="mb-8">
      <h1 className={styles.storefront.title}>Catálogo Completo</h1>
      <p className={styles.storefront.subtitle}>Explora los mejores productos peruanos a un click de distancia.</p>
    </div>
    
    <div className={styles.storefront.grid}>
      {MOCK_PRODUCTS.map(product => (
        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className={styles.app.container}>
        <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<Storefront addToCart={addToCart} />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile" element={<UserPanel cart={cart} />} />
          </Routes>
        </main>

        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart}
          onRemove={removeFromCart}
        />

        <footer className={styles.footer.container}>
          <div className={styles.footer.wrapper}>
            <div className={styles.footer.grid}>
              <div>
                <h3 className={styles.footer.title}>PERÚSHOP</h3>
                <p className={styles.footer.text}>Llevando la calidad peruana a cada rincón del país y del mundo. Tecnología, moda y artesanía en un solo lugar.</p>
              </div>
              <div>
                <h3 className={styles.footer.title}>Enlaces Rápidos</h3>
                <ul className={styles.footer.list}>
                  <li><Link to="/" className={styles.footer.link}>Inicio</Link></li>
                  <li><Link to="/shop" className={styles.footer.link}>Tienda</Link></li>
                  <li><Link to="/profile" className={styles.footer.link}>Mi Cuenta</Link></li>
                </ul>
              </div>
              <div>
                 <h3 className={styles.footer.title}>Ayuda</h3>
                 <ul className={styles.footer.list}>
                  <li><a href="#" className={styles.footer.link}>Envíos y Devoluciones</a></li>
                  <li><a href="#" className={styles.footer.link}>Centro de Ayuda</a></li>
                  <li><a href="#" className={styles.footer.link}>Términos y Condiciones</a></li>
                </ul>
              </div>
            </div>
            <div className={styles.footer.copyright}>
              © 2024 Tienda Virtual Híbrida. Cloud Run & FTP Architecture.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const styles = {
  app: {
    container: "min-h-screen bg-bone flex flex-col font-sans text-black"
  },
  navLink: {
    active: "px-3 py-2 rounded-md text-sm font-bold transition-colors bg-black text-gold-500 shadow-md",
    inactive: "px-3 py-2 rounded-md text-sm font-bold transition-colors text-black hover:bg-black/10"
  },
  navbar: {
    container: "sticky top-0 z-30 bg-gold-500 shadow-lg border-b border-gold-600",
    wrapper: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    content: "flex items-center justify-between h-16",
    brand: "text-black font-extrabold text-2xl tracking-tight flex items-center gap-1 drop-shadow-sm",
    // Changed to text-black for contrast against bg-gold-500
    brandHighlight: "text-black drop-shadow-sm font-black", 
    desktopMenu: "hidden md:block ml-10 flex items-baseline space-x-4",
    iconButton: "p-2 rounded-full text-black hover:bg-black/10 transition-colors focus:outline-none",
    cartButton: "p-2 rounded-full text-black hover:bg-black/10 transition-colors relative focus:outline-none",
    cartCount: "absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-sm",
    mobileMenuBtn: "p-2 rounded-md text-black hover:bg-black/10 focus:outline-none"
  },
  mobileMenu: {
    container: "md:hidden bg-gold-400 border-t border-gold-600 animate-fade-in",
    content: "px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col"
  },
  storefront: {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in",
    title: "text-3xl font-bold text-black",
    subtitle: "text-stone-800 mt-2 font-medium",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  },
  footer: {
    container: "bg-white border-t border-stone-200 mt-auto",
    wrapper: "max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-8",
    title: "font-bold text-black mb-4",
    text: "text-sm text-stone-700 font-medium",
    list: "text-sm text-stone-700 font-medium space-y-2",
    link: "hover:text-gold-600 transition-colors",
    copyright: "border-t border-stone-200 pt-8 text-center text-sm text-stone-500"
  }
};

export default App;