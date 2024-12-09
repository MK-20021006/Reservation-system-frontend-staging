FROM node:16-alpine as builder

WORKDIR /app
COPY . .

RUN yarn install
RUN NODE_OPTIONS=--max_old_space_size=14000 yarn build:store

# -------------------------------------
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

FROM node:16-alpine

WORKDIR /app
COPY --from=builder /app/src/store/.output/ .output

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

RUN apk add --no-cache tzdata
ENV TZ="Asia/Tokyo"

EXPOSE 3000

USER node

ENTRYPOINT ["node", ".output/server/index.mjs"]
