import React from "react";

const About: React.FC = () => {
  return (
    <section className="bg-gray-100 py-12 px-6 md:px-20" id="about">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          📌 Về Chúng Tôi – TechStore
        </h2>

        <p className="text-lg text-gray-700 mb-6">
          <strong>TechStore</strong> là hệ thống bán lẻ laptop uy tín, chuyên
          cung cấp các dòng máy tính xách tay chính hãng từ các thương hiệu hàng
          đầu như <strong>Apple, Dell, HP, Asus, Lenovo, Acer</strong> và nhiều
          hãng công nghệ khác.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          🎯 Sứ Mệnh
        </h3>
        <p className="text-gray-700 text-base">
          Mang đến cho khách hàng những sản phẩm{" "}
          <strong>công nghệ chất lượng cao</strong>, giá cả hợp lý cùng dịch vụ{" "}
          <strong>hậu mãi chuyên nghiệp</strong>. TechStore không chỉ bán laptop
          – chúng tôi trao giải pháp làm việc, học tập và giải trí hiệu quả.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          💡 Tại sao chọn TechStore?
        </h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>
            <strong>100% chính hãng</strong> – Bảo hành rõ ràng, minh bạch.
          </li>
          <li>
            <strong>Giao hàng nhanh chóng</strong> – Toàn quốc trong 2-3 ngày.
          </li>
          <li>
            <strong>Trả góp 0%</strong> – Linh hoạt với nhiều phương thức thanh
            toán.
          </li>
          <li>
            <strong>Hỗ trợ kỹ thuật trọn đời</strong> – Cài đặt, tư vấn miễn
            phí.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          👨‍💼 Đội ngũ TechStore
        </h3>
        <p className="text-gray-700 text-base">
          Chúng tôi là những người trẻ, đam mê công nghệ, luôn sẵn sàng tư vấn
          tận tâm để giúp bạn chọn được chiếc laptop phù hợp nhất – dù bạn là{" "}
          <strong>
            học sinh, sinh viên, dân văn phòng, lập trình viên, thiết kế đồ họa
          </strong>{" "}
          hay <strong>game thủ chuyên nghiệp</strong>.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">
          📍 Địa chỉ showroom
        </h3>
        <p className="text-gray-700 text-base">
          <strong>TechStore – Trải nghiệm công nghệ vượt trội</strong>
          <br />
          Số 123 Đường Công Nghệ, Quận 10, TP. Hồ Chí Minh
          <br />
          Hotline: 1900 1234 567
          <br />
          Email:{" "}
          <a
            href="mailto:support@techstore.vn"
            className="text-blue-600 hover:underline"
          >
            support@techstore.vn
          </a>
        </p>
      </div>
    </section>
  );
};

export default About;
