import { render } from '@testing-library/react';
import KindOfServices from './index';
import '@testing-library/jest-dom';

describe('KindOfServices Component', () => {
  const mockProps = {
    title: 'Fácil de pedir',
    description: 'Peça sua sobremesa em segundos, sem complicação.',
    image: 'mocked-image.jpg',
  };

  test('should match the snapshot', () => {
    const { asFragment } = render(<KindOfServices {...mockProps} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
