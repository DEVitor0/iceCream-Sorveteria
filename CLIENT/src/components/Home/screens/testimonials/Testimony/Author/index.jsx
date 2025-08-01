import { Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import image from '../../../../../../utils/imageManager/imageManager';
import Styles from './author.module.scss';

const Author = ({ author }) => {
  // Normaliza o valor para garantir que 5 mostre 5 estrelas completas
  const normalizedRating = Math.min(Math.max(author.rating, 0), 5);

  return (
    <div className={Styles.author}>
      <div
        className={Styles.author__image}
        style={{ backgroundImage: `url(${image[author.image]})` }}
      ></div>
      <div className={Styles.author__text}>
        <h4 className={Styles.author__text__name}>{author.name}</h4>
        <div className={Styles.author__text__rating}>
          <Rating
            name="author-rating"
            value={normalizedRating}
            precision={0.5}
            max={5} // Garante que o máximo é 5 estrelas
            readOnly
            icon={<StarIcon style={{ color: '#52478C' }} />}
            emptyIcon={<StarIcon style={{ opacity: 0.5, color: 'gray' }} />}
          />
          <span className={Styles.author__text__rating__value}>
            {normalizedRating.toFixed(1)} {/* Mostra com 1 casa decimal */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Author;
