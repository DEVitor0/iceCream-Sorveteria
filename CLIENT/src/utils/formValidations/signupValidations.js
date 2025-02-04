import { showErrorMessage } from './formValidation';

export const phoneIsValid = (phone, styles) => {
  const cleanedPhone = phone.replace(/\D/g, '');

  if (cleanedPhone.length !== 11) {
    showErrorMessage('Número de telefone inválido', styles);
    return false;
  }

  return true;
};
