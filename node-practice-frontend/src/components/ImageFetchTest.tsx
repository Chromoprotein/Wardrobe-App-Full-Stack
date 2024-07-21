import React from "react";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";

interface Image {
  filename: string,
  contentType: string,
  imageBase64: string,
  userId: string,
  clothingId: string,
}

export default function ImageFetch() {

    const { id } = useParams();

    const [imgState, setImgState] = useState<Image | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getImageById = async () => {
      try {
        const imageUri = `${process.env.REACT_APP_FETCH_IMAGE_BY_ID_URI}/${id}`;

        if (!imageUri) {
          throw new Error("URI is not defined");
        }

        const res = await axios.get(imageUri, { 
            withCredentials: true
        });

        setImgState(res.data);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }

    }
    getImageById();
    
  }, [setImgState, id])
    
  if(loading) {
    return <p>Loading...</p>
  }

  if (!imgState || !imgState.contentType || !imgState.imageBase64) {
      return <div>Error: Invalid image data</div>;
  }

  return (
    <>
    Image testing page
    <img
      src={`data:${imgState.contentType};base64,${imgState.imageBase64}`}
      alt={imgState.filename}
      style={{ width: '100%' }}
    />
    </>
  );

}