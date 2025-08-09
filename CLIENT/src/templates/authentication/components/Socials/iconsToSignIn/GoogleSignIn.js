import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const GoogleSignIn = ({ onSuccess }) => {
  useEffect(() => {
    const loadGoogleScript = () => {
      if (!document.getElementById('google-signin-script')) {
        const script = document.createElement('script');
        script.id = 'google-signin-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    };

    window.handleGoogleSignIn = async (response) => {
      try {
        const data = jwtDecode(response.credential);
        const backendResponse = await sendToBackend(data);
        onSuccess(backendResponse);
      } catch (error) {
        console.error('Erro no login com Google:', error);
        onSuccess(null, error);
      }
    };

    const sendToBackend = async (googleData) => {
      const response = await fetch('/auth/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': await getCSRFToken(),
        },
        credentials: 'include',
        body: JSON.stringify({
          sub: googleData.sub,
          name: googleData.name,
          email: googleData.email,
          picture: googleData.picture,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação com o backend');
      }

      return await response.json();
    };

    const getCSRFToken = async () => {
      const response = await fetch('/csrf-token');
      const data = await response.json();
      return data.csrfToken;
    };

    loadGoogleScript();

    return () => {
      window.handleGoogleSignIn = undefined;
    };
  }, [onSuccess]);

  return (
    <div
      id="g_id_onload"
      data-client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      data-context="signin"
      data-ux_mode="popup"
      data-callback="handleGoogleSignIn"
      data-auto_prompt="false"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px', // Aumentado
        width: '300px', // Aumentado significativamente
      }}
    >
      <div
        className="g_id_signin"
        data-type="standard" // Mudado de 'icon' para 'standard'
        data-shape="rectangular" // Mudado para retangular
        data-theme="outline"
        data-text="signin_with"
        data-size="large" // Tamanho grande
        data-width="300" // Largura igual ao container
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      ></div>
    </div>
  );
};

export default GoogleSignIn;
