import { useNavigate } from "react-router-dom";
import { usePaginationContext } from "contexts/PaginationContext";

export default function useReturn() {
    const navigate = useNavigate();
    const { setCurrentPage } = usePaginationContext();

    return () => { 
        setTimeout(() => {
            setCurrentPage(1)
            navigate('/');
        }, 3000);
    }
}