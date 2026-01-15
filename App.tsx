import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Product, CartItem } from './types';
import { MOCK_PRODUCTS } from './constants';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import AdminPanel from './components/AdminPanel';

// Helper for navbar to highlight active link
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600'
      }`}
    >
      {children}
    </Link>
  );
};

// Navbar Component defined here to use router hooks
const Navbar: React.FC<{ cartCount: number; onOpenCart: () => void }> = ({ cartCount, onOpenCart }) => {
  return (
    <nav className="sticky top-0 z-30 bg-indigo-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl tracking-tight">
              PERÚ<span className="text-indigo-300">SHOP</span>
            </Link>
            <div className="hidden md:block ml-10 flex items-baseline space-x-4">
              <NavLink to="/">Tienda</NavLink>
              <NavLink to="/admin">Admin</NavLink>
            </div>
          </div>
          <div className="flex items-center">
             <button 
              onClick={onOpenCart}
              className="p-2 rounded-full text-indigo-100 hover:bg-indigo-700 hover:text-white relative focus:outline-none"
             >
               <span className="sr-only">Ver carrito</span>
               <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
               </svg>
               {cartCount > 0 && (
                 <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                   {cartCount}
                 </span>
               )}
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Storefront: React.FC<{ addToCart: (p: Product) => void }> = ({ addToCart }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900">Novedades</h1>
      <p className="text-slate-500 mt-2">Explora los mejores productos peruanos a un click de distancia.</p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Storefront addToCart={addToCart} />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart}
          onRemove={removeFromCart}
        />

        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-500">
              © 2024 Tienda Virtual Híbrida. Cloud Run & FTP Architecture.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;