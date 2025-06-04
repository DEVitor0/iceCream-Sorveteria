// utils/cookies.js
export const getCookieDetails = (name) => {
  const cookie = document.cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${name}=`));

  if (!cookie) return null;

  const value = cookie.split('=')[1];
  const attributes = {
    path: '/',
    domain: '.ngrok-free.app',
    secure: false,
    httpOnly: false, // apenas informação, não pode ser acessado via JS
  };

  // Extrai atributos do cookie
  const attrString = cookie.split(';').slice(1);
  attrString.forEach((attr) => {
    const [key, val] = attr.trim().split('=');
    attributes[key.toLowerCase()] = val || true;
  });

  return { value, attributes };
};
