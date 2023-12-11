FROM node as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run clean
RUN npm run build

FROM node:slim

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --production

USER node

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3300
CMD [ "node", "dist/app/main.js" ]
