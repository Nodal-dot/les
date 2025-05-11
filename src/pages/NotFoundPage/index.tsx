import { Box, VStack, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useColorMode } from "../../components/ui/color-mode";

const  NotFoundPage = () => {
  const navigate = useNavigate();
    const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <Box textAlign="center" py={10} px={6}>
      <VStack>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text"
        >
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Страница не найдена
        </Text>
        <Text color={'gray.500'} mb={6}>
          Похоже, что страницы, которую вы ищете, не существует
        </Text>

        <Button
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color={colorMode === 'dark' ? 'black' : 'white'} 
          variant="solid"
          onClick={() => navigate('/main_window')}
          _hover={{
            bgGradient: 'linear(to-r, teal.500, teal.600, teal.700)',
          }}
        >
          Вернуться на главную
        </Button>
      </VStack>
    </Box>
  );
};
export default NotFoundPage;