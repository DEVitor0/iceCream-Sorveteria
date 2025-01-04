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
        <Subtitle text="Serviços" />
      </div>
      <div className="services__subtitle">
        <TitleServices text="Sobre os nossos serviços" />
      </div>
      <div className="services__container">
        <KindOfServices
          title="Fácil de pedir"
          description="Peça sua sobremesa em segundos, sem complicação."
          image={images.easeToBuy2}
        />
        <KindOfServices
          title="Entrega rápida"
          description="Receba suas delícias com agilidade e segurança."
          image={images.delivery2}
        />
        <KindOfServices
          title="Melhor qualidade"
          description="Sabores premium feitos com os melhores ingredientes."
          image={images.quality2}
        />
      </div>
    </section>
  );
};

export default OurServices;
