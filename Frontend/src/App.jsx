import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import ProductDetails from './ProductsDetails';
import ProductForm from './components/ProductForm';
import Home from './components/Home';
import ProductsPage from './components/ProductsPage'; // Import the new ProductsPage component

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/products" element={<ProductsPage />} /> {/* New route for ProductsPage */}
        </Routes> {/* Closing tag for Routes */}
      </Router>
    </CartProvider>
  );
}

export default App;
