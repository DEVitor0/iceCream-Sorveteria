import PropTypes from 'prop-types';
import './styles.scss';

const TitleServices = ({ text }) => {
  return <h3 className="title-services">{text}</h3>;
};

TitleServices.propTypes = {
  text: PropTypes.string.isRequired,
};

export default TitleServices;
