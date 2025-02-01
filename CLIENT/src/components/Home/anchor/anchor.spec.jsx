import React from 'react';
import { render, screen } from '@testing-library/react';
import Anchor from './index';

test('renders anchor with correct text and href', () => {
  const { asFragment } = render(
    <Anchor href="https://example.com" text="Go to Example" />,
  );

  const anchorElement = screen.getByText(/Go to Example/i);
  expect(anchorElement).toBeInTheDocument();

  const linkElement = screen.getByRole('link');
  expect(linkElement).toHaveAttribute('href', 'https://example.com');

  expect(asFragment()).toMatchSnapshot();
});

test('anchor has correct class for styling', () => {
  const { asFragment } = render(
    <Anchor href="https://example.com" text="Go to Example" />,
  );

  const linkElement = screen.getByRole('link');
  expect(linkElement).toHaveClass('anchor-style');

  expect(asFragment()).toMatchSnapshot();
});
