import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { MOCK_PRODUCTS, formatCurrency } from '../constants';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <section className={styles.hero.section}>
        <div className={styles.hero.bgPattern} />
        <div className={styles.hero.bgOverlay} />
        
        <div className={styles.hero.content}>
          <span className={styles.hero.badge}>
            ✨ Nuevos ingresos de temporada
          </span>
          <h1 className={styles.hero.title}>
            Lo Mejor del Perú <br className="hidden md:block" />
            <span className={styles.hero.highlight}>Para el Mundo</span>
          </h1>
          <p className={styles.hero.description}>
            Descubre nuestra colección exclusiva de productos artesanales, moda y tecnología con sello peruano. Calidad garantizada y envíos seguros a nivel nacional.
          </p>
          <div className={styles.hero.actions}>
            <Link to="/shop" className="w-full sm:w-auto">
              <Button className={styles.hero.primaryBtn}>Explorar Tienda</Button>
            </Link>
            <Link to="/profile" className="w-full sm:w-auto">
              <Button variant="outline" className={styles.hero.secondaryBtn}>
                Mi Cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features.section}>
        <div className={styles.features.container}>
          <div className={styles.features.header}>
            <h2 className={styles.features.title}>¿Por qué elegirnos?</h2>
            <p className={styles.features.subtitle}>Comprometidos con la excelencia y tu satisfacción.</p>
          </div>
          
          <div className={styles.features.grid}>
            {/* Feature 1 */}
            <div className={styles.features.card}>
              <div className={styles.features.iconWrapper}>
                <svg className={styles.features.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className={styles.features.cardTitle}>Calidad Premium</h3>
              <p className={styles.features.cardDesc}>Algodón Pima, cuero legítimo y acabados de primera. Seleccionamos rigurosamente cada producto.</p>
            </div>
            
            {/* Feature 2 */}
            <div className={styles.features.card}>
              <div className={styles.features.iconWrapper}>
                <svg className={styles.features.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className={styles.features.cardTitle}>Envíos Rápidos</h3>
              <p className={styles.features.cardDesc}>Entrega en 24h para Lima Metropolitana y 48h para provincias. Seguimiento en tiempo real.</p>
            </div>
            
            {/* Feature 3 */}
            <div className={styles.features.card}>
              <div className={styles.features.iconWrapper}>
                <svg className={styles.features.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className={styles.features.cardTitle}>Compra Segura</h3>
              <p className={styles.features.cardDesc}>Tus datos están protegidos con encriptación TLS 1.3 y pasarelas de pago certificadas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className={styles.preview.section}>
        <div className={styles.preview.container}>
          <div className={styles.preview.header}>
            <div>
              <span className={styles.preview.label}>Favoritos</span>
              <h2 className={styles.preview.title}>Productos Destacados</h2>
            </div>
            <Link to="/shop" className={styles.preview.link}>
              Ver catálogo completo 
              <svg className={styles.preview.arrow} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
          
          <div className={styles.preview.grid}>
            {MOCK_PRODUCTS.slice(0, 3).map(product => (
               <div key={product.id} className={styles.preview.card}>
                 <div className={styles.preview.imageContainer}>
                   <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className={styles.preview.image} 
                   />
                   <div className={styles.preview.badge}>
                      Tendencia
                   </div>
                 </div>
                 <div className={styles.preview.content}>
                   <p className={styles.preview.category}>{product.category}</p>
                   <h3 className={styles.preview.productName}>{product.name}</h3>
                   <div className={styles.preview.footer}>
                     <p className={styles.preview.price}>{formatCurrency(product.price)}</p>
                     <Link to="/shop">
                        <button className={styles.preview.detailsBtn}>Ver detalles</button>
                     </Link>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter.section}>
        <div className={styles.newsletter.blob1}></div>
        <div className={styles.newsletter.blob2}></div>
        
        <div className={styles.newsletter.content}>
          <h2 className={styles.newsletter.title}>Únete a nuestra comunidad</h2>
          <p className={styles.newsletter.text}>
            Suscríbete para recibir ofertas exclusivas, novedades y descuentos especiales directamente en tu correo.
          </p>
          <form className={styles.newsletter.form} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className={styles.newsletter.input}
              required
            />
            <Button className={styles.newsletter.button}>Suscribirse</Button>
          </form>
          <p className={styles.newsletter.disclaimer}>Respetamos tu privacidad. Date de baja cuando quieras.</p>
        </div>
      </section>
    </div>
  );
};

// --- Styles Separation ---
const styles = {
  wrapper: "flex flex-col w-full",
  hero: {
    section: "relative bg-gold-500 text-black py-24 px-4 sm:px-6 lg:px-8 overflow-hidden",
    bgPattern: "absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center",
    bgOverlay: "absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-400 opacity-90",
    content: "relative max-w-7xl mx-auto flex flex-col items-center text-center z-10",
    badge: "inline-block py-1 px-3 rounded-full bg-black/10 border border-black/20 text-black text-sm font-bold mb-6 animate-fade-in-up",
    title: "text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-black",
    // Changed to text-black for contrast per user request
    highlight: "text-black drop-shadow-sm", 
    description: "text-lg md:text-xl text-black/80 max-w-2xl mb-10 leading-relaxed font-semibold",
    actions: "flex flex-col sm:flex-row gap-4 w-full sm:w-auto",
    primaryBtn: "w-full py-4 text-lg px-8 shadow-xl bg-black text-gold-500 hover:bg-stone-900 border-none",
    secondaryBtn: "w-full py-4 text-lg px-8 border-black text-black hover:bg-black hover:text-gold-500"
  },
  features: {
    section: "py-20 bg-[#fbfaf6]",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    header: "text-center mb-16",
    title: "text-3xl font-bold text-black",
    subtitle: "text-stone-800 font-medium mt-2",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-10",
    card: "flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-stone-200 transition-transform hover:-translate-y-1 hover:shadow-lg",
    iconWrapper: "w-16 h-16 bg-gold-100 text-gold-700 rounded-full flex items-center justify-center mb-6 shadow-sm",
    icon: "w-8 h-8",
    cardTitle: "text-xl font-bold text-black mb-3",
    cardDesc: "text-stone-800 font-medium leading-relaxed"
  },
  preview: {
    section: "py-20 bg-bone",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    header: "flex flex-col sm:flex-row justify-between items-end mb-10 gap-4",
    label: "text-gold-700 font-bold tracking-wide uppercase text-sm",
    title: "text-3xl font-bold text-black mt-1",
    link: "group text-gold-700 font-bold hover:text-gold-900 flex items-center gap-1 transition-colors",
    arrow: "w-4 h-4 transform group-hover:translate-x-1 transition-transform",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
    card: "bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 group",
    imageContainer: "h-56 overflow-hidden bg-gray-100 relative",
    image: "w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500",
    badge: "absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded text-xs font-bold text-black shadow-sm border border-stone-100",
    content: "p-6",
    category: "text-xs text-stone-500 mb-2 uppercase tracking-wide font-bold",
    productName: "font-bold text-black mb-2 text-lg line-clamp-1",
    footer: "flex items-center justify-between mt-4",
    price: "text-gold-700 font-bold text-xl",
    detailsBtn: "text-sm font-bold text-gold-700 hover:text-gold-900 hover:underline"
  },
  newsletter: {
    section: "py-20 bg-gold-500 text-black relative overflow-hidden",
    blob1: "absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gold-400 blur-3xl opacity-50",
    blob2: "absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gold-600 blur-3xl opacity-30",
    content: "relative max-w-4xl mx-auto px-4 text-center z-10",
    title: "text-3xl font-bold mb-4",
    text: "text-stone-900 mb-8 max-w-xl mx-auto font-medium",
    form: "flex flex-col sm:flex-row gap-4 max-w-md mx-auto",
    input: "flex-1 px-5 py-3 rounded-lg text-black focus:outline-none focus:ring-4 focus:ring-black/20 border-0 bg-white",
    button: "bg-black hover:bg-stone-900 text-gold-500 px-6 py-3 shadow-lg",
    disclaimer: "text-xs text-stone-800 mt-4"
  }
};