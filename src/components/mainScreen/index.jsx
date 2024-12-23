import Title from './title/index';

const mainScreen = () => {
  return (
    <section className="main-screen">
      <div className="main-screen__container">
        <div className="main-screen__container__texts">
          <Title />
        </div>
        <div></div>
      </div>
    </section>
  );
};

export default mainScreen;
