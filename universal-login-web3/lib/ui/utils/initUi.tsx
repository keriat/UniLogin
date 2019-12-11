import React from 'react';
import {render} from 'react-dom';
import {Onboarding, OnboardingProps} from '../Onboarding';

export function initUi(props: OnboardingProps) {
  const reactRootElement = createReactRoot();
  render(<Onboarding {...props}/>, reactRootElement);
}

function createReactRoot() {
  const reactRoot = document.createElement('div');
  reactRoot.setAttribute('id', 'universal-login-modal-root');
  document.getElementsByTagName('body')[0].appendChild(reactRoot);
  return reactRoot;
}