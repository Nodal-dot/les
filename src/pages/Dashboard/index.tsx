import { Box, Heading, SimpleGrid,Stat } from '@chakra-ui/react';

const DashboardPage = () => {
  return (
    <Box>
      <Heading mb={6}>Главный экран</Heading>
      
      <SimpleGrid columns={3} mb={8}>
        <Stat.Root p={4} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat.Label>Температура</Stat.Label>
          <Stat.ValueText>24.5°C</Stat.ValueText>
        </Stat.Root>
        
        <Stat.Root p={4} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat.Label>Влажность</Stat.Label>
          <Stat.ValueText>65%</Stat.ValueText>
        </Stat.Root>
        
        <Stat.Root p={4} bg="white" borderRadius="lg" boxShadow="sm">
          <Stat.Label>Давление</Stat.Label>
          <Stat.ValueText>1013 hPa</Stat.ValueText>
        </Stat.Root>
      </SimpleGrid>
    </Box>
  );
};

export default DashboardPage;