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

function App() {

  const [loading, setLoading] = useState(true);

  // clothes = original clothing array
  const { clothes, setClothes } = useClothingContext();

  // filteredClothes = function that applies filters on the clothes array
  const { filteredClothes } = useFilterContext();

  // currentItems = function that slices the clothes/outfits array for pagination purposes
  const { currentItems } = usePaginationContext();

  useEffect(() => {
    const getClothes = async () => {
      try {
        const clothingUri = process.env.REACT_APP_CLOTHING_URI;

        if (!clothingUri) {
          throw new Error("REACT_APP_CLOTHING_URI is not defined");
        }
        const res = await axios.get(clothingUri, { withCredentials: true
        });
        setClothes(res.data.clothes);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }
    getClothes();
    
  }, [setClothes])

  if (loading) return <p>Loading...</p>;

  if (!clothes) return <p>No clothes available</p>

  // Apply filters on clothes and map them
  const mapClothes: JSX.Element[] = filteredClothes(clothes)
    .map((piece: ClothingProp) => (
      <div key={piece.id}>
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
          <Message children="No clothes available. Add clothes or reduce filters."/>
        )}
      </div>

    </div>
  );
}

export default App;
