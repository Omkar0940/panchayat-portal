import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem("userLocation");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [locationName, setLocationName] = useState(
    () => localStorage.getItem("locationName") || ""
  );
  const [detecting, setDetecting] = useState(false);

  const saveLocation = (loc, name) => {
    setLocation(loc);
    setLocationName(name);
    localStorage.setItem("userLocation", JSON.stringify(loc));
    localStorage.setItem("locationName", name);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const loc = { latitude, longitude };

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const area =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.village ||
            data.address?.town ||
            "";
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            "Your Location";
          const name = area ? `${area}, ${city}` : city;
          saveLocation(loc, name);
        } catch {
          saveLocation(loc, `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setDetecting(false);
      },
      (err) => {
        console.error("Location error:", err);
        setDetecting(false);
        alert("Unable to detect location. Please allow location access.");
      },
      { timeout: 10000 }
    );
  };

  // Calculate distance between two coordinates in km
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <LocationContext.Provider
      value={{ location, locationName, detecting, detectLocation, saveLocation, getDistance }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
