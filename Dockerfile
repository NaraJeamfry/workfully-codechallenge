FROM node as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run clean
RUN npm run build

FROM node:slim

# Default to PROD environment. Add env var for local or test.
ENV NODE_ENV production
ENV APP_ENV production
# Default port for the server
ENV PORT 3300

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --production

USER node

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3300
CMD [ "node", "dist/app/main.js" ]
