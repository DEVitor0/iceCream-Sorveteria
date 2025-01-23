import PropTypes from 'prop-types';
import './styles.scss';

const ItensNav = ({ icon, text, alt }) => {
  return (
    <div className="nav-product-element">
      <img src={icon} alt={alt} className="nav-product-element__image" />
      <p className="nav-product-element__text">{text}</p>
    </div>
  );
};

ItensNav.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  text: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default ItensNav;
