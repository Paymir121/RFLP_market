import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/product/ProductDetailPage';
import ProductCreateProduct from './pages/product/ProductCreateProduct';
import Login from './auth/Login';
import Register from './auth/Register';
import ProfilePage from './auth/ProfilePage';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
      <Router>          {/* <-- Перенесли Router наружу */}
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage type="Все продукты" />} />
              <Route path="/products/api" element={<ProductsPage type="API" />} />
              <Route path="/products/equipment" element={<ProductsPage type="Оборудование" />} />
              <Route path="/products/auxiliary" element={<ProductsPage type="Вспомогательные вещества" />} />
              <Route path="/products/RFLP" element={<ProductsPage type="Радиофармпрепараты" />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/create-product" element={<ProductCreateProduct />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </Router>
  );
}

export default App;
