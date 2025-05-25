import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Heading, 
  Spinner,
  Container,
  Badge
} from '@chakra-ui/react';
import { RootState } from '../../store';
import { fetchNetworks, fetchNetworkSensors } from '../../store/networksSlice';
import { useAuth } from '../../hooks/useAuth';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapContent = () => {
  const map = useMap();
  const sensors = useSelector((state: RootState) => state.networks.sensors);

  useEffect(() => {
    if (sensors.length > 0) {
      const bounds = L.latLngBounds(
        sensors.map(sensor => [sensor.coordinates.lat, sensor.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [sensors, map]);

  return null;
};

const MapPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useAuth();

  const networks = useSelector((state: RootState) => state.networks.networks);
  const sensors = useSelector((state: RootState) => state.networks.sensors);
  const { company } = useSelector((state: RootState) => state.auth.user || { company: null });
  const loading = useSelector((state: RootState) => state.networks.loading);

  useEffect(() => {
    if (company) {
      dispatch(fetchNetworks(company) as any);
    }
  }, [company, dispatch]);

  useEffect(() => {
    if (networks.length > 0) {
      networks.forEach(network => {
        dispatch(fetchNetworkSensors(network.id) as any);
      });
    }
  }, [networks, dispatch]);

  if (!company) {
    return (
      <Container centerContent h="100vh" justifyContent="center">
        <Heading size="md" color="red.500">
          You don't have a company assigned. Please contact your administrator.
        </Heading>
      </Container>
    );
  }

  if (loading) return (
    <Container centerContent h="100vh" justifyContent="center">
      <Spinner 
        color="blue.500"
        size="xl"
      />
      <p>Loading sensors data...</p>
    </Container>
  );

  return (
    <Box p={4} h="calc(100vh - 80px)">
      <Heading as="h1" size="xl" mb={4} color="teal.500">
        {company} Sensors Map
      </Heading>

      {sensors.length === 0 ? (
        <Box textAlign="center" mt={10}>
          <p>No sensors found for your company.</p>
        </Box>
      ) : (
        <MapContainer 
          center={[55.751244, 37.618423]} 
          zoom={5} 
          style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {sensors.map(sensor => {
            const hasAccess = currentUser.role === 'admin' || 
                             currentUser.role === 'moderator' || 
                             sensor.accessUsers?.includes(currentUser.username);
            
            return (
              <Marker
                key={sensor.sensorId}
                position={[sensor.coordinates.lat, sensor.coordinates.lng]}
                icon={defaultIcon}
              >
                <Popup>
                  <Box>
                    <Heading size="sm">{sensor.name}</Heading>
                    <Badge 
                      colorScheme={sensor.isActive ? 'green' : 'red'}
                      mb={2}
                    >
                      {sensor.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <p>📍 {sensor.location} ({sensor.region})</p>
                    <p>Network: {sensor.networkId}</p>
                    <p >Last updated: {new Date(sensor.lastUpdated).toLocaleString()}</p>
                    {!hasAccess && (
                      <p color="orange.500">
                        No access to this sensor
                      </p>
                    )}
                  </Box>
                </Popup>
              </Marker>
            );
          })}
          
          <MapContent />
        </MapContainer>
      )}
    </Box>
  );
};

export default MapPage;