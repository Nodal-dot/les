// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { clearNotification } from '../../store/notificationSlice';
// import { RootState } from '../../store/types';
// import { toaster } from '../ui/toaster';

// const NotificationManager = () => {

//   const dispatch = useDispatch();
//   const { notification } = useSelector((state: RootState) => state.notification);

//   useEffect(() => {
//     if (notification) {
//       toaster.create({
//         title: notification.title,
//         description: notification.message,
//         status: notification.type,
//         duration: 5000,
//         isClosable: true,
//         position: 'top-right',
//       });
//       dispatch(clearNotification());
//     }
//   }, [notification, dispatch]);

//   return null;
// };

// export default NotificationManager;