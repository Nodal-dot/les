import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Table,
  Button, 
  Spinner,
  Portal,
  Select,
  Text,
  createListCollection
} from '@chakra-ui/react';
import { fetchUsers, updateUserRole, deleteUser, requestCompanyAccess } from '../../api';
import { User } from '../../store/types';
import { useAuth } from '../../hooks/useAuth';
import { toaster } from '../../components/ui/toaster';

const roleCollection = createListCollection({
  items: [
    { label: "User", value: "user" },
    { label: "Moderator", value: "moderator" },
    { label: "Admin", value: "admin" },
  ],
});

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers(currentUser.company);
        setUsers(usersData);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [currentUser.company]);

  const handleUpdateRole = async (username: string, value: string) => {
    try {
      const role = value as 'user' | 'moderator' | 'admin';
      await updateUserRole(username, role);
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.username === username ? { ...u, role } : u
        )
      );
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDeleteUser = async (username: string) => {
    try {
      await deleteUser(username);
      setUsers(prevUsers => 
        prevUsers.filter(u => u.username !== username)
      );
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleRequestAccess = async (company: string, adminUsername: string) => {
    try {
      await requestCompanyAccess(currentUser.username, company, adminUsername);
      toaster.create({
        title: 'Request sent',
        description: `Your request to join ${company} has been sent to the admin.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toaster.create({
        title: 'Error',
        description: 'Failed to send request. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minH="200px"
        color="red.500"
        fontWeight="bold"
      >
        {error}
      </Box>
    );
  }

  // Group users by company when current user doesn't have a company
  if (!currentUser.company) {
    const companies = users.reduce((acc, user) => {
      if (user.company) {
        if (!acc[user.company]) {
          acc[user.company] = [];
        }
        acc[user.company].push(user);
      }
      return acc;
    }, {} as Record<string, User[]>);

    return (
      <Box p={6} maxW="1200px" mx="auto">
        <Heading as="h2" size="xl" mb={6}>
          Available Companies
        </Heading>
        
        {Object.entries(companies).map(([company, companyUsers]) => {
          const admin = companyUsers.find(u => u.role === 'admin');
          return (
            <Box key={company} mb={8}>
              <Heading as="h3" size="lg" mb={4}>
                {company}
                {admin && (
                  <Button 
                    ml={4}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleRequestAccess(company, admin.username)}
                  >
                    Request Access
                  </Button>
                )}
              </Heading>
              
              <Box overflowX="auto">
                <Table.Root colorScheme="gray">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Username</Table.ColumnHeader>
                      <Table.ColumnHeader>Role</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  
                  <Table.Body>
                    {companyUsers.map(user => (
                      <Table.Row key={user.username}>
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>{user.role}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading as="h2" size="xl" mb={6}>
        All Users
      </Heading>
      
      <Box overflowX="auto">
        <Table.Root colorScheme="gray">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Username</Table.ColumnHeader>
              <Table.ColumnHeader>Role</Table.ColumnHeader>
              <Table.ColumnHeader>Company</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {users.map(user => (
              <Table.Row key={user.username}>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>{user.company || '-'}</Table.Cell>
                <Table.Cell>
                  <Box display="flex" gap={2}>
                    <Select.Root 
                      collection={roleCollection} 
                      size="sm"
                      width="150px"
                      defaultValue={user.role}
                      onChange={({ value }) => handleUpdateRole(user.username, value)}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content>
                            {roleCollection.items.map((role) => (
                              <Select.Item item={role} key={role.value}>
                                {role.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                    <Button 
                      onClick={() => handleDeleteUser(user.username)}
                      colorScheme="red"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </Box>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};

export default UsersPage;