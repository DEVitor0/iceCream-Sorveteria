import PropTypes from 'prop-types';

const Subtitle = ({ text }) => {
  return <h2 className="subtitle">{text}</h2>;
};

Subtitle.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Subtitle;
