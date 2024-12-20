import './style.scss';
import PropTypes from 'prop-types';

const Anchor = ({ href, text }) => {
  return (
    <a href={href} className={'anchor-style'}>
      {text}
    </a>
  );
};

Anchor.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Anchor;
