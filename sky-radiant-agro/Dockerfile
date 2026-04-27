FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run db:generate && npm run build

ENV NODE_ENV=production
EXPOSE 4100

CMD ["npm", "run", "start"]
