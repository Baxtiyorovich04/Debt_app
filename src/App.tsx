import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/privateRoute";
import HomePage from "./components/home";
import LoginPage from "./components/login";
import Loading from "./components/loading";
import ClientsPage from "./components/clients";
import AddClient from "./components/clients/AddClient";
import ClientDetailPage from "./components/clients/ClientDetail";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="clients/add" element={<AddClient />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
