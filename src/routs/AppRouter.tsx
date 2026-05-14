import { BrowserRouter, Routes, Route } from "react-router-dom";
//import de las paginas
import Login from "../pages/auth/Login";
import Layout from "../layouts/Layout";
import PrivateRoute from "./PrivateRoute";
//importar el contexto del user
import { AuthProvider } from "../context/AuthContext";
//importar el contexto de sucursal
import { BranchProvider } from "../context/BranchContext";
//import del sonner el toast
import { Toaster } from "@/components/ui/sonner";
//improt pages
import Dashboard from "@/pages/dashboard/Dashboard";
import Employee from "../pages/employee/Employee";
import Branch from "@/pages/branch/Branch";
import CreateProduct from "@/pages/product/CreateProduct";
import Category from "@/pages/categories/Category";
import Product from "@/pages/product/Product";
import Sale from "@/pages/sale/Sale";
import Movements from "@/pages/movements/Movements";
import Profile from "@/pages/profile/Profile";
import Pos from "@/pages/pos/Pos";
import Register from "@/pages/auth/Register";
import Supplier from "@/pages/supplier/Supplier";
import Purchase from "@/pages/purchase/Purchase";
import CreatePurchase from "@/pages/purchase/CreatePurchase";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* RUTAS DEL DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <AuthProvider>
              <BranchProvider>
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              </BranchProvider>
            </AuthProvider>
          }
        >
          <Route index element={<Dashboard />} />
          {/* rutas de empleados */}
          <Route path="employees" element={<Employee />} />
          <Route path="branches" element={<Branch />} />
          <Route path="categories" element={<Category />} />
          <Route path="products" element={<Product />} />
          {/* ruta de creación del producto */}
          <Route path="createp" element={<CreateProduct />} />
          {/* ruta de edición del producto */}
          <Route path="editp/:id" element={<CreateProduct />} />
          {/* modo vista */}
          <Route path="viewp/:id" element={<CreateProduct mode={"view"} />} />
          {/* Pagina de ventas */}
          <Route path="pos" element={<Pos />} />
          {/* pagina de info de las ventas realizadas */}
          <Route path="sales" element={<Sale />} />
          {/* pagina de movimientos */}
          <Route path="movements" element={<Movements />} />
          {/* Perfil del usuario */}
          <Route path="profile" element={<Profile />} />
          {/* Proveedores */}
          <Route path="suppliers" element={<Supplier />} />
          {/* Compras */}
          <Route path="compras" element={<Purchase />} />
          <Route path="compras/nueva" element={<CreatePurchase />} />
          <Route path="compras/:id" element={<CreatePurchase />} />
        </Route>
      </Routes>
      <Toaster theme="dark" />
    </BrowserRouter>
  );
};

export default AppRouter;
