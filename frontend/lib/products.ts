export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: string
  colors: { name: string; hex: string }[]
  sizes: string[]
  image: string
  category: string
  collection: string
  isNew?: boolean
  isBestSeller?: boolean
  description: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Royal Brown Agbada",
    price: 125000,
    originalPrice: 150000,
    discount: "17% OFF",
    colors: [
      { name: "Brown", hex: "#8B4513" },
      { name: "Emerald", hex: "#0A3D2E" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=800&fit=crop",
    category: "Agbada",
    collection: "Men",
    isBestSeller: true,
    description: "Handcrafted royal agbada with intricate embroidery, perfect for special occasions.",
  },
  {
    id: "2",
    name: "Executive Cream Suit",
    price: 95000,
    colors: [
      { name: "Cream", hex: "#F5F5DC" },
      { name: "Navy", hex: "#1A1A3A" },
    ],
    sizes: ["M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    category: "Suits",
    collection: "Men",
    isNew: true,
    description: "Modern executive suit tailored for the contemporary Nigerian professional.",
  },
  {
    id: "3",
    name: "Heritage Emerald Agbada",
    price: 145000,
    originalPrice: 175000,
    discount: "17% OFF",
    colors: [
      { name: "Emerald", hex: "#0A3D2E" },
      { name: "Gold", hex: "#C5A059" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=800&fit=crop",
    category: "Agbada",
    collection: "Men",
    isBestSeller: true,
    description: "Our signature emerald agbada featuring hand-stitched gold accents.",
  },
  {
    id: "4",
    name: "Classic Black Kaftan",
    price: 45000,
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Grey", hex: "#808080" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop",
    category: "Kaftan",
    collection: "Men",
    description: "Versatile everyday kaftan perfect for both casual and semi-formal occasions.",
  },
  {
    id: "5",
    name: "Ankara Midi Dress",
    price: 35000,
    originalPrice: 42000,
    discount: "17% OFF",
    colors: [
      { name: "Multi", hex: "#C5A059" },
      { name: "Blue", hex: "#1E40AF" },
    ],
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1590400516695-36d6b0a50538?w=600&h=800&fit=crop",
    category: "Dresses",
    collection: "Women",
    isNew: true,
    description: "Elegant ankara midi dress with modern silhouette and traditional patterns.",
  },
  {
    id: "6",
    name: "Formal White Shirt",
    price: 18000,
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Blue", hex: "#E6F0FF" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop",
    category: "Shirts",
    collection: "Men",
    description: "Premium cotton formal shirt with perfect collar construction.",
  },
  {
    id: "7",
    name: "Senator Style Suit",
    price: 85000,
    originalPrice: 100000,
    discount: "15% OFF",
    colors: [
      { name: "Charcoal", hex: "#36454F" },
      { name: "Brown", hex: "#8B4513" },
      { name: "Navy", hex: "#1A1A3A" },
    ],
    sizes: ["M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    category: "Suits",
    collection: "Men",
    isBestSeller: true,
    description: "Distinguished senator style suit for the modern Nigerian leader.",
  },
  {
    id: "8",
    name: "Aso Oke Blouse",
    price: 28000,
    colors: [
      { name: "Gold", hex: "#C5A059" },
      { name: "Blue", hex: "#1E40AF" },
      { name: "Burgundy", hex: "#722F37" },
    ],
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=600&h=800&fit=crop",
    category: "Blouses",
    collection: "Women",
    isNew: true,
    description: "Traditional aso oke blouse with contemporary styling.",
  },
  {
    id: "9",
    name: "Premium Fila Cap",
    price: 8500,
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Cream", hex: "#F5F5DC" },
      { name: "Black", hex: "#1A1A1A" },
    ],
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop",
    category: "Accessories",
    collection: "Accessories",
    description: "Hand-crafted fila cap perfect for completing your traditional look.",
  },
  {
    id: "10",
    name: "Embroidered Wrapper Set",
    price: 55000,
    originalPrice: 65000,
    discount: "15% OFF",
    colors: [
      { name: "Emerald", hex: "#0A3D2E" },
      { name: "Gold", hex: "#C5A059" },
    ],
    sizes: ["Standard"],
    image: "https://images.unsplash.com/photo-1594938374182-a57061dff378?w=600&h=800&fit=crop",
    category: "Wrapper",
    collection: "Women",
    isBestSeller: true,
    description: "Luxurious embroidered wrapper set for elegant occasions.",
  },
  {
    id: "11",
    name: "Casual Linen Shirt",
    price: 22000,
    colors: [
      { name: "Sky Blue", hex: "#87CEEB" },
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Olive", hex: "#808000" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    category: "Shirts",
    collection: "Men",
    isNew: true,
    description: "Breathable linen shirt for comfortable casual wear.",
  },
  {
    id: "12",
    name: "Wedding Agbada Set",
    price: 250000,
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Ivory", hex: "#FFFFF0" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop",
    category: "Agbada",
    collection: "Men",
    isBestSeller: true,
    description: "Exquisite wedding agbada set with premium materials and intricate hand embroidery.",
  },
]

export const categories = [
  "All",
  "Agbada",
  "Suits",
  "Kaftan",
  "Shirts",
  "Dresses",
  "Blouses",
  "Wrapper",
  "Accessories",
]

export const collections = ["All", "Men", "Women", "Accessories"]

export const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₦25,000", min: 0, max: 25000 },
  { label: "₦25,000 - ₦50,000", min: 25000, max: 50000 },
  { label: "₦50,000 - ₦100,000", min: 50000, max: 100000 },
  { label: "Above ₦100,000", min: 100000, max: Infinity },
]

export const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Selling", value: "best-selling" },
]
