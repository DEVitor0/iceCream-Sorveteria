import Brand from '../Brand/index';
import Widgets from '../Widgets/index';

import { useContext } from 'react';
import ImageContext from '../../../../contexts/ImagesContext/ImageContext/index';
import IconContext from '../../../../contexts/IconsContext/IconContext/index';

import Styles from './boardDashboard.module.scss';

const Board = () => {
  const brandImage = useContext(ImageContext);
  const iconContextAccess = useContext(IconContext);

  return (
    <div className={Styles.boardDashboard}>
      <Brand image={brandImage.brand} alt="Logo" />

      <div className={Styles.section}>
        <div className={Styles.widgetsGroup}>
          <Widgets
            icon={iconContextAccess.houseChimney}
            menu={false}
            text="Dashboard"
          />
          <Widgets
            icon={iconContextAccess.basketShopping}
            menu={true}
            text="Vendas"
          />
        </div>
        <div className={Styles.divider}></div> {/* Divisor visual */}
      </div>

      <div className={Styles.section}>
        <div className={Styles.widgetsGroup}>
          <Widgets icon={iconContextAccess.box} menu={true} text="Produtos" />
          <Widgets icon={iconContextAccess.cubes} menu={false} text="Estoque" />
        </div>
        <div className={Styles.divider}></div> {/* Divisor visual */}
      </div>

      <div className={Styles.section}>
        <div className={Styles.widgetsGroup}>
          <Widgets icon={iconContextAccess.user} menu={true} text="Usuários" />
          <Widgets icon={iconContextAccess.goOut} menu={false} text="Sair" />
        </div>
      </div>
    </div>
  );
};
export default Board;
