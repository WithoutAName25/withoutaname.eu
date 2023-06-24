FROM node:20 AS base
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY .npmrc package.json ./
RUN pnpm install --offline

FROM base AS dev
COPY . .

FROM dev as lint
RUN pnpm run lint

FROM dev as check
RUN pnpm run check

FROM dev AS unittest
RUN pnpm run test:unit:ci

FROM base AS e2etest
COPY playwright.config.ts ./
RUN pnpm run playwright:install:withDebs
COPY . .
RUN pnpm run test:e2e

FROM dev AS build
RUN pnpm run build

FROM node:20-alpine AS final
WORKDIR /app
COPY --from=build /app/build build
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json .
CMD node build
