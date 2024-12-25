import './style.scss';
const Comment = () => {
  return (
    <div className="comment-block">
      <p className="comment-block__opinion">
        &quot;Entrega rápida e funcionários simpáticos. <br />
        O sorvete chegou frio e <br />
        muito delicioso!
        <span className="comment-block__opinion__author">Eva Oliveira</span>
      </p>
    </div>
  );
};

export default Comment;
