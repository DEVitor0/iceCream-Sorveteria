import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VerticalMenu from '../../../components/DashboardBar/VerticalMenu/index';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar/index';

// Função para buscar o token CSRF
const fetchCsrfToken = async () => {
  try {
    const response = await fetch('/csrf-token', {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

const EmailSenderPage = () => {
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    templateType: 'promotional',
  });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Buscar o token CSRF quando o componente montar
  useEffect(() => {
    const getCsrfToken = async () => {
      const token = await fetchCsrfToken();
      if (token) setCsrfToken(token);
    };
    getCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e) => {
    setEmailData((prev) => ({ ...prev, content: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSending) return;

    setIsSending(true);
    setSendSuccess(false);

    try {
      // Verificar se temos um token CSRF válido
      if (!csrfToken) {
        const newToken = await fetchCsrfToken();
        if (!newToken) {
          throw new Error('Failed to get CSRF token');
        }
        setCsrfToken(newToken);
      }

      const response = await fetch('/api/emails/send-mass-email', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          emailType: emailData.templateType,
          subject: emailData.subject,
          content: emailData.content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao enviar emails');
      }

      setSendSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      // Aqui você pode adicionar um estado para mostrar o erro na UI se quiser
    } finally {
      setIsSending(false);
    }
  };

  const templateOptions = [
    { value: 'retention', label: 'Retenção' },
    { value: 'promotional', label: 'Promocional' },
    { value: 'operational', label: 'Operacional' },
    { value: 'warning', label: 'Aviso' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: '#F8FAFC',
      }}
    >
      <VerticalMenu />

      <div style={{ flexGrow: 1 }}>
        {/* Header com navbar */}
        <div
          style={{
            backgroundColor: '#FDFDFD',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            width: '92%',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '25px auto 0 auto',
          }}
        >
          <DashboardNavbar />
        </div>

        {/* Conteúdo principal */}
        <div
          style={{
            padding: '32px',
            marginLeft: '18px',
            maxWidth: '1200px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1E293B',
                marginBottom: '8px',
              }}
            >
              Painel de Comunicação
            </h1>
            <p
              style={{
                color: '#64748B',
                marginBottom: '32px',
              }}
            >
              Envie mensagens para sua base de clientes
            </p>

            {/* Card do formulário */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 25px rgba(140, 79, 237, 0.1)',
                padding: '32px',
                marginBottom: '32px',
                border: '1px solid #EDF2F7',
              }}
            >
              <form onSubmit={handleSubmit}>
                {/* Seção do template */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '500',
                      color: '#1E293B',
                    }}
                  >
                    Modelo de Mensagem
                  </label>
                  <select
                    name="templateType"
                    value={emailData.templateType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      fontSize: '15px',
                      color: '#1E293B',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%234B5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      transition: 'all 0.2s',
                      outline: 'none',
                      ':focus': {
                        borderColor: '#8C4FED',
                        boxShadow: '0 0 0 3px rgba(140, 79, 237, 0.2)',
                      },
                    }}
                  >
                    {templateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo do assunto */}
                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '500',
                      color: '#1E293B',
                    }}
                  >
                    Assunto
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      fontSize: '15px',
                      color: '#1E293B',
                      transition: 'all 0.2s',
                      outline: 'none',
                      ':focus': {
                        borderColor: '#8C4FED',
                        boxShadow: '0 0 0 3px rgba(140, 79, 237, 0.2)',
                      },
                    }}
                    placeholder="Digite o assunto do email"
                  />
                </div>

                {/* Campo do conteúdo */}
                <div style={{ marginBottom: '32px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '500',
                      color: '#1E293B',
                    }}
                  >
                    Conteúdo da Mensagem
                  </label>
                  <textarea
                    value={emailData.content}
                    onChange={handleContentChange}
                    style={{
                      width: '100%',
                      minHeight: '300px',
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      fontSize: '15px',
                      color: '#1E293B',
                      lineHeight: '1.6',
                      transition: 'all 0.2s',
                      outline: 'none',
                      resize: 'vertical',
                      ':focus': {
                        borderColor: '#8C4FED',
                        boxShadow: '0 0 0 3px rgba(140, 79, 237, 0.2)',
                      },
                    }}
                    placeholder="Escreva o conteúdo da sua mensagem aqui..."
                  />
                </div>

                {/* Botão de envio */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={
                      isSending || !emailData.content || !emailData.subject
                    }
                    style={{
                      backgroundColor: '#8C4FED',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: '500',
                      fontSize: '15px',
                      cursor: 'pointer',
                      opacity:
                        isSending || !emailData.content || !emailData.subject
                          ? 0.7
                          : 1,
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {isSending && (
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                    )}
                    {isSending ? 'Enviando...' : 'Enviar Mensagens'}
                  </motion.button>
                </div>
              </form>

              {sendSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    marginTop: '24px',
                    padding: '12px 16px',
                    backgroundColor: '#F0FDF4',
                    color: '#166534',
                    borderRadius: '8px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM9.003 14L16.073 6.929L14.659 5.515L9.003 11.172L6.174 8.343L4.76 9.757L9.003 14Z"
                      fill="#166534"
                    />
                  </svg>
                  Mensagens enviadas com sucesso!
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Adicionando a fonte Poppins */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          select:focus, input:focus, textarea:focus {
            border-color: #8C4FED !important;
            box-shadow: 0 0 0 3px rgba(140, 79, 237, 0.2) !important;
          }
        `}
      </style>
    </div>
  );
};

export default EmailSenderPage;
