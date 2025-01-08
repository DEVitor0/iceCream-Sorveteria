import { render, screen } from '@testing-library/react';
import Links from './index';

describe('Links Component', () => {
  it('renders without crashing', () => {
    render(<Links />);
  });

  it('renders the navigation element', () => {
    render(<Links />);
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
    expect(navElement).toHaveClass('header-bar__inner__menu');
  });

  it('renders the list with four items', () => {
    render(<Links />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  it('renders each Anchor component with correct text and href', () => {
    render(<Links />);
    const links = [
      { href: '#', text: 'Reservas' },
      { href: '#', text: 'Serviços' },
      { href: '#', text: 'Cardápio' },
      { href: '#', text: 'Depoimentos' },
    ];

    links.forEach((link) => {
      const anchorElement = screen.getByText(link.text);
      expect(anchorElement).toBeInTheDocument();
      expect(anchorElement.closest('a')).toHaveAttribute('href', link.href);
    });
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Links />);
    expect(asFragment()).toMatchSnapshot();
  });
});
