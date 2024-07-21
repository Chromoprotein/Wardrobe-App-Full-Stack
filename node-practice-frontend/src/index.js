import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  Navigate,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements
} from "react-router-dom";
import Register from './Register';
import Login from './Login';
import App from './App';
import Logout from './Logout';
import { useAuth, AuthProvider } from './authContext';
import { ClothingContextProvider } from './contexts/ClothingContext';
import { FilterContextProvider } from './contexts/FilterContext';
import { PaginationContextProvider } from './contexts/PaginationContext';
import { OutfitContextProvider } from './contexts/OutfitsContext';
import ClothingFormLogic from './components/ClothingFormLogic';
import ClothingEditLogic from './components/ClothingEditLogic';
import FileUpload from './components/ImageUpload';
import ImageFetch from './components/ImageFetchTest';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">        
      <Route index element={<App />} />
      <Route path="register" element={<Register />} />
      <Route path="edit/:id" element={<ClothingEditLogic/>} />
      <Route path="submit" element={<ClothingFormLogic/>} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="uploadImage/:id" element={<FileUpload />} />
      <Route path="imageFetch/:id" element={<ImageFetch />} />
      <Route path="*" element={<h1>Page not found</h1>} />
    </Route>
  )
);

// A version of authentication that has loading and navigation
// For protecting routes
function RequireAuth({ children, redirectTo }) {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    console.log("loading in the route check")
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ClothingContextProvider>
        <PaginationContextProvider>
          <FilterContextProvider>
            <OutfitContextProvider>
              <RouterProvider router={router} />
            </OutfitContextProvider>
          </FilterContextProvider>
        </PaginationContextProvider>
        </ClothingContextProvider>
    </AuthProvider>
  </React.StrictMode>
);