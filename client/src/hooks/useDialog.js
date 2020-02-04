import { useState } from 'react';

const useDialog = initState => {
  const [showDialog, setShowDialog] = useState(initState);

  const toggleDialog = () => {
    return setShowDialog(prevState => !prevState);
  };

  return { showDialog, toggleDialog };
};

export default useDialog;
