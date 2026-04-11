import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default Leaflet icons not showing in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Red Icon for SOS
const sosIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LiveMap = () => {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        // Filter out posts that don't have valid coordinates
        const validPoints = res.data.filter(p => p.location && p.location.lat && p.location.lng);
        setPoints(validPoints);
      } catch (err) {
        console.error("Map fetch error", err);
      }
    };
    fetchLocations();
    const interval = setInterval(fetchLocations, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', border: '2px solid #ddd' }}>
      <MapContainer center={[20.2961, 85.8245]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {points.map(point => (
          <Marker 
            key={point._id} 
            position={[point.location.lat, point.location.lng]}
            icon={point.isEmergency ? sosIcon : new L.Icon.Default()}
          >
            <Popup>
              <strong>{point.isEmergency ? "🚨 SOS ALERT" : point.title}</strong><br/>
              {point.description.substring(0, 50)}...
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;