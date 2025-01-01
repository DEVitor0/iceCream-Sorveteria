import brandImage from '../../../../styles/images/navbar/brand.png';
import './style.scss';

const Brand = () => {
  return (
    <img src={brandImage} alt="brand" className="header-bar__inner__image" />
  );
};

export default Brand;
