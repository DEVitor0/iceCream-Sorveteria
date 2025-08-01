import Title from './title/index';
import Text from '../../text/index';
import NormalButton from '../../buttons/normal-button/index';
import ButtonIconText from '../../buttons/button-icon-text/index';
import ButtonIcon from '../../buttons/button-icon/index';
import Comment from '../../comment/index';

import './styles.scss';

import { useContext } from 'react';
import IconContext from '../../../../contexts/IconsContext/IconContext/index';
import ImageContext from '../../../../contexts/ImagesContext/ImageContext/index';
import ErrorBoundary from '../../../../errors/ErrorBoundryIcons/ErrorBoundryIcons';

const MainScreen = () => {
  const icons = useContext(IconContext);
  const images = useContext(ImageContext);

  return (
    <section className="main-screen">
      <div className="main-screen__container">
        <div className="main-screen__container__texts">
          <Title id="main-title" />
          <div className="main-screen__container__texts__text">
            <Text
              id="main-title"
              text="Aproveite nosso cardápio! Escolha o que desejar e receba em sua casa de forma rápida e segura"
              fontSize={20}
            />
          </div>
          <div
            id="main-buttons"
            className="main-screen__container__texts__buttons looking-main"
          >
            <NormalButton>Ver cardápio</NormalButton>
            <ErrorBoundary>
              <ButtonIconText
                text="(11) 9 9876-5432"
                icon={icons?.phone || null}
                href="tel:+5511998765432"
              />
            </ErrorBoundary>
          </div>
          <div
            id="main-button-icon"
            className="main-screen__container__texts__social looking-main"
          >
            <ErrorBoundary>
              <ButtonIcon icon={icons?.instagram || null} />
            </ErrorBoundary>
            <ErrorBoundary>
              <ButtonIcon icon={icons?.tiktok || null} />
            </ErrorBoundary>
            <ErrorBoundary>
              <ButtonIcon icon={icons?.whatsapp || null} />
            </ErrorBoundary>
          </div>
        </div>
        <div className="main-screen__container__visual">
          <div
            id="main-block"
            className="main-screen__container__visual__block looking-main"
          ></div>
          <div
            id="main-iceCream-image"
            className="main-screen__container__visual__image looking-main"
            style={{ backgroundImage: `url(${images.iceCream})` }}
          ></div>
          <div className="main-screen__container__visual__comment">
            <ErrorBoundary>
              <Comment id="main-comment" />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainScreen;
