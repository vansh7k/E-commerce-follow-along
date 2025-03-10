import { useState, useEffect } from "react";
import Card from "./Card";
import { Nav } from "./Nav";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mt-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          All Products
        </h1>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full max-w-6xl">
          {products.map((item, index) => (
            <Card
              key={index}
              index={item._id}
              name={item.name}
              price={item.price}
              category={item.category}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
