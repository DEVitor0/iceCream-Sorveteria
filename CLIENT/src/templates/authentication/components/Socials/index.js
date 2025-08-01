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
      {/* Exibe o popup de erro se houver erro */}
      {error && <ErrorPopup message={error} onClose={closeErrorPopup} />}

      <SoftBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        {/* Botão do Facebook */}
        <SoftButton variant="outlined" color="light" sx={{ p: 1.5 }}>
          <svg width="24px" height="24px" viewBox="0 0 64 64" version="1.1">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(3.000000, 3.000000)" fillRule="nonzero">
                <circle
                  fill="#3C5A9A"
                  cx="29.5091719"
                  cy="29.4927506"
                  r="29.4882047"
                />
                <path
                  d="M39.0974944,9.05587273 L32.5651312,9.05587273 C28.6886088,9.05587273 24.3768224,10.6862851 24.3768224,16.3054653 C24.395747,18.2634019 24.3768224,20.1385313 24.3768224,22.2488655 L19.8922122,22.2488655 L19.8922122,29.3852113 L24.5156022,29.3852113 L24.5156022,49.9295284 L33.0113092,49.9295284 L33.0113092,29.2496356 L38.6187742,29.2496356 L39.1261316,22.2288395 L32.8649196,22.2288395 C32.8649196,22.2288395 32.8789377,19.1056932 32.8649196,18.1987181 C32.8649196,15.9781412 35.1755132,16.1053059 35.3144932,16.1053059 C36.4140178,16.1053059 38.5518876,16.1085101 39.1006986,16.1053059 L39.1006986,9.05587273 L39.0974944,9.05587273 L39.0974944,9.05587273 Z"
                  fill="#FFFFFF"
                />
              </g>
            </g>
          </svg>
        </SoftButton>

        {/* Botão da Apple */}
        <SoftButton variant="outlined" color="light" sx={{ p: 1.5 }}>
          <svg width="24px" height="24px" viewBox="0 0 64 64" version="1.1">
            <path d="M40.9233048,32.8428307 C41.0078713,42.0741676 48.9124247,45.146088 49,45.1851909 C48.9331634,45.4017274 47.7369821,49.5628653 44.835501,53.8610269 C42.3271952,57.5771105 39.7241148,61.2793611 35.6233362,61.356042 C31.5939073,61.431307 30.2982233,58.9340578 25.6914424,58.9340578 C21.0860585,58.9340578 19.6464932,61.27947 15.8321878,61.4314159 C11.8738936,61.5833617 8.85958554,57.4131833 6.33064852,53.7107148 C1.16284874,46.1373849 -2.78641926,32.3103122 2.51645059,22.9768066 C5.15080028,18.3417501 9.85858819,15.4066355 14.9684701,15.3313705 C18.8554146,15.2562145 22.5241194,17.9820905 24.9003639,17.9820905 C27.275104,17.9820905 31.733383,14.7039812 36.4203248,15.1854154 C38.3824403,15.2681959 43.8902255,15.9888223 47.4267616,21.2362369 C47.1417927,21.4153043 40.8549638,25.1251794 40.9233048,32.8428307 M33.3504628,10.1750144 C35.4519466,7.59650964 36.8663676,4.00699306 36.4804992,0.435448578 C33.4513624,0.558856931 29.7884601,2.48154382 27.6157341,5.05863265 C25.6685547,7.34076135 23.9632549,10.9934525 24.4233742,14.4943068 C27.7996959,14.7590956 31.2488715,12.7551531 33.3504628,10.1750144" />
          </svg>
        </SoftButton>

        {/* Componente do Google Sign-In */}
        <GoogleSignIn onSuccess={handleGoogleSuccess} />
      </SoftBox>
    </>
  );
}

export default Socials;
