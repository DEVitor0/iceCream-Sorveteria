import PropTypes from 'prop-types';
import './style.scss';

const Comment = ({ id = '' }) => {
  return (
    <div id={id} className={`comment-block ${id ? 'looking-main' : ''}`}>
      <p className="comment-block__opinion">
        &quot;Entrega rápida e funcionários simpáticos. <br />
        O sorvete chegou frio e <br />
        muito delicioso!
        <span className="comment-block__opinion__author">Eva Oliveira</span>
      </p>
    </div>
  );
};

Comment.propTypes = {
  id: PropTypes.string,
};

export default Comment;
