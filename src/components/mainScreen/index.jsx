import Title from './title/index';
import Text from '../text/index';
import NormalButton from '../buttons/normal-button/index';
import ButtonIconText from '../buttons/button-icon-text/index';
import ButtonIcon from '../buttons/button-icon/index';
import Comment from '../comment/index';

import './styles.scss';

import { useContext } from 'react';
import IconContext from '../../contexts/IconsContext/IconContext/index';

const MainScreen = () => {
  const icons = useContext(IconContext);

  return (
    <section className="main-screen">
      <div className="main-screen__container">
        <div className="main-screen__container__texts">
          <Title />
          <div className="main-screen__container__texts__text">
            <Text
              text="Aproveite nosso cardápio! Escolha o que desejar e receba em sua casa de forma rápida e segura"
              fontSize="20"
            />
          </div>
          <div className="main-screen__container__texts__buttons">
            <NormalButton>Ver cardápio</NormalButton>
            <ButtonIconText
              text="(11) 9 9876-5432"
              icon={icons.phone}
              href="tel:+5511998765432"
            />
          </div>
          <div className="main-screen__container__texts__social">
            <ButtonIcon icon={icons.instagram} />
            <ButtonIcon icon={icons.tiktok} />
            <ButtonIcon icon={icons.whatsapp} />
          </div>
        </div>
        <div className="main-screen__container__visual">
          <div className="main-screen__container__visual__block"></div>
          <div className="main-screen__container__visual__image"></div>
          <Comment />
        </div>
      </div>
    </section>
  );
};

export default MainScreen;
