FROM node:18 AS base
WORKDIR /app
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH "$PATH:/root/.bun/bin"
COPY package.json bun.lockb ./
RUN bun install
COPY . .

FROM base as lint
RUN bun run lint

FROM base as check
RUN bun run check

FROM base AS unittest
RUN bun run test:unit:ci

FROM base AS e2etest
RUN bun run playwright:install:withDebs
RUN bun run test:e2e

FROM base AS build
RUN bun run build

FROM node:18 AS final
WORKDIR /app
COPY docker/package.json .
COPY --from=build /app/build build
CMD node build
