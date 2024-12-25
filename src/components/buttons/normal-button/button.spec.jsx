import React from 'react';
import { render, screen } from '@testing-library/react';
import NormalButton from './index';
import PropTypes from 'prop-types';

test('renders button and displays children correctly', () => {
  const { asFragment } = render(<NormalButton>Click Me</NormalButton>);

  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

test('renders button with children component (Anchor) correctly', () => {
  const AnchorLink = ({ href, text }) => <a href={href}>{text}</a>;

  AnchorLink.propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  };

  const { asFragment } = render(
    <NormalButton>
      <AnchorLink href="https://test.com.br" text="Go to Example" />
    </NormalButton>,
  );

  const linkElement = screen.getByText(/Go to Example/i);
  expect(linkElement).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});

test('button has correct class for styling', () => {
  const { asFragment } = render(<NormalButton>Click Me</NormalButton>);

  const buttonElement = screen.getByText(/Click Me/i).closest('button');
  expect(buttonElement).toHaveClass('normal-button');

  expect(asFragment()).toMatchSnapshot();
});
