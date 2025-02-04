export const showErrorMessage = (message, styles) => {
  const form = document.querySelector('#form');
  if (!form) return;

  const existingMessage = Array.from(form.children).find((child) =>
    child.classList.contains(styles.errorMessage),
  );

  if (existingMessage) existingMessage.remove();

  const messageDiv = document.createElement('div');
  messageDiv.classList.add(styles.errorMessage);
  const messageText = document.createElement('p');
  messageText.textContent = message;

  messageDiv.appendChild(messageText);
  form.appendChild(messageDiv);
};

export const emailIsValid = (email, styles) => {
  if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    showErrorMessage('Endereço de email inválido', styles);
    return false;
  }
  return true;
};

export const passwordIsValid = (password, styles) => {
  if (password && password.length > 25) {
    showErrorMessage('Senha muito longa', styles);
    return false;
  }
  return true;
};

export const validateFields = (email, password, styles) => {
  if (!email || !password) {
    showErrorMessage('Preencha todos os campos!', styles);
    return false;
  }

  if (!emailIsValid(email, styles) || !passwordIsValid(password, styles)) {
    return false;
  }

  if (email.length > 35 || password.length > 25) {
    showErrorMessage('Campos excedem o tamanho máximo!', styles);
    return false;
  }

  return true;
};
