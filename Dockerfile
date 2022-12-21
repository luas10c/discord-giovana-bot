FROM node:18-alpine as builder

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run generate

RUN npm run build


FROM node:18-alpine as production

WORKDIR /usr/app

RUN npm install prisma -g

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/node_modules ./node_modules

CMD ["npm", "start"]