import { useContext } from 'react';
import ImageContext from '../../../../contexts/ImagesContext/ImageContext/index';
import './style.scss';

const Brand = () => {
  const brandImage = useContext(ImageContext);
  return (
    <img
      src={brandImage.brand}
      alt="brand"
      className="header-bar__inner__image"
    />
  );
};

export default Brand;
