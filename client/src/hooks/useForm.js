import { useState, useCallback } from 'react';

const useForm = initState => {
  const [values, setValues] = useState(initState);

  const handleChange = useCallback((event, obj) => {
    // Determine if this part of an event or manually passed
    const dataObj = event ? event.target : obj;

    // Destructure for data
    const { name, value } = dataObj;

    return setValues(prevState => ({ ...prevState, [name]: value }));
  }, []);

  const handleChangeObj = useCallback((event, obj) => {
    // Determine if this part of an event or manually passed
    const dataObj = event ? event.target : obj;

    // Destructure for data
    const { name, value } = dataObj;
    const [state, key] = name.split(':');

    return setValues(prevState => ({
      ...prevState,
      [state]: { ...prevState[state], [key]: value },
    }));
  }, []);

  const handleChangeArr = useCallback((name, arr) => {
    return setValues(prevState => ({ ...prevState, [name]: arr }));
  }, []);

  const resetState = useCallback(state => setValues(state), []);

  return { values, handleChange, handleChangeArr, handleChangeObj, resetState };
};

export default useForm;
