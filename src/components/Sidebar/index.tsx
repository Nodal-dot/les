import {
  Box,
  HStack,
  Icon,
  Text,
  Flex,
  Stack,
  Button,
  Switch,
} from '@chakra-ui/react';
import {
  FiHome,
  FiMap,
  FiActivity,
  FiUsers,
  FiFileText,
  FiSettings,
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
        <Stack align="stretch">
          {navItems.map((item) => (
              <RouterLink key={item.path} to={item.path}>
                <Button
                    as="div"
                    variant="ghost"
                    justifyContent="flex-start"
                    w="full"
                    px={4}
                    py={3}
                    borderRadius="md"
                    bg={pathname === item.path ? (colorMode === 'light' ? 'gray.100' : 'gray.400') : 'transparent'}
                    _hover={{
                      textDecoration: 'none',
                      bg: colorMode === 'light' ? 'gray.50' : 'gray.200',
                    }}
                    transition="all 0.2s"
                    pointerEvents="auto"
                >
                  <HStack >
                    <Icon as={item.icon as React.ElementType} boxSize={5} />
                    <Text fontSize="md" fontWeight="medium">
                      {item.label}
                    </Text>
                  </HStack>
                </Button>
              </RouterLink>
          ))}
        </Stack>

        <Box mt={6} px={4} py={3}>
          <Flex align="center" justify="space-between">
            <HStack >
              <Text fontSize="md" fontWeight="medium" userSelect="none">
                {colorMode === 'light' ? 'Светлая' : 'Темная'} тема
              </Text>
            </HStack>
            <Switch.Root
                checked={colorMode === 'dark'}
                onCheckedChange={toggleColorMode}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label />
            </Switch.Root>
          </Flex>
        </Box>
      </Box>
  );
};

export default Sidebar;

