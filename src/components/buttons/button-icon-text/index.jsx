import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';

const ButtonIconText = ({ text, icon }) => {
  return (
    <div className="btn-container">
      <div className="btn-container__text">
        <p>{text}</p>
      </div>
      <div className="btn-container__icon">
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  );
};

ButtonIconText.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export default ButtonIconText;
