require("dotenv").config();

const SERVER_PORT = process.env.SERVER_PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./configs/corsConfigs");
const express = require("express");
const csrf = require("csurf");
const csrfProtection = require('./configs/csrfProtectionConfigs');
/* const csrfErrorHandler = require('./middlewares/csurfMiddleware'); */
const sessionConfig = require('./configs/session')
const app = express();
const routes = require("./routes");

const connectDB = require("./configs/databaseConfigs");
const createAdminUser = require("./utils/initializeAdmin");
const { applySecurityHeaders } = require("./utils/helmetSecurity");
const { limiter } = require("./configs/rateLimiterConfig");

csrf({ cookie: true });

app.set("trust proxy", 1);

connectDB(CONNECTION_STRING)
  .then(async () => {
    console.log("Database was connected!");
    await createAdminUser();

    app.listen(SERVER_PORT, () => {
      console.log(`Server is running on: http://localhost:${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Session DEVE vir antes do CSRF
app.use(sessionConfig);

// Aplique CSRF APENAS nas rotas necessárias
app.use('/login', csrfProtection);
app.use('/validate-captcha', csrfProtection);

// Rotas públicas (sem CSRF)
app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use((req, res, next) => {
  if (req.cookies._csrf && !req.session) {
    res.clearCookie('_csrf');
  }
  next();
});

app.use((req, res, next) => {
  console.log('Headers Recebidos:', req.headers);
  next();
});

// Demais middlewares
app.use(limiter);
app.use(applySecurityHeaders);
app.use(routes);
