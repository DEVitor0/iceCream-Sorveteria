import PropTypes from 'prop-types';
import Styles from './brandDashboard.module.scss';

const Brand = ({ image, alt }) => {
  return <img src={image} alt={alt} className={Styles.brandDashboard} />;
};

Brand.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default Brand;
