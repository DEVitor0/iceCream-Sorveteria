// Components
import MainScreen from '../../components/Home/screens/mainScreen/index';
import HeaderBar from '../../components/Home/screens/navbar/header/index';
import OurServices from '../../components/Home/screens/ourServices/index';
import OurProducts from '../../components/Home/screens/ourProducts/index';

// Contexts
import IconProvider from '../../contexts/IconsContext/IconProvider/index';
import ImageProvider from '../../contexts/ImagesContext/ImageProvider/index';

// Utils
import initializeObserver from '../../utils/intersectionObserverApi/observer';

export const Home = () => {
  initializeObserver();

  return (
    <div>
      <ImageProvider>
        <IconProvider>
          <HeaderBar id="header" />
          <MainScreen />
        </IconProvider>
        <OurServices />
      </ImageProvider>
      <OurProducts />
    </div>
  );
};
