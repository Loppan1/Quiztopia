import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface Location {
  latitude: number;
  longitude: number;
}

interface Question {
  location: Location;
  question: string;
  answer: string;
}

interface LeafletMapProps {
  questions: Question[];
  onMapClick?: (location: Location) => void; 
  onQuestionClick?: (question: Question) => void;
  zoomControl?: boolean;
  dragging?: boolean;
  touchZoom?: boolean;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
  boxZoom?: boolean;
  keyboard?: boolean;
}

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const userIcon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const LeafletMap: React.FC<LeafletMapProps> = ({
  questions = [],
  onMapClick,
  onQuestionClick,
  zoomControl = true,
  dragging = true,
  touchZoom = true,
  scrollWheelZoom = true,
  doubleClickZoom = true,
  boxZoom = true,
  keyboard = true,
}) => {
  const [userPosition, setUserPosition] = useState<Location | null>(null);

  const center: L.LatLngExpression =
    questions.length > 0
      ? [(questions[0].location.latitude), questions[0].location.longitude]
      : userPosition
      ? [userPosition.latitude, userPosition.longitude]
      : [0, 0];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      zoomControl={zoomControl}
      dragging={dragging}
      touchZoom={touchZoom}
      scrollWheelZoom={scrollWheelZoom}
      doubleClickZoom={doubleClickZoom}
      boxZoom={boxZoom}
      keyboard={keyboard}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {questions.map((q, index) => (
        <Marker 
          key={index} 
          position={[q.location.latitude, q.location.longitude]}
          eventHandlers={{
            click: () => onQuestionClick && onQuestionClick(q)
          }}>
          <Popup>{q.question}</Popup>
        </Marker>
      ))}

      {userPosition && (
        <Marker position={[userPosition.latitude, userPosition.longitude]} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {onMapClick && <MapClickHandler onClick={onMapClick} />}
    </MapContainer>
  );
};

const MapClickHandler: React.FC<{ onClick: (location: Location) => void }> = ({ onClick }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onClick({ latitude: lat, longitude: lng });
    },
  });

  return null;
};

export default LeafletMap;