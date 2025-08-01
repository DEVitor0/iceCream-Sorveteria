import React, { useState, useContext } from 'react';
import styles from './Vertical.module.scss';
import dataLeftBarMenuItem from './Configs/configsLeftBarMenuItem';
import brandLogo from '../../../../../media/images/brand/brand.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconContext from '../../../../../contexts/IconsContext/IconContext/index';

const VerticalMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const iconContext = useContext(IconContext);

  const handleCategoryClick = (categoryKey) => {
    setActiveCategory(activeCategory === categoryKey ? null : categoryKey);
  };

  const { dashboard, categories, logout } = dataLeftBarMenuItem;

  return (
    <IconContext.Provider value={iconContext}>
      <nav className={styles.verticalMenu}>
        <div className={styles.brandContainer}>
          <img
            src={brandLogo}
            alt="Marca da Loja"
            className={styles.brandLogo}
          />
        </div>

        <div className={styles.menuItems}>
          {/* Dashboard */}
          <div className={styles.menuItem}>
            <button className={styles.categoryButton}>
              <FontAwesomeIcon
                icon={iconContext[dashboard.icon]}
                data-testid="svg-inline--fa"
              />
              <span className={styles.categoryText}>{dashboard.text}</span>
            </button>
          </div>

          {/* Categorias */}
          {Object.entries(categories).map(([key, category]) => {
            const actions = category?.actions || {};

            return (
              <div
                key={key}
                className={`${styles.menuItem} ${
                  activeCategory === key ? styles.active : ''
                }`}
              >
                <button
                  className={styles.categoryButton}
                  onClick={() => handleCategoryClick(key)}
                >
                  <FontAwesomeIcon
                    icon={iconContext[category.icon]}
                    data-testid="svg-inline--fa"
                  />
                  <span className={styles.categoryText}>{category.text}</span>
                </button>

                <div className={styles.actionsContainer}>
                  {Object.entries(actions).map(([actionKey, action]) => (
                    <button key={actionKey} className={styles.actionItem}>
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Botão de Sair */}
          <div className={styles.menuItem} style={{ marginTop: 'auto' }}>
            <button className={styles.categoryButton}>
              <FontAwesomeIcon
                icon={iconContext[logout.icon]}
                data-testid="svg-inline--fa"
              />
              <span className={styles.categoryText}>{logout.text}</span>
            </button>
          </div>
        </div>
      </nav>
    </IconContext.Provider>
  );
};

export default VerticalMenu;
