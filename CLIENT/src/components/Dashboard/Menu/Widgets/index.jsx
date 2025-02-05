import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Styles from './widgets.module.scss';

const Widgets = ({ icon, menu = false, text }) => {
  return (
    <div className={Styles.widgetsDashboard}>
      <div className={Styles.iconText}>
        <div className={Styles.icon}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <span className={Styles.text}>{text}</span>
      </div>
      {menu && (
        <FontAwesomeIcon
          icon="fa-solid fa-chevron-left"
          className={Styles.menuIcon}
        />
      )}
    </div>
  );
};

Widgets.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  text: PropTypes.string.isRequired,
  menu: PropTypes.bool,
};

export default Widgets;
