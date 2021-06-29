import { useState, useEffect } from 'react';

const useTooltipHover = ref => {
  // Define state and function to update the value
  const [hoverStatus, setHoverStatus] = useState(false);
  useEffect(() => {
    const compare = ref.current.scrollWidth > ref.current.clientWidth;
    setHoverStatus(!compare);
  }, []);

  return hoverStatus;
};

export default useTooltipHover;
