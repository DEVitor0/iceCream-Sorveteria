import Brand from '../brand/index';
import Links from '../links/index';
import ButtonIconText from '../../buttons/button-icon-text/index';
import IconContext from '../../../contexts/IconsContext/IconContext/index';
import { useContext } from 'react';

import './style.scss';

const HeaderBar = () => {
  const icons = useContext(IconContext);
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
