import { NavigateFunction } from "react-router-dom";

export function navigateWithTimeout(navigate: NavigateFunction, url = '/') {
    setTimeout(() => {
        navigate(url);
      }, 3000);
}