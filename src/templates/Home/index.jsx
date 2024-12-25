import MainScreen from '../../components/mainScreen/index';
import IconProvider from '../../contexts/IconsContext/IconProvider/index';
import HeaderBar from '../../components/navbar/header/index';

export const Home = () => {
  return (
    <div>
      <IconProvider>
        <HeaderBar />
        <MainScreen />
      </IconProvider>
    </div>
  );
};
