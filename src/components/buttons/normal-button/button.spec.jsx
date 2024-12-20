import React from 'react';
import { render, screen } from '@testing-library/react';
import NormalButton from './index';
import PropTypes from 'prop-types';

test('renders button and displays children correctly', () => {
  render(<NormalButton>Click Me</NormalButton>);

  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders button with children component (Anchor) correctly', () => {
  const AnchorLink = ({ href, text }) => <a href={href}>{text}</a>;

  AnchorLink.propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  };

  render(
    <NormalButton>
      <AnchorLink href="https://test.com.br" text="Go to Example" />
    </NormalButton>,
  );

  const linkElement = screen.getByText(/Go to Example/i);
  expect(linkElement).toBeInTheDocument();
});

test('button has correct class for styling', () => {
  render(<NormalButton>Click Me</NormalButton>);

  const buttonElement = screen.getByText(/Click Me/i).closest('button');
  expect(buttonElement).toHaveClass('normal-button');
});
