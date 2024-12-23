import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import IconButton from './index';

describe('IconButton Component', () => {
  it('renders the FontAwesomeIcon with the provided icon', () => {
    const { container } = render(<IconButton icon={faCoffee} />);
    expect(container.querySelector('.container-icon')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<IconButton icon={faCoffee} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
