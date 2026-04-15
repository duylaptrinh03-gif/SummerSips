const features = [
  {
    icon: "🌿",
    title: "100% Nguyên Liệu Tự Nhiên",
    description:
      "Chúng tôi chỉ sử dụng trái cây tươi ngon nhất, hoàn toàn tự nhiên — không hương liệu nhân tạo, không chất bảo quản, chỉ là sự thuần khiết.",
    gradient: "from-green-400 to-emerald-400",
    bg: "from-green-50 to-emerald-50",
  },
  {
    icon: "⚡",
    title: "Ép Lạnh Mỗi Ngày",
    description:
      "Mỗi mẻ đều được ép lạnh tươi mới mỗi sáng để giữ tối đa dưỡng chất, hương vị và màu sắc rực rỡ.",
    gradient: "from-yellow-400 to-orange-400",
    bg: "from-yellow-50 to-orange-50",
  },
  {
    icon: "🚀",
    title: "Giao Hàng Nhanh",
    description:
      "Từ bếp của chúng tôi đến tay bạn trong vòng 60 phút. Lạnh mát và sẵn sàng thưởng thức ngay khi nhận.",
    gradient: "from-blue-400 to-cyan-400",
    bg: "from-blue-50 to-cyan-50",
  },
  {
    icon: "🎨",
    title: "Pha Chế Theo Yêu Cầu",
    description:
      "Tự sáng tạo thức uống của riêng bạn! Kết hợp các hương vị để tạo ra một tuyệt phẩm mùa hè cá nhân hóa.",
    gradient: "from-pink-400 to-rose-400",
    bg: "from-pink-50 to-rose-50",
  },
];

const promotions = [
  {
    emoji: "🛒",
    title: "Mua 3 Tặng 1",
    desc: "Tích ngay những vị yêu thích của bạn",
    color: "from-orange-500 to-red-500",
  },
  {
    emoji: "🎉",
    title: "Combo Hè — Giảm 20%",
    desc: "Gói 6 ly được ưa chuộng nhất của chúng tôi",
    color: "from-pink-500 to-fuchsia-500",
  },
  {
    emoji: "🚚",
    title: "Miễn Phí Ship Từ 150K",
    desc: "Không cần mã — tự động áp dụng",
    color: "from-sky-500 to-blue-500",
  },
];

export default function FeatureSection() {
  return (
    <>
      {/* Tại Sao Chọn Chúng Tôi */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
              Tại Sao Chọn Summer Sips?
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Tốt Cho Bạn.{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Tuyệt Vời Cho Mùa Hè.
              </span>
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Chúng tôi tin vào những thức uống vừa ngon miệng vừa tốt cho sức khỏe của bạn.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className={`group relative p-6 rounded-3xl bg-gradient-to-br ${f.bg} border border-white hover:shadow-xl transition-all duration-400 hover:-translate-y-2 cursor-default`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Khuyến Mãi */}
      <section id="promotions" className="py-20 px-6 bg-gradient-to-br from-gray-950 to-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-sm font-semibold mb-4">
              🔥 Ưu Đãi Có Thời Hạn
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Khuyến Mãi{" "}
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Mùa Hè
              </span>{" "}
              Đã Đến
            </h2>
            <p className="text-gray-400 text-lg">Ưu đãi chỉ có trong mùa hè. Đừng bỏ lỡ!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.title}
                className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${promo.color} text-3xl mb-4 shadow-lg`}
                >
                  {promo.emoji}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{promo.title}</h3>
                <p className="text-gray-400 text-sm">{promo.desc}</p>
                <div className={`mt-4 h-0.5 rounded-full bg-gradient-to-r ${promo.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
