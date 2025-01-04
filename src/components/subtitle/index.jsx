import PropTypes from 'prop-types';
import './styles.scss';

const Subtitle = ({ text }) => {
  return <h2 className="subtitle">{text}</h2>;
};

Subtitle.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Subtitle;
