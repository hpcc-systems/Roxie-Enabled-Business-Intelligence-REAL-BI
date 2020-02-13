import { useState, useCallback } from 'react';

const useForm = initState => {
  const [values, setValues] = useState(initState);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    return setValues(prevState => ({ ...prevState, [name]: value }));
  };

  const handleChangeObj = ({ target }) => {
    const { name, value } = target;
    const [state, key] = name.split(':');

    return setValues(prevState => ({
      ...prevState,
      [state]: { ...prevState[state], [key]: value },
    }));
  };

  const resetState = state => setValues(state);

  const updateState = useCallback(state => {
    return setValues(prevState => ({ ...prevState, ...state }));
  }, []);

  return { values, handleChange, handleChangeObj, updateState, resetState };
};

export default useForm;
