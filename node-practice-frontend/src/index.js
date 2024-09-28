import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  Navigate,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements
} from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import App from './components/App';
import Logout from './components/Logout';
import { useAuth, AuthProvider } from './contexts/authContext';
import { ClothingContextProvider } from './contexts/ClothingContext';
import { FilterContextProvider } from './contexts/FilterContext';
import { PaginationContextProvider } from './contexts/PaginationContext';
import ClothingFormLogic from './components/ClothingFormLogic';
import ClothingEditLogic from './components/ClothingEditLogic';
import UploadImage from './components/uploadImage';
import Landing from './components/Landing';
import GenerateOutfits from './components/GenerateOutfits';
import SavedOutfits from './components/SavedOutfits';
import Error from './components/Error';
import Spinner from './components/Spinner';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">        
      <Route index element={<App />} />
      <Route path="register" element={<Register />} />
      <Route
        path="edit/:id"
        element={
          <RequireAuth redirectTo="/login">
            <ClothingEditLogic />
          </RequireAuth>
        }
      />
      <Route
        path="uploadImage/:id"
        element={
          <RequireAuth redirectTo="/login">
            <UploadImage/>
          </RequireAuth>
        }
      />
      <Route
        path="submit"
        element={
          <RequireAuth redirectTo="/login">
            <ClothingFormLogic />
          </RequireAuth>
        }
      />
      <Route
        path="generate"
        element={
          <RequireAuth redirectTo="/login">
            <GenerateOutfits />
          </RequireAuth>
        }
      />
      <Route
        path="outfits"
        element={
          <RequireAuth redirectTo="/login">
            <SavedOutfits />
          </RequireAuth>
        }
      />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="landing" element={<Landing />} />
      <Route path="*" element={<Error/>} />
    </Route>
  )
);

// A version of authentication that has loading and navigation
// For protecting routes
function RequireAuth({ children, redirectTo }) {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spinner />;
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
            <RouterProvider router={router} />
          </FilterContextProvider>
        </PaginationContextProvider>
        </ClothingContextProvider>
    </AuthProvider>
  </React.StrictMode>
);