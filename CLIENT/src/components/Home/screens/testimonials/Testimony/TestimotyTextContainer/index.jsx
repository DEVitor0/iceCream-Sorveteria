import QuotationMarks from '../../Testimony/QuotationMarks/QuotationMarks';
import Author from '../Author/index';
import Menssage from '../Menssage/Menssage';
import Styles from './testimoty.module.scss';

const TestimotyTextContainer = ({ testimonial }) => {
  return (
    <div className={Styles.TestimotyTextContainer}>
      <div className={Styles.TestimotyTextContainer__author}>
        <Author author={testimonial.author} rating={testimonial.rating} />
      </div>
      <div className={Styles.TestimotyTextContainer__opinion}>
        <div className={Styles.TestimotyTextContainer__opinion__quotationmark}>
          <QuotationMarks />
        </div>
        <div className={Styles.TestimotyTextContainer__opinion__menssage}>
          <Menssage text={testimonial.message} />
        </div>
        <div className={Styles.TestimotyTextContainer__opinion__quotationmark}>
          <QuotationMarks flipped={false} />
        </div>
      </div>
    </div>
  );
};

export default TestimotyTextContainer;
