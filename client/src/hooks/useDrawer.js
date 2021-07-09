import { useState } from 'react';

const useDrawer = initState => {
  const [showDrawer, setShowDrawer] = useState(initState);

  const toggleDrawer = () => {
    return setShowDrawer(prevState => !prevState);
  };

  return [showDrawer, toggleDrawer];
};

export default useDrawer;
