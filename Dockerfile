FROM node:18-alpine as builder

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as production

WORKDIR /usr/app

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/package.json .

RUN npm install --omit=dev

CMD ["npm", "start"]