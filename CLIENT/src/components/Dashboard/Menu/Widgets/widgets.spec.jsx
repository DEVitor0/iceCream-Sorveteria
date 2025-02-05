import { render, screen } from '@testing-library/react';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import Widgets from './Widgets';

describe('Widgets Component', () => {
  test('renders the component with icon and text', () => {
    const text = 'Sample Text';
    render(<Widgets icon={faCoffee} text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();

    const icons = screen.getAllByTestId('svg-inline--fa');
    expect(icons).toHaveLength(2);
  });
});
