import React, { useEffect } from 'react';
import { usePaginationContext } from '../contexts/PaginationContext';
import { useFilterContext } from "../contexts/FilterContext";
import { ClothingProp } from './interfaces/interfaces';
import ClothingCard from './ClothingCard';
import MainMenu from './MainMenu';
import PaginationControls from './PaginationControls';
import Message from './Message';
import '../styles/App.css';
import Spinner from './Spinner';
import Landing from './Landing';
import { useAuth } from '../contexts/authContext';
import useWardrobe from '../utils/useWardrobe';

function App() {

  const { loadingClothes, message, setMessage, clothes, getClothes } = useWardrobe();

  useEffect(() => {
      getClothes();
  }, [getClothes]);

  // filteredClothes = function that applies filters on the clothes array
  const { filteredClothes } = useFilterContext();

  // currentItems = function that slices the clothes/outfits array for pagination purposes
  const { currentItems } = usePaginationContext();

  const { isAuthenticated, loading, setIsAuthenticated } = useAuth();

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

      <MainMenu />

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
