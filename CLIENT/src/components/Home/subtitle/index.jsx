import PropTypes from 'prop-types';
import './styles.scss';

const Subtitle = ({ id, text }) => {
  return (
    <h2 id={id} className={`subtitle ${id ? 'looking-services' : ''}`}>
      {text}
    </h2>
  );
};

Subtitle.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default Subtitle;
