import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-64 overflow-hidden bg-gray-100 group">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
          {product.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-grow">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xl font-bold text-indigo-700">
            {formatCurrency(product.price)}
          </span>
          <Button onClick={() => onAddToCart(product)} className="text-sm px-3">
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
};