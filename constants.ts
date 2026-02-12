
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Hydrating Petal Serum',
    category: 'Serums',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400',
    description: 'A lightweight serum infused with rose water and hyaluronic acid.',
    stock: 25,
    minStockAlert: 5,
    expiryDate: '2025-12-01'
  },
  {
    id: '2',
    name: 'Gentle Oat Cleanser',
    category: 'Cleansers',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400',
    description: 'A soothing milk cleanser that removes impurities without stripping moisture.',
    stock: 40,
    minStockAlert: 10,
    expiryDate: '2025-10-15'
  },
  {
    id: '3',
    name: 'Glow Vit-C Toner',
    category: 'Toners',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    description: 'Brighten your complexion with our antioxidant-rich vitamin C formula.',
    stock: 12,
    minStockAlert: 5,
    expiryDate: '2026-01-20'
  },
  {
    id: '4',
    name: 'Moisture Lock Cream',
    category: 'Moisturizers',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400',
    description: '24-hour hydration with ceramides and organic shea butter.',
    stock: 8,
    minStockAlert: 5,
    expiryDate: '2025-11-30'
  }
];
