import PropTypes from 'prop-types';
import './styles.scss';

const TitleServices = ({ id, text }) => {
  return (
    <h3 id={id} className={`title-services ${id ? 'looking-services' : ''}`}>
      {text}
    </h3>
  );
};

TitleServices.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default TitleServices;
