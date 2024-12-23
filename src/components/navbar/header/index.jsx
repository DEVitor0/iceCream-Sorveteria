import Brand from '../brand/index';
import Links from '../links/index';
import ButtonIconText from '../../buttons/button-icon-text/index';

import icons from '../../../styles/icons/fontawesome';
import './style.scss';

const HeaderBar = () => {
  return (
    <header className="header-bar">
      <div className="header-bar__inner">
        <Brand />
        <Links />
        <ButtonIconText text="Meu carrinho" icon={icons.bagShopping} />
      </div>
    </header>
  );
};

export default HeaderBar;
