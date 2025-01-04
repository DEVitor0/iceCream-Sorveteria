import { render } from '@testing-library/react';
import OurServices from './index';
import ImageContext from '../../../contexts/ImagesContext/ImageContext';
import '@testing-library/jest-dom';

const mockImages = {
  easeToBuy: 'mocked-easeToBuy-image',
  delivery: 'mocked-delivery-image',
  quality: 'mocked-quality-image',
};

describe('OurServices Component', () => {
  test('should match the snapshot', () => {
    const { asFragment } = render(
      <ImageContext.Provider value={mockImages}>
        <OurServices />
      </ImageContext.Provider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
