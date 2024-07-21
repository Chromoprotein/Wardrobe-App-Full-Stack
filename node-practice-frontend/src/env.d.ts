declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_CLOTHING_URI: string;
    REACT_APP_SINGLE_ITEM_URI: string;
    REACT_APP_UPDATE_ITEM_URI: string;
    REACT_APP_ADD_URI: string;
    REACT_APP_DELETE_URI: string;

    REACT_APP_IMAGE_URI: string;
    REACT_APP_FETCH_IMAGE_BY_ID_URI: string;
    // Add other environment variables here
  }
}
