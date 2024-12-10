FROM node

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

CMD ["node","dist/src/app.js"]
