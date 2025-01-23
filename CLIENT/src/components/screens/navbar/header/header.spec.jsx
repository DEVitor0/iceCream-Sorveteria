import React from 'react';
import { render } from '@testing-library/react';
import HeaderBar from './index';

jest.mock('../brand/index', () => {
  const MockBrand = () => <div data-testid="brand">Brand</div>;
  MockBrand.displayName = 'MockBrand';
  return MockBrand;
});

jest.mock('../links/index', () => {
  const MockLinks = () => <div data-testid="links">Links</div>;
  MockLinks.displayName = 'MockLinks';
  return MockLinks;
});

jest.mock('../../buttons/button-icon-text/index', () => {
  const PropTypes = require('prop-types');
  const MockButtonIconText = ({ text, icon }) => (
    <button data-testid="button-icon-text">
      <i className={icon}></i>
      {text}
    </button>
  );

  MockButtonIconText.propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
  };

  MockButtonIconText.displayName = 'MockButtonIconText';
  return MockButtonIconText;
});

jest.mock('../../../styles/icons/fontawesome', () => ({
  bagShopping: 'fa-bag-shopping',
}));

describe('HeaderBar Component', () => {
  it('should render correctly and match the snapshot', () => {
    const { container } = render(<HeaderBar />);
    expect(container).toMatchSnapshot();
  });

  it('should render all subcomponents', () => {
    const { getByTestId } = render(<HeaderBar />);

    expect(getByTestId('brand')).toBeInTheDocument();
    expect(getByTestId('links')).toBeInTheDocument();
    expect(getByTestId('button-icon-text')).toBeInTheDocument();
  });
});
