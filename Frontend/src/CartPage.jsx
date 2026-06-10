import { useEffect, useState, useContext } from 'react';

import { CartContext } from './CartContext';

const CartPage = () => {
  const { userId } = useContext(CartContext); // Assuming userId is available in context
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/cart/${userId}`);
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [userId]);

  const handleQuantityChange = async (productId, action) => {
    const response = await fetch(`http://localhost:7000/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        productId,
        quantity: action === 'increase' ? 1 : -1,
      }),
    });
    const updatedCart = await response.json();
    setCart(updatedCart);
  };


  if (!cart) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.products.map((item) => (
        <div key={item.productId}>
          <h2>{item.productId.name}</h2>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => handleQuantityChange(item.productId, 'increase')}>+</button>
          <button onClick={() => handleQuantityChange(item.productId, 'decrease')}>-</button>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
