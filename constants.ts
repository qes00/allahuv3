// URL del Backend en Cloud Run (Simulada para este entorno)
export const API_BASE_URL = 'https://api-cloud-run-service-xyz.run.app/api';

// Configuración Regional Perú
export const CURRENCY_CODE = 'PEN';
export const IGV_RATE = 0.18;

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: CURRENCY_CODE,
  }).format(amount);
};

export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Polo Algodón Pima Premium',
    description: 'Polo básico de alta calidad hecho con el mejor algodón peruano. Fresco y duradero.',
    price: 89.90,
    imageUrl: 'https://picsum.photos/400/400?random=1',
    category: 'Ropa'
  },
  {
    id: '2',
    name: 'Zapatillas Urbanas Lima',
    description: 'Diseño moderno para caminar por la ciudad. Suela ergonómica.',
    price: 249.50,
    imageUrl: 'https://picsum.photos/400/400?random=2',
    category: 'Calzado'
  },
  {
    id: '3',
    name: 'Mochila Andina',
    description: 'Mochila resistente con diseños inspirados en telares tradicionales.',
    price: 120.00,
    imageUrl: 'https://picsum.photos/400/400?random=3',
    category: 'Accesorios'
  }
];