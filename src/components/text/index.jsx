import PropTypes from 'prop-types';
import './styles.scss';

const Text = ({ text, fontSize }) => {
  return (
    <p className="paragraph" style={{ fontSize: `${fontSize}px` }}>
      {text}
    </p>
  );
};

Text.propTypes = {
  text: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
};

export default Text;
