import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useClothingContext } from "./contexts/ClothingContext";
import { usePaginationContext } from "./contexts/PaginationContext";
import { useFilterContext } from "./contexts/FilterContext";
import { ClothingProp } from 'components/interfaces/interfaces';
import ClothingCard from 'components/ClothingCard';
import { Link } from 'react-router-dom';
import MainMenu from 'components/MainMenu';
import ClothingFilters from 'components/ClothingFilters';
import PaginationControls from 'components/PaginationControls';
import Message from 'components/Message';
import logo from './img/logo.png';
import './styles/App.css';
import axiosInstance from './utils/axiosInstance';
import Button from 'components/Button';
import Spinner from 'components/Spinner';
import { CustomError } from 'components/interfaces/interfaces';
import Landing from 'components/Landing';
import { useAuth } from 'authContext';

function App() {

  const [loadingClothes, setLoadingClothes] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  // clothes = original clothing array
  const { clothes, setClothes } = useClothingContext();

  // filteredClothes = function that applies filters on the clothes array
  const { filteredClothes } = useFilterContext();

  // currentItems = function that slices the clothes/outfits array for pagination purposes
  const { currentItems } = usePaginationContext();

  const { isAuthenticated, loading, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const getClothes = async () => {
      try {
        const clothingUri = process.env.REACT_APP_CLOTHING_URI;

        if (!clothingUri) {
          throw new Error("API URI is not defined");
        }
        const res = await axiosInstance.get(clothingUri);
        setClothes(res.data.clothes);
        console.log(res.data.clothes)
      } catch (error) {
        const err = error as CustomError;
        setMessage("Error: " + err.response.data.message);
      } finally {
        setLoadingClothes(false); // Set loading to false after fetching data
      }
    }
    getClothes();
    
  }, [setClothes])

  if (loadingClothes || loading ) return <Spinner />;

  if (!isAuthenticated) return <Landing />

  if (!clothes) return <Message>No clothes available</Message>

  // Apply filters on clothes and map them
  const mapClothes: JSX.Element[] = filteredClothes(clothes)
    .map((piece: ClothingProp) => (
      <div key={piece._id}>
        <ClothingCard clothingProp={piece} />
      </div>
    )
  );

  // Pagination
  const paginatedItems: JSX.Element[] = currentItems(mapClothes);

  return (
    <div className="mainPageWrapper">

      <div className="navbarWrapper">
        <Link to="/"><img src={logo} className="logoImage idleStyle" alt="My Capsule Wardrobe"/></Link>
        {/*Navigation buttons for adding clothes and generating outfits*/}
        <MainMenu/>
        {/*Menu where you can choose filters for clothes*/}
        <ClothingFilters />
        <Link to={`/logout`}>
            <Button children="Log out" />
        </Link>
      </div>

      <div className="mainContentWrapper">
        {paginatedItems.length > 0 ? (
          <>
            {/*The currently displayed clothes*/}
            <div className="clothingCardContainer">
              {paginatedItems}
            </div>

            {/*Next, previous, and page number buttons. Takes an array of filtered clothes*/}
            <PaginationControls clothes={mapClothes} />
          </>
        ) : (
          <Message>No clothes available. Add clothes or reduce filters.</Message>
        )}
        {message && <Message>{message}</Message>}
      </div>

    </div>
  );
}

export default App;
