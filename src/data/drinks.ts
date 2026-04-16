import { Drink } from "@/types/drink";

// ── Toppings dùng chung ───────────────────────────────────────────────────
const TOPPINGS_CHUNG = [
  { id: "top-tran-chau-den", name: "Trân châu đen", price: 5000 },
  { id: "top-tran-chau-trang", name: "Trân châu trắng", price: 5000 },
  { id: "top-thach-dao", name: "Thạch đào", price: 6000 },
  { id: "top-thach-cacao", name: "Thạch cacao", price: 6000 },
  { id: "top-kem-tuoi", name: "Kem tươi", price: 8000 },
  { id: "top-hat-sen", name: "Hạt sen", price: 7000 },
];

// Chỉ trà sữa có trân châu, kem
const TOPPINGS_TRA_SUA = TOPPINGS_CHUNG;

// Cà phê chỉ có kem
const TOPPINGS_CA_PHE = [
  { id: "top-kem-tuoi", name: "Kem tươi", price: 8000 },
  { id: "top-kem-bong", name: "Kem bông", price: 5000 },
];

// Size phổ biến
const SIZES_DEFAULT = [
  { name: "S" as const, label: "Nhỏ", extraPrice: 0 },
  { name: "M" as const, label: "Vừa", extraPrice: 5000 },
  { name: "L" as const, label: "Lớn", extraPrice: 10000 },
];

// ── Mock Drinks Data ──────────────────────────────────────────────────────
export const drinks: Drink[] = [
  // ── CÀ PHÊ ────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Cà Phê Sữa Đá",
    basePrice: 25000,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80",
    description:
      "Cà phê phin truyền thống đậm đà, pha cùng sữa đặc thơm ngon. Uống với đá mát lạnh — đúng vị Việt Nam.",
    category: "Cà Phê",
    tag: "Yêu Thích",
    isAvailable: true,
    sizeOptions: SIZES_DEFAULT,
    toppingOptions: TOPPINGS_CA_PHE,
  },
  {
    id: 3,
    name: "Bạc Xỉu",
    basePrice: 28000,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    description:
      "Ly cà phê sữa tỷ lệ ngược — nhiều sữa, ít cà phê. Ngọt ngào, béo ngậy, phù hợp cho người mới uống.",
    category: "Cà Phê",
    isAvailable: true,
    sizeOptions: SIZES_DEFAULT,
    toppingOptions: TOPPINGS_CA_PHE,
  },

  // ── TRÀ SỮA ───────────────────────────────────────────────────────────
  {
    id: 4,
    name: "Trà Sữa Trân Châu",
    basePrice: 35000,
    image:
      "https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&auto=format&fit=crop&q=80",
    description:
      "Trà Assam đậm đà pha cùng sữa tươi, ngọt nhẹ. Topping trân châu đen dai giòn cực nghiện.",
    category: "Trà Sữa",
    tag: "Bán Chạy",
    isAvailable: true,
    sizeOptions: SIZES_DEFAULT,
    toppingOptions: TOPPINGS_TRA_SUA,
  },
  {
    id: 5,
    name: "Trà Sữa Matcha",
    basePrice: 40000,
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&auto=format&fit=crop&q=80",
    description:
      "Bột matcha Nhật Bản chất lượng cao hòa quyện với sữa tươi. Màu xanh đẹp mắt, vị thanh dịu.",
    category: "Trà Sữa",
    tag: "Mới",
    isAvailable: true,
    sizeOptions: SIZES_DEFAULT,
    toppingOptions: TOPPINGS_TRA_SUA,
  },
  {
    id: 6,
    name: "Trà Sữa Khoai Môn",
    basePrice: 38000,
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop&q=80",
    description:
      "Khoai môn tím nghiền mịn pha cùng sữa tươi. Màu tím độc đáo, vị béo bùi khó cưỡng.",
    category: "Trà Sữa",
    isAvailable: true,
    sizeOptions: SIZES_DEFAULT,
    toppingOptions: TOPPINGS_TRA_SUA,
  },

  // ── TRÀ TRÁI CÂY ──────────────────────────────────────────────────────
  {
    id: 7,
    name: "Trà Đào Cam Sả",
    basePrice: 32000,
    image:
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=600&auto=format&fit=crop&q=80",
    description:
      "Trà xanh ướp cùng đào tươi, cam vắt và lá sả thơm. Thanh mát, chua nhẹ, giải nhiệt mùa hè.",
    category: "Trà Trái Cây",
    tag: "Phổ Biến",
    isAvailable: true,
    sizeOptions: SIZES_DEFAULT,
    toppingOptions: [
      { id: "top-thach-dao", name: "Thạch đào", price: 6000 },
      { id: "top-hat-sen", name: "Hạt sen", price: 7000 },
    ],
  },
  {
    id: 8,
    name: "Trà Chanh Muối",
    basePrice: 22000,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80",
    description:
      "Trà chanh vắt tươi, pha chút muối biển. Vị chua mặn ngọt hài hòa, cực giải khát.",
    category: "Trà Trái Cây",
    tag: "Bán Chạy",
    isAvailable: true,
    sizeOptions: SIZES_DEFAULT,
    toppingOptions: [],
  },
  {
    id: 9,
    name: "Trà Dâu Tây",
    basePrice: 35000,
    image:
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&fit=crop&q=80",
    description:
      "Dâu tây tươi xay nhuyễn hòa cùng trà xanh và nước đường. Màu hồng quyến rũ, vị ngọt chua tự nhiên.",
    category: "Trà Trái Cây",
    tag: "Mới",
    isAvailable: true,
    sizeOptions: SIZES_DEFAULT,
    toppingOptions: [
      { id: "top-thach-dao", name: "Thạch đào", price: 6000 },
      { id: "top-tran-chau-trang", name: "Trân châu trắng", price: 5000 },
    ],
  },

  // ── SINH TỐ ───────────────────────────────────────────────────────────
  {
    id: 10,
    name: "Sinh Tố Xoài",
    basePrice: 40000,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80",
    description:
      "Xoài Cát Hòa Lộc chín mọng xay cùng sữa tươi và đá. Béo ngậy, thơm ngon, đúng vị mùa hè.",
    category: "Sinh Tố",
    tag: "Yêu Thích",
    isAvailable: true,
    sizeOptions: [
      { name: "M" as const, label: "Vừa", extraPrice: 0 },
      { name: "L" as const, label: "Lớn", extraPrice: 10000 },
    ],
    toppingOptions: [{ id: "top-kem-tuoi", name: "Kem tươi", price: 8000 }],
  },
  {
    id: 11,
    name: "Sinh Tố Bơ",
    basePrice: 45000,
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop&q=80",
    description:
      "Bơ sáp xay cùng sữa đặc và sữa tươi. Béo mịn, bổ dưỡng, thỏa mãn cơn thèm.",
    category: "Sinh Tố",
    isAvailable: true,
    sizeOptions: [
      { name: "M" as const, label: "Vừa", extraPrice: 0 },
      { name: "L" as const, label: "Lớn", extraPrice: 10000 },
    ],
    toppingOptions: [{ id: "top-kem-tuoi", name: "Kem tươi", price: 8000 }],
  },

  // ── NƯỚC ÉP ───────────────────────────────────────────────────────────
  {
    id: 12,
    name: "Nước Ép Cam Tươi",
    basePrice: 35000,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=80",
    description:
      "Cam vắt tươi nguyên chất 100%, không đường, không phụ gia. Giàu vitamin C, tốt cho sức khỏe.",
    category: "Nước Ép",
    tag: "Lành Mạnh",
    isAvailable: true,
    sizeOptions: [
      { name: "M" as const, label: "Vừa (330ml)", extraPrice: 0 },
      { name: "L" as const, label: "Lớn (500ml)", extraPrice: 10000 },
    ],
    toppingOptions: [],
  },
  {
    id: 13,
    name: "Nước Ép Dưa Hấu",
    basePrice: 30000,
    image:
      "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=80",
    description:
      "Dưa hấu đỏ mọng xay nguyên chất. Ngọt tự nhiên, mát lạnh, giải khát cực đỉnh ngày nóng.",
    category: "Nước Ép",
    tag: "Lành Mạnh",
    isAvailable: true,
    sizeOptions: [
      { name: "M" as const, label: "Vừa (330ml)", extraPrice: 0 },
      { name: "L" as const, label: "Lớn (500ml)", extraPrice: 10000 },
    ],
    toppingOptions: [],
  },
];
