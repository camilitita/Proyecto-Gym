import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Importa los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Importa los estilos de SB Admin 2 (ajusta la ruta si es diferente)
import './assets/sbadmin2/css/sb-admin-2.min.css';
// Si quieres Font Awesome para los iconos (asegúrate de que esté en tu carpeta assets/sbadmin2/vendor)
import './assets/sbadmin2/vendor/fontawesome-free/css/all.min.css';

// Importa el JS de Bootstrap (para componentes interactivos como dropdowns, modales)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// El JS de SB Admin 2 no se importa directamente aquí.
// Contiene lógica de jQuery para la barra lateral, que adaptaremos a React.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);