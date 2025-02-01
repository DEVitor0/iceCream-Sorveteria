import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../media/icons/fontawesome';
import image from '../../../utils/imageManager/imageManager';
import Form from '../../../components/Account/form';

const SignUp = () => {
  return (
    <Form
      title="Entrar"
      linkText="Login/"
      route="/entrar"
      emailPlaceholder="Digite seu email"
      passwordPlaceholder="Digite sua senha"
      forgetPasswordText="Esqueceu a senha ?"
      submitButtonText="Cadastrar-se"
      icons={{
        envelop: (
          <FontAwesomeIcon icon={icons.envelop} data-testid="svg-inline--fa" />
        ),
        phone: (
          <FontAwesomeIcon icon={icons.phone} data-testid="svg-inline--fa" />
        ),
        lock: (
          <FontAwesomeIcon icon={icons.lock} data-testid="svg-inline--fa" />
        ),
      }}
      image={{ person: image.person }}
      isLoginForm={true}
    />
  );
};

export default SignUp;
