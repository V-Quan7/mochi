import { features } from "@/types/index";
export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-5 mt-7 ">

      <div className="bg-[#FFF1F5] rounded-[40px] p-10 flex items-center justify-between">

        {/* LEFT */}
        <div>

          <h2 className="text-6xl font-bold leading-tight text-[#FF6B9D]">

            Sưu tập đồ cute
            <br />
            Cho ngày thêm vui!

          </h2>

          <p className="mt-5 text-xl text-[#6B4F4F]">
            Thế giới dễ thương dành riêng cho bạn
          </p>

          <button className="mt-8 bg-[#FF6B9D] text-white px-8 py-4 rounded-full hover:scale-105 duration-300">

            Mua ngay

          </button>

        </div>

        {/* RIGHT */}
        <div>

          <img
            src="https://i.pinimg.com/736x/58/e3/9e/58e39e46eb1c1c2db8f44c1ef8a75c57.jpg"
            alt=""
            className="w-[400px] rounded-[30px]"
          />

        </div>

      </div>
      {/* FEATURES */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center gap-4">
            <div className={`${feature.bg} p-3 rounded-full`}>
              <feature.icon className={`${feature.color} w-6 h-6`} />
            </div>
            <div>
              <h3 className="font-bold">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}