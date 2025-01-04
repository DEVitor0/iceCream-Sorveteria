import TitleServices from '../../titleServices/index';
import Subtitle from '../../subtitle/index';
import KindOfServices from './itens/index';
import './styles.scss';

import { useContext } from 'react';
import ImageContext from '../../../contexts/ImagesContext/ImageContext/index';
const OurServices = () => {
  const images = useContext(ImageContext);
  return (
    <section className="services">
      <div className="services__title">
        <Subtitle id="services-subtitle" text="Serviços" />
      </div>
      <div className="services__subtitle">
        <TitleServices id="services-title" text="Sobre os nossos serviços" />
      </div>
      <div
        className="services__container looking-services"
        id="services-container"
      >
        <KindOfServices
          title="Fácil de pedir"
          description="Peça sua sobremesa em segundos, sem complicação."
          image={images.easeToBuy}
        />
        <KindOfServices
          title="Entrega rápida"
          description="Receba suas delícias com agilidade e segurança."
          image={images.delivery}
        />
        <KindOfServices
          title="Melhor qualidade"
          description="Sabores premium feitos com os melhores ingredientes."
          image={images.quality}
        />
      </div>
    </section>
  );
};

export default OurServices;
