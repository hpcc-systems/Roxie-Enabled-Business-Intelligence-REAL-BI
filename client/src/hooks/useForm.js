import { useState, useCallback, useMemo } from 'react';

const useForm = initState => {
  const [values, setValues] = useState(initState);

  const initialFormFields = useMemo(() => initState, []);

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

  const handleCheckbox = useCallback(event => {
    const { name, checked } = event.target;
    const [state, key] = name.split(':');

    return setValues(prevState => ({
      ...prevState,
      [state]: { ...prevState[state], [key]: checked },
    }));
  }, []);

  const resetState = useCallback(state => setValues(state), []);

  const formFieldsUpdate = useCallback(
    params => {
      if (typeof params === 'function') {
        const result = params(initialFormFields);
        setValues(result);
      } else {
        setValues(preState => ({
          ...preState,
          ...params,
        }));
      }
    },

    [],
  );

  return {
    values,
    handleChange,
    handleChangeArr,
    handleChangeObj,
    handleCheckbox,
    resetState,
    formFieldsUpdate,
  };
};

export default useForm;
