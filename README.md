# IceCream Sorveteria 🍦

Um projeto de loja online e sistema de gestão em andamento para a **IceCream Sorveteria**. Desenvolvido com foco em uma interface simples e intuitiva, integrando front-end e back-end para proporcionar uma experiência de compra segura e eficiente.

## 🚧 Status do Projeto

**Em andamento.** Algumas funcionalidades já foram implementadas, incluindo telas, componentes reutilizáveis e integração com a base de dados.

---

## 🛠️ Tecnologias Usadas

### **Frontend**
- **React** - Biblioteca JavaScript para construir interfaces de usuário.
- **Material UI** - Componentes prontos para uma interface de usuário moderna e responsiva.
- **Axios** - Biblioteca para fazer requisições HTTP.
- **React Router DOM** - Gerenciamento de rotas no lado do cliente.
- **Chart.js** - Biblioteca para criar gráficos interativos.
- **Styled Components** - Para criar componentes de estilo de forma dinâmica.
- **React Testing Library** - Biblioteca de testes para React.

### **Backend**
- **Express** - Framework web para Node.js para construir APIs.
- **MongoDB** - Banco de dados NoSQL para armazenamento de dados.
- **Mongoose** - ODM para MongoDB.
- **JWT** - Autenticação baseada em token JSON Web Token.
- **Bcrypt** - Criptografia de senhas.
- **Helmet** - Middleware para ajudar a proteger o aplicativo definindo cabeçalhos HTTP.
- **CORS** - Permite requisições de diferentes origens.
- **cookie-parser** - Middleware para parsing de cookies.
- **csurf** - Middleware para proteção contra CSRF (Cross-Site Request Forgery).
- **express-rate-limit** - Limitação de taxa para prevenir abusos.
- **dotenv** - Carrega variáveis de ambiente a partir de um arquivo `.env`.
- **nodemailer** - Envio de e-mails no backend.

### **Ferramentas de Desenvolvimento**
- **Nodemon** - Ferramenta para reiniciar automaticamente o servidor durante o desenvolvimento.
- **Husky** - Ganchos Git para automação de tarefas.
- **ESLint** - Ferramenta para análise estática de código.
- **Prettier** - Formatador de código.
- **Concurrently** - Executa múltiplos comandos npm simultaneamente.
- **Jest** - Framework de testes JavaScript.
- **Babel** - Transpila código JavaScript moderno para versões mais antigas de navegadores.

---

## 🔒 Segurança

A aplicação utiliza as seguintes tecnologias para garantir a segurança:

- **Autenticação JWT** para garantir a integridade e autenticidade do usuário.
- **Helmet** para definir cabeçalhos HTTP seguros.
- **Bcrypt** para criptografar as senhas dos usuários.
- **CSRF Protection** com `csurf` para proteger contra ataques Cross-Site Request Forgery.

---

## 📄 Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
