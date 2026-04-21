import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Produits from './pages/produits/Produits';
import Commandes from './pages/commandes/Commandes';
import Devis from './pages/devis/Devis';
import Factures from './pages/factures/Factures';
import Clients from './pages/clients/Clients';
import Categories from './pages/categories/Categories';
import Adresses from './pages/adresses/Adresses';
import Contacts from './pages/contacts/Contacts';
import Entreprises from './pages/entreprises/Entreprises';
import Tickets from './pages/tickets/Tickets';
import Users from './pages/users/Users';
import Vendeurs from './pages/vendeurs/Vendeurs';
import ProduitForm from './pages/produits/ProduitForm';
import DevisForm from './pages/devis/DevisForm';
import CommandeDetail from './pages/commandes/CommandeDetail';
import PaiementForm from './pages/factures/PaiementForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="produits" element={<Produits />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="devis" element={<Devis />} />
          <Route path="factures" element={<Factures />} />
          <Route path="clients" element={<Clients />} />
          <Route path="categories" element={<Categories />} />
          <Route path="adresses" element={<Adresses />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="entreprises" element={<Entreprises />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="users" element={<Users />} />
          <Route path="vendeurs" element={<Vendeurs />} />
          <Route path="produits/new" element={<ProduitForm />} />
          <Route path="produits/:id/edit" element={<ProduitForm />} />
          <Route path="devis/new" element={<DevisForm />} />
          <Route path="devis/:id/edit" element={<DevisForm />} />
          <Route path="commandes/:id" element={<CommandeDetail />} />
          <Route path="factures/:id/payer" element={<PaiementForm />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}