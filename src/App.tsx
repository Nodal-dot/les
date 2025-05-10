import { useSelector } from 'react-redux';
import { RootState } from './store/types';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { Toaster } from './components/ui/toaster';
import { Flex } from '@chakra-ui/react';
import Layout from './components/Layout';
import AppRoutes from './components/AppRoutes';


const App = () => {
    // const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const isAuthenticated = true
    return (
        <>
            <Toaster />
                <Router>
        {!isAuthenticated ? (
          <Flex minH="100vh" align="center" justify="center">
            <LoginForm />
          </Flex>
        ) : (
          <Layout>
            <AppRoutes />
          </Layout>
        )}
      </Router>
        </>
    );
}

export default App;