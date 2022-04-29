FROM node:14.18.1
ENV NODE_ENV=production

WORKDIR /node-todo

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD [ "node", "./src/index.js" ]