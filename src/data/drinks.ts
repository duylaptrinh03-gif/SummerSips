export interface Drink {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string;
  rating: number;
}

export const drinks: Drink[] = [
  {
    id: 1,
    name: "Sinh Tố Xoài Nhiệt Đới",
    description:
      "Hương vị xoài chín mọng kết hợp cùng nước dừa tươi và một chút chanh leo. Thiên đường nhiệt đới ngay trong ly.",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80",
    tag: "Bán Chạy",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Chanh Dâu Tươi Mát",
    description:
      "Nước chanh vắt tay kết hợp việt quất, dâu tây và lá bạc hà tươi. Đậm đà, mát lạnh, đúng vị mùa hè.",
    price: 39000,
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&auto=format&fit=crop&q=80",
    tag: "Mới",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Dưa Hấu Sảng Khoái",
    description:
      "Nước dưa hấu mát lạnh xay nhuyễn cùng hạt é và nước soda. Ngụm nhỏ như cả mùa hè trong miệng.",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80",
    tag: "Theo Mùa",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Punch Cam Bình Minh",
    description:
      "Hỗn hợp nổi bật từ cam huyết, bưởi và nước dứa được xếp lớp cùng grenadine. Đẹp và ngon không kém.",
    price: 42000,
    image:
      "https://images.unsplash.com/photo-1560508179-b2c9a3555b75?w=600&auto=format&fit=crop&q=80",
    tag: "Phổ Biến",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Dừa Lạnh Xanh Ngọc",
    description:
      "Sữa dừa béo ngậy, nước dứa và tảo xoắn xanh quyện vào nhau tạo nên màu sắc và hương vị tuyệt vời.",
    price: 49000,
    image:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&auto=format&fit=crop&q=80",
    tag: "Cao Cấp",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Detox Xanh Vườn",
    description:
      "Dưa leo, rau bina, táo xanh, gừng và chanh. Thanh lọc cơ thể từ bên trong, khởi đầu ngày mới tràn đầy năng lượng.",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&auto=format&fit=crop&q=80",
    tag: "Lành Mạnh",
    rating: 4.6,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    role: "Người đam mê thể dục",
    avatar: "https://i.pravatar.cc/150?img=47",
    quote:
      "Detox Xanh Vườn là nghi lễ mỗi sáng của tôi! Vừa ngon vừa giúp tôi tràn đầy năng lượng cả buổi sáng. Đồ uống ngon nhất tôi từng thử.",
    rating: 5,
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    role: "Blogger ẩm thực",
    avatar: "https://i.pravatar.cc/150?img=12",
    quote:
      "Thử Sinh Tố Xoài Nhiệt Đới theo lời bạn bè rồi ghiền luôn. Độ tươi ngon không đâu sánh bằng, mỗi ngụm là một trải nghiệm.",
    rating: 5,
  },
  {
    id: 3,
    name: "Phạm Thị Hoa",
    role: "Huấn luyện viên Yoga",
    avatar: "https://i.pravatar.cc/150?img=48",
    quote:
      "Mỗi ngụm như một chuyến du lịch! Dừa Lạnh Xanh Ngọc là thức uống không thể thiếu sau buổi yoga nóng. Tuyệt vời!",
    rating: 5,
  },
];
