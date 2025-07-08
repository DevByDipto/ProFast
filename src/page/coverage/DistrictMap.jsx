// src/components/DistrictMap.jsx

import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🛠 Leaflet-এর ডিফল্ট আইকন ফিক্স
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 📍 এই কম্পোনেন্ট ম্যাপকে নির্দিষ্ট লোকেশনে পাঠাবে
function MapController({ focusLocation }) {
  const map = useMap();
  if (focusLocation) {
    map.flyTo(focusLocation, 10); // zoom level 10
        
  }
  return null;
}

// 🌐 মূল ম্যাপ কম্পোনেন্ট
const DistrictMap = ({ serviceCenters }) => {
  const searchRef = useRef(); // সার্চ ইনপুট রেফারেন্স
  const [focusLocation, setFocusLocation] = useState(null); // কোন জেলায় ফোকাস করবে

  // 🔍 সার্চ হ্যান্ডলার
  const handleSearch = () => {
    const searchValue = searchRef.current.value.toLowerCase();

    const found = serviceCenters.find(center =>
      center.district.toLowerCase().includes(searchValue)
    );

    if (found) {
      setFocusLocation([found.latitude, found.longitude]);
    } else {
      alert("District not found!");
    }
  };

  return (
    <div>
      {/* 🔍 সার্চ বক্স */}
      <div className="mb-4 flex gap-2">
        <input
          ref={searchRef}
          type="text"
          placeholder="Enter district name..."
          className="input input-bordered w-full max-w-xs"
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {/* 🗺️ ম্যাপ */}
      <MapContainer
        center={[23.685, 90.3563]} // Bangladesh center
        zoom={6.5}
        scrollWheelZoom={false}
        className="h-[700px] w-full rounded-xl border shadow-lg"
      >
        {/* 🌍 ম্যাপ টাইল */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 🔄 ফোকাস লোকেশন সেট করা */}
        <MapController focusLocation={focusLocation} />

        {/* 📌 ৬৪ জেলার মার্কার */}
        {serviceCenters.map((center, index) => (
          <Marker
            key={index}
            position={[center.latitude, center.longitude]}
          >
            <Popup>
              <strong>{center.district}</strong> <br />
               {center.covered_area.join(',')}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DistrictMap;
