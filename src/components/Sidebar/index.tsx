import {
  Box,
  VStack,
  HStack,
  Icon,
  Text,
  Switch,
  Flex,
} from '@chakra-ui/react';
import {
  FiHome,
  FiMap,
  FiActivity,
  FiUsers,
  FiFileText,
  FiSettings,
  FiMoon,
  FiSun,
} from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useColorMode } from '../ui/color-mode';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  const navItems = [
    { icon: FiHome, path: '/', label: 'Dashboard' },
    { icon: FiMap, path: '/map', label: 'Карта' },
    { icon: FiActivity, path: '/sensors', label: 'Датчики' },
    { icon: FiUsers, path: '/users', label: 'Пользователи' },
    { icon: FiFileText, path: '/reports', label: 'Отчеты' },
    { icon: FiSettings, path: '/account', label: 'Аккаунт' },
  ];

  return (
    <Box
      w="64"
      h="full"
      borderRight="1px"
      borderColor="gray.200"
      _dark={{ borderColor: "gray.700" }}
      px={4}
      py={6}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <VStack align="stretch" spacing="1">
        {navItems.map((item) => (
          <Box
            key={item.path}
            as={RouterLink}
            to={item.path}
            display="block"
            px={4}
            py={3}
            borderRadius="md"
            bg={pathname === item.path ? (colorMode === 'light' ? 'gray.100' : 'gray.400') : 'transparent'}
            _hover={{
              textDecoration: 'none',
              bg: colorMode === 'light' ? 'gray.50' : 'gray.200',
            }}
            transition="all 0.2s"
          >
            <HStack spacing="4">
              <Icon as={item.icon as React.ElementType} boxSize={5} />
              <Text fontSize="md" fontWeight="medium">
                {item.label}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Theme toggle */}
      <Box mt={6} px={4} py={3}>
        <Flex align="center" justify="space-between">
          <HStack spacing="4">
            <Icon as={colorMode === 'light' ? FiSun : FiMoon} boxSize={5} />
            <Text fontSize="md" fontWeight="medium">
              {colorMode === 'light' ? 'Светлая' : 'Темная'} тема
            </Text>
          </HStack>
          <Switch.Root
            isChecked={colorMode === 'dark'}
            onChange={toggleColorMode}
            colorScheme="teal"
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;