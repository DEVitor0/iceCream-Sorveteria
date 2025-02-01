import Anchor from '../../../anchor/index';
import './style.scss';

const Links = () => {
  return (
    <nav className="header-bar__inner__menu">
      <ul className="header-bar__inner__menu__list">
        <li className="header-bar__inner__menu__list__item">
          <Anchor href={'#'} text={'Reservas'} />
        </li>
        <li className="header-bar__inner__menu__list__item">
          <Anchor href={'#'} text={'Serviços'} />
        </li>
        <li className="header-bar__inner__menu__list__item">
          <Anchor href={'#'} text={'Cardápio'} />
        </li>
        <li className="header-bar__inner__menu__list__item">
          <Anchor href={'#'} text={'Depoimentos'} />
        </li>
      </ul>
    </nav>
  );
};

export default Links;
