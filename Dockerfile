FROM node:23 AS base
WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY .npmrc package.json ./
RUN pnpm install --offline

FROM base AS dev
COPY . .

FROM dev AS lint
CMD ["pnpm", "run", "lint"]

FROM dev AS check
CMD ["pnpm", "run", "check"]

FROM dev AS unittest
CMD ["pnpm", "run", "test:unit:ci"]

FROM base AS e2etest
COPY playwright.config.ts ./
RUN pnpm run playwright:install:withDebs
COPY . .
CMD ["pnpm", "run", "test:e2e"]

FROM dev AS build
RUN pnpm run build

FROM node:23-alpine AS final
WORKDIR /app
COPY --from=build /app/build build
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json .
CMD ["node", "build"]
