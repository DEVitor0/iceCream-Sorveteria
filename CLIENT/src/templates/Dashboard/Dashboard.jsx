import Board from '../../components/Dashboard/Menu/Board/index';

import IconProvider from '../../contexts/IconsContext/IconProvider/index';
import ImageProvider from '../../contexts/ImagesContext/ImageProvider/index';

const Dashboard = () => {
  return (
    <>
      <IconProvider>
        <ImageProvider>
          <Board></Board>
        </ImageProvider>
      </IconProvider>
    </>
  );
};
export default Dashboard;
