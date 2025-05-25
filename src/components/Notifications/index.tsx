import React, { useEffect } from 'react';
import {
  Button,
  Menu,
  Portal,
  Badge,
  Box,
  Text,
  Flex,
  Tag,
  ButtonGroup, 
  CloseButton
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { loadNotifications, markAsRead, changeNotificationStatus } from '../../store/notificationsSlice';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../store';

const Notifications = () => {
  const dispatch = useAppDispatch();
  const { notifications, loading, error } = useAppSelector(state => state.notifications);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      dispatch(loadNotifications());
    }
  }, [dispatch, user]);

  const handleAction = (notificationId: string, actionType: string) => {
    const status =
      actionType === 'approve' ? 'одобрено' : 
      actionType === 'reject' ? 'отклонено' : 
      'подтверждено';

    dispatch(changeNotificationStatus({ id: notificationId, status }));
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const renderSender = (sender) => (
    <Flex align="center">
            <Text fontSize="sm" ml={2}>
                {(() => {
                  if (sender?.username && sender?.role) {
                    return `${sender.username} (${sender.role})`;
                  }
                  if (sender?.username) {
                    return sender.username;
                  }
                  if (sender?.role) {
                    return `(${sender.role})`;
                  }
                  return sender || "";
                })()}
      </Text>
    </Flex>
  );

  const renderRecipient = (recipient) => (
    <Text fontSize="xs" color="gray.500">
      Для: {recipient.username || `все ${recipient.role}`}
    </Text>
  );

  const renderTag = (status) => {
    const colorScheme =
      status === 'pending' ? 'yellow' : status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'gray';

    return (
      <Tag.Root colorScheme={colorScheme} size="sm" textTransform="capitalize">
        {status}
      </Tag.Root>
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="outline" size="sm">
          {
            // @ts-ignore
            <FaBell />
          }
          
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              position="absolute"
              top="1"
              right="1"
              fontSize="xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Box p={3} borderBottomWidth="1px">
              <Flex justify="space-between" gap={'1.2rem'} align="center">
                <Text fontWeight="bold" fontSize="lg">
                  Уведомления
                </Text>
                <Text fontSize="sm" color="blue.500">
                  {unreadCount} непрочитанных
                </Text>
              </Flex>
            </Box>

            {loading ? (
              <Menu.Item>
                <Text py={2} color="gray.500" textAlign="center" w="100%">
                  Загрузка...
                </Text>
              </Menu.Item>
            ) : error ? (
              <Menu.Item>
                <Text py={2} color="red.500" textAlign="center" w="100%">
                  Ошибка: {error}
                </Text>
              </Menu.Item>
            ) : notifications.length === 0 ? (
              <Menu.Item>
                <Text py={2} color="gray.500" textAlign="center" w="100%">
                  Нет новых уведомлений
                </Text>
              </Menu.Item>
            ) : (
              notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <Menu.Item>
                    <Flex direction="column" width="100%">
                      <Flex justify="space-between" mb={2} align="center">
                        {notification.sender && renderSender(notification.sender)}
                        <Flex align="center">
                          {renderTag(notification.status)}
                          {!notification.read && (
                            <CloseButton 
                              size="sm" 
                              ml={2}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              aria-label="Mark as read"
                            />
                          )}
                        </Flex>
                      </Flex>

                      {renderRecipient(notification.recipient)}

                      <Text fontSize="md" my={2}>
                        {notification.message}
                      </Text>

                      {notification.sensor && (
                        <Text fontSize="sm" color="blue.500">
                          Датчик: {notification.sensor.sensorId} ({notification.sensor.networkId})
                        </Text>
                      )}

                      {notification.status === 'pending' && user?.role === 'admin' && (
                        <ButtonGroup size="sm" mt={3}>
                          <Button
                            onClick={e => {
                              e.stopPropagation();
                              handleAction(notification.id, 'approve');
                            }}
                            colorScheme="green"
                            variant="outline"
                          >
                            Одобрить
                          </Button>
                          <Button
                            onClick={e => {
                              e.stopPropagation();
                              handleAction(notification.id, 'reject');
                            }}
                            colorScheme="red"
                            variant="outline"
                          >
                            Отклонить
                          </Button>
                        </ButtonGroup>
                      )}
                      {
                        notification.timestamp && <Text fontSize="xs" color="gray.500" mt={2}>
                        {new Date(notification.timestamp).toLocaleString()}
                        
                      </Text>
                      }
                      
                    </Flex>
                  </Menu.Item>
                  {index < notifications.length - 1 && <Menu.Separator />}
                </React.Fragment>
              ))
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default Notifications;
