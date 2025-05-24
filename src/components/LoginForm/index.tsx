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
 Field , Switch } from '@chakra-ui/react';

import { PasswordInput } from '../ui/password-input';
import { toaster } from '../ui/toaster';

import { useColorMode } from '../ui/color-mode';

interface LoginFormState {
  username: string;
  password: string;
  errors: {
    username: string;
    password: string;
  };
}

const LoginForm: React.FC = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    username: '',
    password: '',
    errors: {
      username: '',
      password: ''
    }
  });

  const { login, loading, error } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

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

  const handleInputChange = (field: keyof Omit<LoginFormState, 'errors'>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState(prev => ({
        ...prev,
        [field]: e.target.value,
        errors: {
          ...prev.errors,
          [field]: '' 
        }
      }));
    };

  const validateForm = () => {
    const errors = {
      username: '',
      password: ''
    };
    let isValid = true;
    
    if (!formState.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!formState.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormState(prev => ({ ...prev, errors }));
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await login(formState.username, formState.password);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={'transparent'}>
      <Box 
        as="form" 
        onSubmit={handleSubmit}
        w="full"
        maxW="md"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        bg={colorMode === 'dark' ? 'gray.700' : 'white'}
        boxShadow="xl"
        position="relative"
      >
        <Stack alignItems={'center'}>
          <Heading as="h1" size="xl" textAlign="center" color={colorMode === 'dark' ? 'teal.300' : 'teal.500'}>
            Welcome back
          </Heading>
          
          <Field.Root invalid={!!formState.errors.username}>
            <Field.Label>
              Username
            </Field.Label>
            <Input
              type="text"
              value={formState.username}
              onChange={handleInputChange('username')}
              placeholder="Enter your username"
              bg={colorMode === 'dark' ? 'gray.600' : 'white'}
              borderColor={colorMode === 'dark' ? 'gray.500' : 'gray.200'}
              color={colorMode === 'dark' ? 'white' : 'gray.800'}
              _hover={{
                borderColor: colorMode === 'dark' ? 'gray.400' : 'gray.300'
              }}
              _focus={{
                borderColor: 'teal.500',
                boxShadow: `0 0 0 1px ${colorMode === 'dark' ? '#81E6D9' : '#319795'}`
              }}
            />
            <Field.ErrorText>{formState.errors.username}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!formState.errors.password}>
            <Field.Label>
              Password
            </Field.Label>
            <PasswordInput
              value={formState.password}
              onChange={handleInputChange('password')}
              placeholder="Enter your password"
              bg={colorMode === 'dark' ? 'gray.600' : 'white'}
              borderColor={colorMode === 'dark' ? 'gray.500' : 'gray.200'}
              color={colorMode === 'dark' ? 'white' : 'gray.800'}
              _hover={{
                borderColor: colorMode === 'dark' ? 'gray.400' : 'gray.300'
              }}
              _focus={{
                borderColor: 'teal.500',
                boxShadow: `0 0 0 1px ${colorMode === 'dark' ? '#81E6D9' : '#319795'}`
              }}
            />
            <Field.ErrorText>{formState.errors.password}</Field.ErrorText>
          </Field.Root>

          <Button 
            type="submit" 
            colorScheme="teal"
            loading={loading}
            loadingText="Signing in..."
            size="lg"
            width="full"
            mt={4}
            _hover={{
              bg: colorMode === 'dark' ? 'teal.500' : 'teal.600'
            }}
            _active={{
              bg: colorMode === 'dark' ? 'teal.600' : 'teal.700'
            }}
          >
            Sign In
          </Button>

          <Text 
            textAlign="center" 
            fontSize="sm" 
            color={colorMode === 'dark' ? 'whiteAlpha.700' : 'gray.600'} 
            mt={2}
          >
            Don't have an account?{' '}
            <Link 
              href="/register" 
              color={colorMode === 'dark' ? 'teal.300' : 'teal.500'} 
              fontWeight="medium"
              _hover={{
                color: colorMode === 'dark' ? 'teal.200' : 'teal.600'
              }}
            >
              Sign up
            </Link>
          </Text>

          <Flex justify="flex-end" align="center" mt={4}>
            <Text 
              mr={2} 
              fontSize="sm" 
              color={colorMode === 'dark' ? 'whiteAlpha.700' : 'gray.600'}
            >
              {colorMode === 'dark' ? 'Dark' : 'Light'} Mode
            </Text>
            <Switch.Root
              checked={colorMode === 'dark'}
              onCheckedChange={toggleColorMode}
            >
              <Switch.HiddenInput />
              <Switch.Control >
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
};

export default LoginForm;