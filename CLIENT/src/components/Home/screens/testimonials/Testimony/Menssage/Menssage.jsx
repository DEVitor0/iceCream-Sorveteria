import Styles from './menssage.module.scss';

const Menssage = ({ text }) => {
  return <p className={Styles.menssage}>{text}</p>;
};

export default Menssage;
