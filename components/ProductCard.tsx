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
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.badge}>
          {product.category}
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title} title={product.name}>
          {product.name}
        </h3>
        <p className={styles.description}>
          {product.description}
        </p>
        
        <div className={styles.footer}>
          <span className={styles.price}>
            {formatCurrency(product.price)}
          </span>
          <Button onClick={() => onAddToCart(product)} className={styles.button}>
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: "bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group",
  imageContainer: "relative h-64 overflow-hidden bg-stone-100",
  image: "w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500",
  badge: "absolute top-2 right-2 bg-white/95 backdrop-blur px-2 py-1 rounded text-xs font-bold text-black shadow-sm border border-stone-100",
  content: "p-5 flex flex-col flex-grow",
  title: "text-lg font-bold text-black mb-2 line-clamp-1",
  description: "text-stone-700 font-medium text-sm mb-4 line-clamp-3 flex-grow",
  footer: "mt-auto flex items-center justify-between pt-4 border-t border-stone-100",
  price: "text-xl font-bold text-gold-700",
  button: "text-sm px-3 bg-gold-500 text-black hover:bg-gold-400"
};