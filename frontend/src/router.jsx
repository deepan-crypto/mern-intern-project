import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import AddPlant from './pages/AddPlant';
import Register from './pages/Register';
import Login from './pages/Login';
import EditPlant from './pages/EditPlant';
import Activities from './pages/Activity';

// define routes - make sure all routes are properly configured
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div className="container fade-in"><h2>Error</h2><p>Page not found</p></div>,
    children: [
      { 
        index: true, 
        element: <Dashboard /> 
      },
      { 
        path: 'product/:id', 
        element: <Product /> 
      },
      { 
        path: 'edit/:id', 
        element: <EditPlant /> 
      },
      { 
        path: 'add', 
        element: <AddPlant /> 
      },
      { 
        path: 'register', 
        element: <Register /> 
      },
      { 
        path: 'login', 
        element: <Login /> 
      },
      { 
        path: 'activities', 
        element: <Activities /> 
      }
    ]
  }
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
