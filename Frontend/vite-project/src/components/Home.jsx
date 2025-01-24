import Card from "./Card";
import products from "../db/product";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-gray-100">
      <h1 className="text-3xl font-bold text-center pt-6">
        Welcome to the Home Page!
      </h1>
      <div className="flex justify-center mt-4">
        <p className="text-gray-300">Check out our amazing products below:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {products.map((item) => (
          <Card
            key={item.id}
            name={item.name}
            prevPrice={item.prevPrice}
            currPrice={item.currPrice}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
