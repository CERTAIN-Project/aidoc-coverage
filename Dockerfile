FROM node:24-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install
#RUN npm audit fix

COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM node:24-alpine AS deps

WORKDIR /usr/src/app

# COPY --from=build /usr/src/app/build ./

COPY package.json package-lock.json ./

RUN npm install --omit=dev

FROM gcr.io/distroless/nodejs24-debian13

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./
COPY package.json package-lock.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules

USER 1337:1337
ENV NODE_ENV=production
# ENTRYPOINT [ "node", "/usr/src/app/index.js" ]
CMD [ "/usr/src/app/index.js" ]