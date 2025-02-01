import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLogin, {
  showErrorMessage,
  emailIsValid,
  passwordIsValid,
} from './AdminLoginScript';
import { useNavigate } from 'react-router-dom';

// Mock do useNavigate e do Link para evitar problemas com o React Router
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock do CSS Modules para que as classes sejam strings simples
jest.mock('./adminForm.module.scss', () => ({
  adminForm: 'adminForm',
  main: 'main',
  loginForm: 'loginForm',
  loginForm__title: 'loginForm__title',
  loginForm__form: 'loginForm__form',
  loginForm__inputBox: 'loginForm__inputBox',
  loginForm__inputBox__icons: 'loginForm__inputBox__icons',
  loginForm__forgetPassword: 'loginForm__forgetPassword',
  loginImg: 'loginImg',
  errorMessage: 'errorMessage',
}));

// Mock do fetch para os endpoints usados (/csrf-token e /api/validate-credentials)
global.fetch = jest.fn((url, options) => {
  if (url === '/csrf-token') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ csrfToken: 'dummy-csrf-token' }),
    });
  }
  if (url === '/api/validate-credentials') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ redirectUrl: '/dashboard' }),
    });
  }
  return Promise.reject(new Error('URL não mapeada'));
});

describe('AdminLogin Component and Utility Functions', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    // Configura o hook useNavigate para retornar a função navigate mockada
    useNavigate.mockReturnValue(navigate);
    fetch.mockClear();
    navigate.mockClear();
    // Limpa o conteúdo do body para evitar interferências entre os testes
    document.body.innerHTML = '';
  });

  describe('Funções utilitárias', () => {
    it('showErrorMessage deve adicionar a mensagem de erro ao form', () => {
      // Cria um formulário com id "form" para o teste
      const form = document.createElement('form');
      form.id = 'form';
      document.body.appendChild(form);

      const errorText = 'Erro de teste';
      showErrorMessage(errorText);

      const errorDiv = form.querySelector('.errorMessage');
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv.textContent).toContain(errorText);
    });

    it('emailIsValid deve retornar false e exibir erro para email inválido', () => {
      // Cria o form para que a função showErrorMessage funcione
      const form = document.createElement('form');
      form.id = 'form';
      document.body.appendChild(form);

      expect(emailIsValid('emailinvalido')).toBe(false);

      const errorDiv = form.querySelector('.errorMessage');
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv.textContent).toContain('Endereço de email inválido');
    });

    it('emailIsValid deve retornar true para email válido', () => {
      // Cria o form (mesmo que a função não exiba erro, ela tenta buscar o form)
      const form = document.createElement('form');
      form.id = 'form';
      document.body.appendChild(form);

      expect(emailIsValid('test@example.com')).toBe(true);
    });

    it('passwordIsValid deve retornar false e exibir erro para senha muito longa', () => {
      const form = document.createElement('form');
      form.id = 'form';
      document.body.appendChild(form);

      const longPassword = 'a'.repeat(26);
      expect(passwordIsValid(longPassword)).toBe(false);

      const errorDiv = form.querySelector('.errorMessage');
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv.textContent).toContain('Senha muito longa');
    });

    it('passwordIsValid deve retornar true para senha válida', () => {
      const form = document.createElement('form');
      form.id = 'form';
      document.body.appendChild(form);

      expect(passwordIsValid('password123')).toBe(true);
    });
  });

  describe('Componente AdminLogin', () => {
    it('deve renderizar os elementos do formulário', async () => {
      render(<AdminLogin />);

      // Aguarda o efeito de busca do csrfToken
      await waitFor(() => {
        expect(
          screen.getByDisplayValue('dummy-csrf-token'),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByPlaceholderText('Digite seu email'),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Digite sua senha'),
      ).toBeInTheDocument();
      // Usando data-testid adicionado no form para facilitar a seleção
      expect(screen.getByTestId('form')).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro se os campos estiverem vazios', async () => {
      render(<AdminLogin />);
      // Aguarda que o form seja renderizado
      await waitFor(() =>
        expect(screen.getByTestId('form')).toBeInTheDocument(),
      );

      const form = screen.getByTestId('form');
      fireEvent.submit(form);

      await waitFor(() => {
        const errorDiv = form.querySelector('.errorMessage');
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv.textContent).toContain('Preencha todos os campos!');
      });
    });

    it('deve submeter o formulário e redirecionar em caso de sucesso', async () => {
      render(<AdminLogin />);
      // Aguarda o efeito que busca o csrfToken
      await waitFor(() =>
        expect(screen.getByTestId('form')).toBeInTheDocument(),
      );

      const emailInput = screen.getByPlaceholderText('Digite seu email');
      const passwordInput = screen.getByPlaceholderText('Digite sua senha');
      const form = screen.getByTestId('form');

      // Preenche os campos
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Submete o formulário
      fireEvent.submit(form);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/validate-credentials',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'X-CSRF-Token': 'dummy-csrf-token',
            }),
            credentials: 'include',
            body: JSON.stringify({
              username: 'test@example.com',
              password: 'password123',
            }),
          }),
        );
      });

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});
