import { useState } from 'react';

const useStepper = initState => {
  const [step, setStep] = useState(initState);

  const nextStep = () => {
    return setStep(prevState => prevState + 1);
  };

  const prevStep = () => {
    return setStep(prevState => prevState - 1);
  };

  const resetStep = () => {
    return setStep(0);
  };

  return { step, nextStep, prevStep, resetStep };
};

export default useStepper;
