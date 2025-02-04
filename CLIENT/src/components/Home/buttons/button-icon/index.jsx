import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';

const IconButton = ({ icon }) => {
  return (
    <div className="container-icon">
      <FontAwesomeIcon icon={icon} />
    </div>
  );
};

IconButton.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

export default IconButton;
