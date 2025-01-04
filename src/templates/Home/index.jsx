//Components
import MainScreen from '../../components/screens/mainScreen/index';
import HeaderBar from '../../components/screens/navbar/header/index';
import OurServices from '../../components/screens/ourServices/index';

//Contexts
import IconProvider from '../../contexts/IconsContext/IconProvider/index';
import ImageProvider from '../../contexts/ImagesContext/ImageProvider/index';

//Utils
import IntersectionObserverEffect from '../../utils/intersectionObserverApi/observer';

export const Home = () => {
  const observerEffect = new IntersectionObserverEffect();
  observerEffect.startObserving();

  return (
    <div>
      <ImageProvider>
        <IconProvider>
          <HeaderBar id="header" />
          <MainScreen />
        </IconProvider>
        <OurServices />
      </ImageProvider>
    </div>
  );
};
