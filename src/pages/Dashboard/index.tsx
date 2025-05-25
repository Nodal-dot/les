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
  Button,
  Flex
} from '@chakra-ui/react';
import { RootState } from '../../store';
import { fetchNetworks, fetchNetworkSensors } from '../../store/networksSlice';
import { useNavigate } from 'react-router-dom';
import { requestSensorAccess } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { toaster } from '../../components/ui/toaster';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleNetworkSelect = (networkId: string) => {
    dispatch(fetchNetworkSensors(networkId) as any);
  };

  const handleSensorSelect = (networkId: string, sensorId: string, hasAccess: boolean) => {
    if (hasAccess || currentUser.role === 'admin' || currentUser.role === 'moderator') {
      navigate(`/sensors/${networkId}/${sensorId}`);
    }
  };

  const handleRequestAccess = async (sensorId: string, networkId: string) => {
    try {
      await requestSensorAccess(
        currentUser.username,
        sensorId,
        networkId,
        company
      );
      
      toaster.create({
        title: 'Запрос отправлен',
        description: 'Ваш запрос на доступ к датчику был отправлен администратору компании.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось отправить запрос. Пожалуйста, попробуйте позже.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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

      <Flex flexDirection="column">
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
            <SimpleGrid columns={{ base: 1}}>
              {sensors.map(sensor => {
                const hasAccess = currentUser.role === 'admin' || 
                                 currentUser.role === 'moderator' || 
                                 sensor.accessUsers?.includes(currentUser.username);
                
                return (
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
                      
                      {hasAccess ? (
                        <Button 
                          onClick={() => handleSensorSelect(sensor.networkId, sensor.sensorId, true)}
                          colorScheme="teal"
                          size="sm"
                        >
                          Выбрать датчик
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleRequestAccess(sensor.sensorId, sensor.networkId)}
                          colorScheme="orange"
                          size="sm"
                        >
                          Запросить доступ
                        </Button>
                      )}
                    </Stack>
                  </Card.Root>
                );
              })}
            </SimpleGrid>
          </CardBody>
        </Card.Root>
      </Flex>
    </Box>
  );
};

export default DashboardPage;