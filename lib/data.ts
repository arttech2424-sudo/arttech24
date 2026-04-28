export type ProjectSeed = {
  slug: string;
  title: string;
  businessType: string;
  clientName: string;
  location: string;
  description: string;
  images: string[];
  tags: string[];
  featured?: boolean;
};

export const projectSeeds: ProjectSeed[] = [
  {
    slug: "cafe-interior-design-chennai-black-canary",
    title: "Cafe Interior Design in Chennai - Black Canary",
    businessType: "Cafe",
    clientName: "Black Canary Coffee",
    location: "Chennai",
    description:
      "A high-footfall cafe with durable finishes, warm lighting, and optimized customer flow to improve daily sales.",
    images: [
      "/images/projects/20230629-BlackCanaryCoffee-Sansa-30-min.webp",
      "/images/projects/coffee_shop_11_.png",
      "/images/projects/coffee_shop_design_4_.png",
      "/images/projects/Tobys-Cafe-for-cafe-inspriation.jpg",
    ],
    tags: ["cafe interior design chennai", "commercial interior low cost premium"],
    featured: true,
  },
  {
    slug: "restaurant-interior-design-bengaluru-signature",
    title: "Restaurant Interior Design in Bengaluru - Signature Dining",
    businessType: "Restaurant",
    clientName: "Signature Dining",
    location: "Bengaluru",
    description:
      "A restaurant concept balancing premium look and maintenance-friendly surfaces for long-term ROI.",
    images: [
      "/images/projects/Restaurant_1_.jpg",
      "/images/projects/Restaurant_3_.jpg",
      "/images/projects/Restaurant_design_12_.png",
      "/images/projects/top-impactful-design-strategies-for-small-restaurant-interiors.webp",
    ],
    tags: ["restaurant interior design ideas", "restaurant interior low cost premium"],
    featured: true,
  },
  {
    slug: "bakery-interior-design-hyderabad-golden-crust",
    title: "Bakery Interior Design in Hyderabad - Golden Crust",
    businessType: "Bakery",
    clientName: "Golden Crust",
    location: "Hyderabad",
    description:
      "Front-display-first bakery design with efficient backend prep zoning and long-lasting material palette.",
    images: [
      "/images/projects/bakery_store_counter_1_.png",
      "/images/projects/bakery_store_counter_5_.png",
      "/images/projects/bakery_counter_8_.png",
      "/images/projects/bakery_counter_2_.png",
    ],
    tags: ["bakery interior design india", "bakery counter design premium"],
  },
  {
    slug: "hotel-lobby-interior-design-kochi-hale",
    title: "Hotel Lobby Interior Design in Kochi - Hale",
    businessType: "Hotel",
    clientName: "Hale Hotels",
    location: "Kochi",
    description:
      "Premium hospitality interiors engineered for heavy usage with strong brand storytelling in public zones.",
    images: [
      "/images/projects/Hale_Toronto_4.webp",
      "/images/projects/gMercato_SansaInteriors_GMercato.webp",
      "/images/projects/gMercato_SansaInteriors_BrunoBelli-10-min.webp",
      "/images/projects/01_49_.jpg",
    ],
    tags: ["hotel interior design india", "premium hotel interiors"],
  },
  {
    slug: "retail-showroom-interior-design-mumbai-luxe-fragrance",
    title: "Retail Showroom Interior Design in Mumbai - Luxe Fragrance",
    businessType: "Retail",
    clientName: "Luxe Fragrance",
    location: "Mumbai",
    description:
      "A premium retail experience with precise display lighting and material choices that resist fading.",
    images: [
      "/images/projects/perfume_store_design_5_.png",
      "/images/projects/perfume_store_design_8_.png",
      "/images/projects/luxury-showroom-interior-design-trends-in-2024.webp",
      "/images/projects/shop_design_8__1.png",
    ],
    tags: ["retail showroom interior design", "low cost premium interiors"],
  },
  {
    slug: "bakery-interior-design-coimbatore-bread-story",
    title: "Bakery Interior Design in Coimbatore - Bread Story",
    businessType: "Bakery",
    clientName: "Bread Story",
    location: "Coimbatore",
    description:
      "A warm bakery concept with optimized product display zoning, easy-clean counters, and durable daily-use finishes.",
    images: [
      "/images/projects/backery-1.png",
      "/images/projects/backery-3.png",
      "/images/projects/backery-5.png",
      "/images/projects/backery-6.png",
    ],
    tags: ["bakery interior design coimbatore", "commercial bakery interiors"],
  },
  {
    slug: "bar-restaurant-interior-design-chennai-copper-room",
    title: "Bar and Restaurant Interior Design in Chennai - Copper Room",
    businessType: "Restaurant",
    clientName: "Copper Room",
    location: "Chennai",
    description:
      "An upscale bar-restaurant layout focused on guest flow, mood lighting, and premium materials built for high-traffic service.",
    images: [
      "/images/projects/bar-and-resterent-1.jpeg",
      "/images/projects/bar-and-resterent-2.png",
      "/images/projects/bar-and-resterent-3.png",
      "/images/projects/bar-and-resterent-1.png",
    ],
    tags: ["bar restaurant interior design chennai", "premium restaurant interiors"],
  },
  {
    slug: "hotel-interior-design-bengaluru-grand-nest",
    title: "Hotel Interior Design in Bengaluru - Grand Nest",
    businessType: "Hotel",
    clientName: "Grand Nest",
    location: "Bengaluru",
    description:
      "A hospitality design package with reception-forward planning, elegant wall treatments, and long-life material specifications.",
    images: [
      "/images/projects/hotal.png",
      "/images/projects/hotal-2.png",
      "/images/projects/hotal-3.png",
      "/images/projects/hotal-4.png",
    ],
    tags: ["hotel interior design bengaluru", "hospitality interior design"],
  },
  {
    slug: "jewelry-showroom-interior-design-hyderabad-aurum-house",
    title: "Jewelry Showroom Interior Design in Hyderabad - Aurum House",
    businessType: "Retail",
    clientName: "Aurum House",
    location: "Hyderabad",
    description:
      "A premium jewelry showroom concept with curated product spotlighting, secure display planning, and polished luxury finishes.",
    images: [
      "/images/projects/jewelry-shop-1.png",
      "/images/projects/jewelry-shop-2.png",
      "/images/projects/jewelry-shop-3.png",
      "/images/projects/home-3.png",
    ],
    tags: ["jewelry showroom interior design", "luxury retail interiors"],
  },
  {
    slug: "experience-center-interior-design-mumbai-frame-theater",
    title: "Experience Center Interior Design in Mumbai - Frame Theater",
    businessType: "Retail",
    clientName: "Frame Theater",
    location: "Mumbai",
    description:
      "An immersive experience-center design with dramatic lighting layers, acoustic-conscious surfaces, and premium visitor circulation.",
    images: [
      "/images/projects/theater-1.png",
      "/images/projects/theater-2.png",
      "/images/projects/theater-4.png",
      "/images/projects/theater-6.png",
    ],
    tags: ["experience center interior design", "thematic commercial interiors"],
  },
];

export const blogPosts = [
  {
    slug: "cost-to-design-a-cafe-in-india",
    title: "Cost to Design a Cafe in India (2026 Guide)",
    excerpt: "Understand budget ranges, material decisions, and where you can save without hurting quality.",
    content:
      "Cafe interior costs depend on sqft, finish tier, furniture scope, and timeline urgency. The smartest way to control cost is early planning with factory-direct production for counters, partitions, and custom furniture.",
  },
  {
    slug: "best-materials-for-restaurant-interiors",
    title: "Best Materials for Restaurant Interiors That Last",
    excerpt: "A practical material shortlist for heavy traffic and high-cleaning commercial spaces.",
    content:
      "For restaurants, choose anti-scratch laminates, treated veneers, quality powder-coated metal, and moisture-resistant core boards. Premium does not mean expensive if sourced and manufactured in-house.",
  },
  {
    slug: "commercial-interior-maintenance-checklist",
    title: "Commercial Interior Maintenance Checklist for Owners",
    excerpt: "A monthly and quarterly checklist to keep your interiors looking new for years.",
    content:
      "Planned maintenance protects your investment. Focus on sealant checks, polish cycles, lighting quality, and moisture control. Keep maintenance SOPs ready before launch day.",
  },
];
