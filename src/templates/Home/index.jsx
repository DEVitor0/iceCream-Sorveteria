import MainScreen from '../../components/mainScreen/index';
import IconProvider from '../../contexts/IconsContext/IconProvider/index';
import HeaderBar from '../../components/navbar/header/index';

import IntersectionObserverEffect from '../../utils/intersectionObserverApi/observer';

export const Home = () => {
  const observerEffect = new IntersectionObserverEffect();
  observerEffect.startObserving();

  return (
    <div>
      <IconProvider>
        <HeaderBar id="header" />
        <MainScreen />
      </IconProvider>
    </div>
  );
};
