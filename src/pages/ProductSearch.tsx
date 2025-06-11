import React, { useState } from "react";

const sampleProducts = [
  { id: 1, name: "MacBook Air M2", brand: "Apple", price: "32,000,000" },
  { id: 2, name: "Dell XPS 13", brand: "Dell", price: "28,000,000" },
  { id: 3, name: "Asus ROG Strix", brand: "Asus", price: "35,000,000" },
  { id: 4, name: "HP Envy 15", brand: "HP", price: "24,000,000" },
  { id: 5, name: "Lenovo ThinkPad X1", brand: "Lenovo", price: "30,000,000" },
];

const ProductSearch = () => {
  const [query, setQuery] = useState("");

  const filteredProducts = sampleProducts.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🔍 Tìm kiếm sản phẩm</h2>

      <input
        type="text"
        placeholder="Nhập tên laptop..."
        className="w-full p-2 border border-gray-300 rounded mb-6"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 border rounded shadow-sm bg-white"
            >
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p>Hãng: {product.brand}</p>
              <p>Giá: {product.price} VNĐ</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Không tìm thấy sản phẩm nào phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
