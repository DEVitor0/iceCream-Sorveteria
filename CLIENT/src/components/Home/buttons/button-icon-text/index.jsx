import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';

const ButtonIconText = ({ text, icon, href = false }) => {
  const containerStyle = href ? { flexDirection: 'row-reverse' } : {};
  const iconStyle = href ? { marginRight: 0, marginLeft: '10px' } : {};

  return (
    <div className="btn-container" style={containerStyle}>
      <div className="btn-container__text">
        <p>
          <a href={href ? href : ''}>{text}</a>
        </p>
      </div>
      <div className="btn-container__icon" style={iconStyle}>
        <FontAwesomeIcon icon={icon} data-testid="svg-inline--fa" />
      </div>
    </div>
  );
};

ButtonIconText.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  href: PropTypes.string,
};

export default ButtonIconText;
