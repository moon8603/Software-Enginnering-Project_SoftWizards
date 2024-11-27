import { MantineProvider } from '@mantine/core';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '@mantine/core/styles.css';
import 'leaflet/dist/leaflet.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <App />
  </MantineProvider>
)
