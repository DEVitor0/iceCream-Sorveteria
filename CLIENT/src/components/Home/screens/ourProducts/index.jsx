import TitleServices from '../../titleServices/index';
import Subtitle from '../../subtitle/index';

const OurProducts = () => {
  return (
    <section className="ourProducts">
      <div className="ourProducts__title">
        <TitleServices id="ourProducts-title" text="Cardápio" />
        <Subtitle id="ourProducts-subtitle" text="Conheça o nosso cardápio" />
      </div>
    </section>
  );
};

export default OurProducts;
