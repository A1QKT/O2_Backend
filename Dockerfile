FROM node:14.18.1

WORKDIR /node-todo

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD [ "node", "./src/index.js" ]

EXPOSE 4001