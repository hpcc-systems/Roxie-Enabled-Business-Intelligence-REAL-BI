import { useState } from 'react';

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

  const resetState = state => {
    return setValues(state);
  };

  const setSingleValue = ({ name, value }) => {
    return setValues(prevState => ({ ...prevState, [name]: value }));
  };

  return { values, handleChange, handleChangeObj, resetState, setSingleValue };
};

export default useForm;
