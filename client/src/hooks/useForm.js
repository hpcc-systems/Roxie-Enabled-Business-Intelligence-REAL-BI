import { useState } from 'react';

const useForm = initState => {
  const [values, setValues] = useState(initState);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    return setValues(prevState => ({ ...prevState, [name]: value }));
  };

  const resetState = state => {
    return setValues(state);
  };

  return { values, handleChange, resetState };
};

export default useForm;
