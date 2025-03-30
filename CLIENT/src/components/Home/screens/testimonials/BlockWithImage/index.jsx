import Styles from './blockWithImage.module.scss';

const BlockWithImage = () => {
  return (
    <div className={Styles.blockWithImage}>
      <div className={Styles.blockWithImage__image}></div>
    </div>
  );
};
export default BlockWithImage;
