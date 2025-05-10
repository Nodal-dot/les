/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './providers/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from './store';
import { defaultSystem, ChakraProvider  } from "@chakra-ui/react"

const container = document.getElementById('root');

const root = createRoot(container);
root.render(

    <React.StrictMode>
        <Provider store={store}>
            <ChakraProvider value={defaultSystem}>
                <App />
            </ChakraProvider>
            
        </Provider>

    </React.StrictMode>
);1