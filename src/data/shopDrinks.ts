export interface ShopDrink {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  tag?: string;
}

export const shopDrinks: ShopDrink[] = [
  {
    id: 101,
    name: "Trà Chanh",
    price: 20000,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80",
    description: "Trà chanh mát lạnh, chua ngọt hài hòa, giải khát tuyệt vời.",
    tag: "Bán Chạy",
  },
  {
    id: 102,
    name: "Trà Đào",
    price: 30000,
    image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&auto=format&fit=crop&q=80",
    description: "Trà đào thơm ngon với những lát đào tươi và trà xanh đặc biệt.",
    tag: "Phổ Biến",
  },
  {
    id: 103,
    name: "Nước Ép Cam",
    price: 35000,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=80",
    description: "Nước ép cam tươi nguyên chất, giàu vitamin C, tốt cho sức khỏe.",
    tag: "Lành Mạnh",
  },
  {
    id: 104,
    name: "Sinh Tố Xoài",
    price: 40000,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80",
    description: "Sinh tố xoài béo ngậy, thơm mát từ những trái xoài chín mọng nhất.",
    tag: "Mới",
  },
  {
    id: 105,
    name: "Cà Phê Sữa Đá",
    price: 25000,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=80",
    description: "Cà phê sữa đá đậm đà, thơm ngon, đúng vị Việt Nam cổ điển.",
    tag: "Yêu Thích",
  },
];
