import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex h="100vh" overflow="hidden">
      <Sidebar />
      <Flex direction="column" flex={1} overflow="auto">
        <TopBar />
        <Box p={6} flex={1} bg="gray.50" _dark={{ bg: 'gray.800' }}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;