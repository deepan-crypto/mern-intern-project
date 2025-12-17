import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import AddPlant from './pages/AddPlant';
import Register from './pages/Register';

// define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'product/:id', element: <Product /> },
      { path: 'add', element: <AddPlant /> },
      { path: 'register', element: <Register /> }
    ]
  }
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
