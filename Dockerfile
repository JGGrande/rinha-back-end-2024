FROM node:18.12.1-alpine

COPY . .
RUN npm install

RUN npm install -g forever

CMD ["node", "index.js"]