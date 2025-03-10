import React, { useState, useEffect, useContext } from 'react'; // Import React for JSX
import { useParams } from 'react-router-dom';
import { CartContext } from './CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:7000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <React.Fragment>
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        <div>
          {product.images.map((image, index) => (
            <img key={index} src={image} alt={product.name} />
          ))}
        </div>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </React.Fragment>
  );
};

export default ProductDetails;
