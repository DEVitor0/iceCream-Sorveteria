import { useNavigate } from 'react-router-dom';
import SoftButton from '../../../../components/Dashboard/SoftButton';
import SoftBox from '../../../../components/Dashboard/SoftBox';
import GoogleSignIn from './iconsToSignIn/GoogleSignIn';
import ErrorPopup from '../../../../examples/Cards/ErrorPopup/index.jsx';
import { useState } from 'react';

function Socials() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (backendResponse, error) => {
    if (error) {
      console.error('Erro no login com Google:', error);
      setError('Falha no login com Google. Tente novamente.');
      return;
    }

    try {
      if (!backendResponse?.success) {
        throw new Error(
          backendResponse?.message || 'Resposta inválida do servidor',
        );
      }

      // Redireciona simplesmente para a página de registro
      navigate('/authentication/registrar/dados');
    } catch (err) {
      console.error('Erro ao processar login:', err);
      setError(err.message || 'Erro ao processar seus dados');
    }
  };

  const closeErrorPopup = () => {
    setError(null);
  };

  return (
    <>
      {error && <ErrorPopup message={error} onClose={closeErrorPopup} />}

      <SoftBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={1}
        sx={{
          width: '100%',
          maxWidth: '100%', // Alterado para ocupar toda a largura disponível
        }}
      >
        {/* Container do Google Sign-In com tamanho aumentado */}
        <SoftBox
          sx={{
            width: '100%',
            maxWidth: '300px', // Largura máxima aumentada
            height: '50px', // Altura fixa maior
          }}
        >
          <GoogleSignIn
            onSuccess={handleGoogleSuccess}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '50px', // Garante altura mínima
            }}
          />
        </SoftBox>
      </SoftBox>
    </>
  );
}

export default Socials;
