import PropTypes from 'prop-types';
import './styles.scss';

const Title = ({ id }) => {
  return (
    <div id={id} className={id ? 'looking-main' : ''}>
      <h1 className="main-screen__container__texts__title">
        Escolha sua sobremesa
      </h1>
      <span className="main-screen__container__texts__emphasis">favorita.</span>
    </div>
  );
};

Title.defaultProps = {
  id: '',
};

Title.propTypes = {
  id: PropTypes.string,
};

export default Title;
