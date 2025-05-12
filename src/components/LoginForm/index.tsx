import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Box,
  Button,
  Input,
  Stack,
  Heading,
  Text,
  Link,
  Flex,
} from '@chakra-ui/react';
import { PasswordInput } from '../ui/password-input';
import { toaster } from '../ui/toaster';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  useEffect(() => {
    if (error) {
      toaster.create({
        title: 'Login failed',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box 
        as="form" 
        onSubmit={handleSubmit}
        w="full"
        maxW="md"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        bg="white"
        boxShadow="xl"
      >
        <Stack>
          <Heading as="h1" size="xl" textAlign="center" color="teal.500">
            Welcome back
          </Heading>
          
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <Button 
            type="submit" 
            colorScheme="teal"
            loading={loading}
            loadingText="Signing in..."
            size="lg"
            width="full"
          >
            Sign In
          </Button>

          <Text textAlign="center" fontSize="sm" color="gray.600">
            Don't have an account?{' '}
            <Link href="/register" color="teal.500" fontWeight="medium">
              Sign up
            </Link>
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
};

export default LoginForm;