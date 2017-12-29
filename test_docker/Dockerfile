FROM node:8-alpine

WORKDIR /usr/src/judge-test

COPY package.json .
COPY package-lock.json .

RUN npm install -D

COPY . .

ENV JUDGEAPI_PORT=3737
ENV JUDGEAPI_HOST=api
ENV DEBUG=test:*

CMD ["npm", "run", "test"]