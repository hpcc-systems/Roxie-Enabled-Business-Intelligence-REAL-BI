import { useState } from 'react';

const useShare = initState => {
  const [anchorEl, setAnchorEl] = useState(initState);

  const showMenu = ({ currentTarget }) => {
    return setAnchorEl(currentTarget);
  };

  const hideMenu = () => {
    return setAnchorEl(null);
  };

  return { menuAnchor: anchorEl, showMenu, hideMenu };
};

export default useShare;
