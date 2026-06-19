FROM node:26 AS base
WORKDIR /app
COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm@$(node -p "require('./package.json').packageManager.split('@')[1]")
RUN pnpm fetch
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

FROM node:26-alpine AS final
WORKDIR /app
COPY --from=build /app/build build
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json .
CMD ["node", "build"]
