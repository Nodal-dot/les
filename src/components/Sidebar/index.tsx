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
  FiUsers,
  FiFileText,

} from 'react-icons/fi';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useColorMode } from '../ui/color-mode';
import { useAuth } from '../../hooks/useAuth';


const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { signOut, isAuthenticated } = useAuth();

  const navItems = [
    { icon: FiHome, path: '/main_window', label: 'Главная' },
    { icon: FiMap, path: '/map', label: 'Карта' },
    { icon: FiUsers, path: '/users', label: 'Пользователи' },
    { icon: FiFileText, path: '/reports', label: 'Отчеты' },
  ];

  const handleLogout = () => {
    signOut()
    navigate('/login'); 
  };

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
              color={colorMode === 'dark' ? 'white' : 'black'} 
              bg={
                pathname === item.path 
                  ? (colorMode === 'light' ? 'gray.200' : 'gray.600')
                  : 'transparent'
              }
              _hover={{
                bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.300', 
                color: colorMode === 'light' ? 'black' : 'white' 
              }}
              _active={{
                bg: colorMode === 'light' ? 'gray.200' : 'whiteAlpha.400' 
              }}
              transition="all 0.2s"
              pointerEvents="auto"
            >
              <HStack>
                <Icon as={item.icon as React.ElementType} boxSize={5} />
                <Text fontSize="md" fontWeight="medium">
                  {item.label}
                </Text>
              </HStack>
            </Button>
          </RouterLink>
        ))}
      </Stack>

      <Box>

    
        <Flex 
          align="center" 
          justify="space-between" 
          p={4} 
          borderRadius="md"
          bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        >
                    <HStack>
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
        
        {isAuthenticated && (
          <Button
            variant="ghost"
            justifyContent="flex-start"
            w="full"
            px={4}
            py={3}
            mt={4}
            borderRadius="md"
            color={colorMode === 'dark' ? 'white' : 'black'}
            _hover={{
              bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.300',
            }}
            onClick={handleLogout}
          >
            Выйти
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;