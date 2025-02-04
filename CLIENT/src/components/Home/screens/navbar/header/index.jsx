import Brand from '../brand/index';
import Links from '../links/index';
import ButtonIconText from '../../../../Home/buttons/button-icon-text/index';
import IconContext from '../../../../../contexts/IconsContext/IconContext/index';

import { useContext } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const HeaderBar = ({ id }) => {
  const icons = useContext(IconContext);
  return (
    <header className={`header-bar ${id ? 'looking-main' : ''}`} id={id}>
      <div className="header-bar__inner">
        <Brand />
        <Links />
        <ButtonIconText text="Meu carrinho" icon={icons.bagShopping} />
      </div>
    </header>
  );
};

HeaderBar.propTypes = {
  id: PropTypes.string.isRequired,
};

HeaderBar.defaultProps = {
  classname: '',
};

export default HeaderBar;
