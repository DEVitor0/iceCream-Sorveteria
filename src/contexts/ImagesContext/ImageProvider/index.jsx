import PropTypes from 'prop-types';
import ImageContext from '../ImageContext/index';
import image from '../../../utils/imageManager/imageManager';

const ImageProvider = ({ children }) => {
  if (!children) {
    throw new Error('IconProvider requires a children');
  }

  return (
    <ImageContext.Provider value={image}>{children}</ImageContext.Provider>
  );
};

ImageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ImageProvider;
