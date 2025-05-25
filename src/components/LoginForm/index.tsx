import React, { useState } from 'react';
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
  Field,
  Switch
  
} from '@chakra-ui/react';
import { PasswordInput } from '../ui/password-input';
import { useColorMode } from '../ui/color-mode';
import { toaster } from '../ui/toaster';

interface AuthFormState {
  username: string;
  password: string;
  confirmPassword?: string;
  errors: {
    username: string;
    password: string;
    confirmPassword?: string;
  };
}

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formState, setFormState] = useState<AuthFormState>({
    username: '',
    password: '',
    ...(!isLogin && { confirmPassword: '' }),
    errors: {
      username: '',
      password: '',
      ...(!isLogin && { confirmPassword: '' })
    }
  });

  const { login, register, loading, error } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();


  const handleInputChange = (field: keyof Omit<AuthFormState, 'errors'>) => 
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
      password: '',
      ...(!isLogin && { confirmPassword: '' })
    };
    let isValid = true;
    
    if (!formState.username.trim()) {
      errors.username = 'Поле никнейм обязательно';
      isValid = false;
    }

    if (!formState.password) {
      errors.password = 'Поле пароля обязательно';
      isValid = false;
    } else if (formState.password.length < 6) {
      errors.password = 'Пароль должен состоять минимум из 6 символов';
      isValid = false;
    }

    if (!isLogin) {
      if (!formState.confirmPassword) {
        errors.confirmPassword = 'Пожалуйста повторите пароль';
        isValid = false;
      } else if (formState.password !== formState.confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
        isValid = false;
      }
    }

    setFormState(prev => ({ ...prev, errors }));
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
          try {
      if (isLogin) {
        await login(formState.username, formState.password);
      } else {
        await register(formState.username, formState.password);
      }
    } catch (error) {
            toaster.create({
        title: isLogin ? 'Ошибка входа' : 'Ошибка регистрации',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormState({
      username: '',
      password: '',
      ...(!isLogin ? {} : { confirmPassword: '' }),
      errors: {
        username: '',
        password: '',
        ...(!isLogin ? {} : { confirmPassword: '' })
      }
    });
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
            {isLogin ? 'Добро пожаловать' : 'Создайте аккаунт'}
          </Heading>
          
          <Field.Root invalid={!!formState.errors.username}>
            <Field.Label>
              Логин
            </Field.Label>
            <Input
              type="text"
              value={formState.username}
              onChange={handleInputChange('username')}
              placeholder="Введите свой логин"
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
              Пароль
            </Field.Label>
            <PasswordInput
              value={formState.password}
              onChange={handleInputChange('password')}
              placeholder={isLogin ? "Введите пароль" : "Создайте пароль (минимум 6 символов)"}
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

          {!isLogin && (
            <Field.Root invalid={!!formState.errors.confirmPassword}>
              <Field.Label>
                Confirm Password
              </Field.Label>
              <PasswordInput
                value={formState.confirmPassword || ''}
                onChange={handleInputChange('confirmPassword')}
                placeholder="Подтвердите свой пароль"
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
              <Field.ErrorText>{formState.errors.confirmPassword}</Field.ErrorText>
            </Field.Root>
          )}

          <Button 
            type="submit" 
            colorScheme="teal"
            loading={loading}
            loadingText={isLogin ? "Вход..." : "Регистрация..."}
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
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>

          <Button
            onClick={toggleAuthMode}
            mt={2}
                        _hover={{
              bg: colorMode === 'dark' ? 'teal.500' : 'teal.600'
            }}
            _active={{
              bg: colorMode === 'dark' ? 'teal.600' : 'teal.700'
            }}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти'}
          </Button>

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

export default AuthForm;