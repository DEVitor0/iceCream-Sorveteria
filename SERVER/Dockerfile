FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8443

CMD ["npx", "nodemon", "server.js"]
