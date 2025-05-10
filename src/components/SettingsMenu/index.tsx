// import {
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   IconButton,
//   useColorMode,
// } from '@chakra-ui/react';
// import { FiSettings } from 'react-icons/fi';

// const SettingsMenu = () => {
//   const { colorMode, toggleColorMode } = useColorMode();

//   return (
//     <Menu>
//       <MenuButton
//         as={IconButton}
//         aria-label="Настройки"
//         icon={<FiSettings />}
//         variant="ghost"
//       />
//       <MenuList>
//         <MenuItem onClick={toggleColorMode}>
//           {colorMode === 'light' ? 'Темная тема' : 'Светлая тема'}
//         </MenuItem>
//         <MenuItem>Метрическая система</MenuItem>
//         <MenuItem>Имперская система</MenuItem>
//       </MenuList>
//     </Menu>
//   );
// };

// export default SettingsMenu;