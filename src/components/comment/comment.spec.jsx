import React from 'react';
import { render, screen } from '@testing-library/react';
import Comment from './index';

describe('Comment Component', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(<Comment />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render the opinion text correctly', () => {
    render(<Comment />);
    expect(
      screen.getByText(/Entrega rápida e funcionários simpáticos/),
    ).toBeInTheDocument();
    expect(screen.getByText(/O sorvete chegou frio e/)).toBeInTheDocument();
    expect(screen.getByText(/muito delicioso!/)).toBeInTheDocument();
  });

  it('should render the author name', () => {
    render(<Comment />);
    expect(screen.getByText(/Eva Oliveira/)).toBeInTheDocument();
  });

  it('should have the correct class names', () => {
    const { container } = render(<Comment />);
    const opinionElement = container.querySelector('.comment-block__opinion');
    const authorElement = container.querySelector(
      '.comment-block__opinion__author',
    );
    expect(opinionElement).toBeInTheDocument();
    expect(authorElement).toBeInTheDocument();
  });
});
