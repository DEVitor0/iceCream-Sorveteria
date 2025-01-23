import PropTypes from 'prop-types';
import Text from '../../../text/index';
import './styles.scss';

const KindOfServices = ({ title, description, image }) => {
  return (
    <div className="kindOfServices-container">
      <div className="kindOfServices-container__image">
        <img
          src={image}
          className="kindOfServices-container__image__element"
          alt="image__iceCream"
        />
      </div>
      <div className="kindOfServices-container__subheading">
        <h4 className="kindOfServices-container__subheading__element">
          {title}
        </h4>
      </div>
      <div className="kindOfServices-container__description">
        <Text text={description} fontSize={20} />
      </div>
    </div>
  );
};

KindOfServices.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default KindOfServices;
