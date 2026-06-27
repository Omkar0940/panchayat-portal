import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "./context/LocationContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Providers from "./pages/Providers";
import ProviderDetails from "./pages/ProviderDetails";
import Events from "./pages/Events";
import Complaints from "./pages/Complaints";
import Admin from "./pages/Admin";
import Emergency from "./pages/Emergency";
import Profile from "./pages/Profile";

function App() {
  return (
    <LocationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />
          <Route path="/events" element={<Events />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </LocationProvider>
  );
}

export default App;
