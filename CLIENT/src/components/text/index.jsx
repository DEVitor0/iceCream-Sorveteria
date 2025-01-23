import PropTypes from 'prop-types';
import './styles.scss';

const Text = ({ id, text, fontSize }) => {
  return (
    <p
      id={id}
      className={`paragraph ${id ? 'looking-main' : ''}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {text}
    </p>
  );
};

Text.defaultProps = {
  id: '',
};

Text.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
};

export default Text;
