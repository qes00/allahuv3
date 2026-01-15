import React from 'react';
import { CartItem } from '../types';
import { formatCurrency, IGV_RATE } from '../constants';
import { Button } from './Button';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cart, onRemove }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // In Peru, displayed prices usually include IGV. 
  // We calculate the base price by dividing by 1.18
  const basePrice = total / (1 + IGV_RATE);
  const igvAmount = total - basePrice;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900">Tu Carrito</h2>
          <button onClick={onClose} className="p-2 hover:bg-indigo-100 rounded-full text-indigo-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 mt-20">
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-slate-50 pb-4 last:border-0">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover bg-gray-100" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 line-clamp-1">{item.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-slate-500">Cant: {item.quantity}</span>
                    <span className="font-medium text-indigo-600">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-xs text-red-500 mt-2 hover:text-red-700 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal (Base)</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>IGV (18%)</span>
                <span>{formatCurrency(igvAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <Button className="w-full py-3 text-lg shadow-lg shadow-indigo-200">
              Ir a Pagar
            </Button>
            <p className="text-center text-xs text-slate-400 mt-3">Transacciones seguras procesadas externamente.</p>
          </div>
        )}
      </div>
    </>
  );
};