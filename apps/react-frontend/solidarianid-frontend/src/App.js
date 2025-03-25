import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import CommunityRequest from './pages/CommunityRequest';
import ValidateCommunities from "./pages/ValidateCommunities";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/communityRequest" element={<CommunityRequest />} />
        <Route path="/validateCommunities" element={<ValidateCommunities />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;