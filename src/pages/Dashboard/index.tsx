import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Heading, 
  List, 
  ListItem, 
  Card, 
  CardBody, 
  Stack,
  Text,
  Badge,
  Spinner,
  SimpleGrid,
  Container,
  Button
} from '@chakra-ui/react';
import { RootState } from '../../store';
import { fetchNetworks, fetchNetworkSensors } from '../../store/networksSlice';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const networks = useSelector((state: RootState) => state.networks.networks);
  const sensors = useSelector((state: RootState) => state.networks.sensors);
  const { company } = useSelector((state: RootState) => state.auth.user || { company: null });
  const loading = useSelector((state: RootState) => state.networks.loading);

  useEffect(() => {
    if (company) {
      dispatch(fetchNetworks(company) as any);
    }
  }, [company, dispatch]);

  const handleNetworkSelect = (networkId: string) => {
    dispatch(fetchNetworkSensors(networkId) as any);
  };
  const handleSensorSelect = (networkId: string, sensorId: string) => {
    console.log(sensorId)
      navigate(`/sensors/${networkId}/${sensorId}`);
    };
  if (loading) return (
    <Container centerContent h="100vh" justifyContent="center">
      <Spinner 
        color="blue.500"
        size="xl"
      />
      <Text mt={4}>Loading networks...</Text>
    </Container>
  );

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8} color="teal.500">
        {company} Networks Dashboard
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <Card.Root>
          <CardBody>
            <Heading as="h2" size="lg" mb={4}>
              Networks
            </Heading>
            <List.Root >
              {networks.map(network => (
                <ListItem
                  key={network.id}
                  onClick={() => handleNetworkSelect(network.id)}
                  cursor="pointer"
                  _hover={{ transform: 'scale(1.02)' }}
                  transition="transform 0.2s"
                >
                  <Card.Root variant="outline" p={4}>
                    <Stack direction="row" justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="bold">{network.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          ID: {network.id}
                        </Text>
                      </Box>
                      <Badge colorScheme="blue" fontSize="md">
                        {network.sensorsCount} sensors
                      </Badge>
                    </Stack>
                  </Card.Root>
                </ListItem>
              ))}
            </List.Root>
          </CardBody>
        </Card.Root>

        <Card.Root variant="outline">
          <CardBody>
            <Heading as="h2" size="lg" mb={4}>
              Sensors
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }}>
              {sensors.map(sensor => (
                <Card.Root key={sensor.id} p={4}>
                  <Stack>
                    <Text fontSize="lg" fontWeight="bold">{sensor.name}</Text>
                    <Badge 
                      alignSelf="start"
                      background={sensor.isActive ? 'green' : 'red'}
                    >
                      {sensor.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Text fontSize="sm">
                      📍 {sensor.location}
                      <Text as="span" color="gray.500" ml={2}>
                        ({sensor.region})
                      </Text>
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Coordinates: {sensor.coordinates.lat}, {sensor.coordinates.lng}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Last updated: {new Date(sensor.lastUpdated).toLocaleDateString()}
                    </Text>
                    <Button 
                      onClick={() => handleSensorSelect(sensor.networkId, sensor.sensorId)}
                      colorScheme="teal"
                      size="sm"
                    >Выбрать датчик</Button>
                  </Stack>
                </Card.Root>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card.Root>
      </SimpleGrid>
    </Box>
  );
};

export default DashboardPage;
