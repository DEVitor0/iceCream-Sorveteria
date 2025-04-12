import { useContext } from 'react';
import ImageContext from '../../../../../contexts/ImagesContext/ImageContext';
import Styles from './blockWithImage.module.scss';

const BlockWithImage = () => {
  const image = useContext(ImageContext);

  return (
    <div className={Styles.blockWithImage}>
      <div
        className={Styles.blockWithImage__image}
        style={{ backgroundImage: `url(${image.massTestimonials})` }}
      ></div>
    </div>
  );
};

export default BlockWithImage;
