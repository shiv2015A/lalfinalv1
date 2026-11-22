// server/seedData.js - STRICTLY the 3 outfits from the user's uploaded folders

export const initialProducts = [
  {
    id: "prod-1",
    title: "Chinon Bustier Plazo Set with Real Mirror & Lace Work",
    subtitle: "Regal Berry Red 3-Piece Silk Festive Ensemble",
    category: "wedding",
    categoryName: "Wedding & Festive Collection",
    price: 2499,
    originalPrice: 4999,
    rentPrice: 699,
    rentDurationDays: 3,
    rentSecurityDeposit: 999,
    rentAvailable: true,
    discount: 50,
    images: [
      "/uploads/product-1-main.jpg",
      "/uploads/product-1-closeup.jpg",
      "/uploads/product-1-full.jpg"
    ],
    specScreenshots: [
      "/uploads/product-1-spec1.jpg",
      "/uploads/product-1-spec2.jpg"
    ],
    description: "Step into royal elegance with our festive Chinon Bustier & Palazzo Set. Featuring heavy handcrafted real mirror work along the neckline and sleeves, paired with flowing art silk palazzo pants and a sheer coordinating dupatta. Tailored for wedding celebrations, cocktail nights, and sangeet glamour.",
    specs: {
      kurtaFabric: "Art Silk / Chinon",
      bottomFabric: "Silk",
      dupattaFabric: "Art Silk",
      kurtaType: "Straight Bustier Cut",
      neck: "U - Neck with Mirror Collar",
      sleeve: "Full Sleeve with Border Work",
      bottomType: "Palazzo",
      color: "Berry Maroon / Crimson Red",
      brandColor: "Berry Red",
      ornamentation: "Real Mirror Work & Applique",
      pattern: "Embellished",
      occasion: "Wedding, Festive & Sangeet Soirees",
      washCare: "Hand Wash Only / Dry Clean Recommended"
    },
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    isViral: true,
    isFeatured: true,
    inWeddingSection: true,
    tags: ["wedding", "viral", "mirror work", "festive", "maroon", "chinon", "palazzo set"],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-2",
    title: "Gulnaar Wine Georgette A-Line Kurta & Flared Palazzo Set",
    subtitle: "Fluid V-Neck Georgette Silhouette with Delicate Lace Accents",
    category: "viral-kurtis",
    categoryName: "Viral & Trendy Kurtis",
    price: 1899,
    originalPrice: 3799,
    rentPrice: 499,
    rentDurationDays: 3,
    rentSecurityDeposit: 799,
    rentAvailable: true,
    discount: 50,
    images: [
      "/uploads/product-2-main.jpg",
      "/uploads/product-2-closeup.jpg"
    ],
    specScreenshots: [
      "/uploads/product-2-spec1.jpg",
      "/uploads/product-2-spec2.jpg"
    ],
    description: "The minimalist luxury look taking social media by storm. Crafted in featherlight flowy georgette in an intoxicating deep wine shade, this A-line kurti set features a sculpted V-neck with gold-thread border lace, airy bell sleeves, and statement wide-leg palazzos with matching dupatta.",
    specs: {
      kurtaFabric: "Pure Flowy Georgette",
      bottomFabric: "Georgette",
      dupattaFabric: "Georgette",
      kurtaType: "A-Line Flare",
      neck: "V Neck with Golden Lace Trim",
      sleeve: "Full Sleeve with Gathered Cuff",
      bottomType: "Wide Palazzo",
      color: "Deep Wine Maroon",
      brandColor: "MAROON",
      ornamentation: "Fine Lace Trim",
      pattern: "Solid Elegant Drape",
      occasion: "Cocktail Dinners, Festive Chic & Celebrations",
      washCare: "Dry Clean or Gentle Machine Wash"
    },
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    isViral: true,
    isFeatured: true,
    inWeddingSection: false,
    tags: ["viral", "wine", "georgette", "a-line", "v-neck", "trendy", "flared"],
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    title: "Floral Grace Khadi Kurta & Patiala Set with Hot Pink Dupatta",
    subtitle: "Pure Handcrafted Khadi with Soft Rose Motifs & Vibrant Contrast Drape",
    category: "viral-kurtis",
    categoryName: "Viral & Trendy Kurtis",
    price: 1699,
    originalPrice: 3399,
    rentPrice: 399,
    rentDurationDays: 3,
    rentSecurityDeposit: 699,
    rentAvailable: true,
    discount: 50,
    images: [
      "/uploads/product-3-main.jpg",
      "/uploads/product-3-side.jpg",
      "/uploads/product-3-back.jpg"
    ],
    specScreenshots: [
      "/uploads/product-3-spec1.jpg",
      "/uploads/product-3-spec2.jpg"
    ],
    description: "Effortless daytime elegance. Handwoven from breathable organic Khadi, adorned with delicate blush floral botanical motifs, paired with authentic pleated Patiala salwar and an energetic hot pink cotton-silk dupatta with tassel finishes.",
    specs: {
      kurtaFabric: "Organic Khadi",
      bottomFabric: "Khadi",
      dupattaFabric: "Cotton Silk Blend with Tassels",
      kurtaType: "Straight Fit",
      neck: "Round Neck with Dainty Trim",
      sleeve: "Full Sleeve with Tie Accents",
      bottomType: "Patiala Salwar",
      color: "Pearl Off-White & Rani Pink",
      brandColor: "Off White",
      ornamentation: "Clean Botanical Motif",
      pattern: "Floral Stem Print",
      occasion: "Day Festive, Haldi, Mehendi & Casual Luxury",
      washCare: "Gentle Hand Wash with Mild Detergent"
    },
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    isViral: true,
    isFeatured: true,
    inWeddingSection: false,
    tags: ["khadi", "cotton silk", "patiala", "floral", "viral", "day wear", "white"],
    createdAt: new Date().toISOString()
  }
];
