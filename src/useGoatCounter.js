import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useGoatCounter = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({
        path: location.pathname + location.search + location.hash,
      });
    }
  }, [location]);
};

export default useGoatCounter;
