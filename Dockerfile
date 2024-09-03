FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript ts-node

COPY . .

RUN tsc

# EXPOSE 4000
# EXPOSE 5000

CMD ["ts-node", "src/index.ts"]