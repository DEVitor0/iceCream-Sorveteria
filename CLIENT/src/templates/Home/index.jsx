// Components
import MainScreen from '../../components/Home/screens/mainScreen/index';
import HeaderBar from '../../components/Home/screens/navbar/header/index';
import OurServices from '../../components/Home/screens/ourServices/index';
import OurProducts from '../../components/Home/screens/ourProducts/index';
import TestimonialsContainer from '../../components/Home/screens/testimonials/TestimonialsContainer/index';
import Footer from '../../components/Home/screens/navbar/footer/index';

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
      <ImageProvider>
        <TestimonialsContainer />
        <IconProvider>
          <Footer></Footer>
        </IconProvider>
      </ImageProvider>
    </div>
  );
};
