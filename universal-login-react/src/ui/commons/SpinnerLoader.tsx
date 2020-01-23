import React from 'react';
import SpinnerIcon from '../assets/icons/spinner.svg';
import '../styles/spinnerLoader.sass';

interface SpinnerProps {
  className?: string;
  dotClassName?: string;
}

export const SpinnerLoader = ({className, dotClassName}: SpinnerProps) => {
  const spinnerClassName = className ? `spinner ${className}` : 'spinner';
  const spinnerDotClassName = dotClassName ? `spinner-dot ${dotClassName}` : 'spinner-dot';

  return (
    <img src={SpinnerIcon} alt="Spinner loader icon"/>
  );
};

export default SpinnerLoader;