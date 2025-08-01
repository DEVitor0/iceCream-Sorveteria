FROM node:20-alpine

WORKDIR /app

RUN npm config set legacy-peer-deps true

COPY package.json package-lock.json ./

RUN npm config set registry https://registry.npmjs.org/ && \
    npm install --frozen-lockfile --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
