FROM node:20-alpine AS development

RUN npm install -g pnpm

WORKDIR /home/app

# Copy local npm dependency outside project dir (via additional_contexts)
COPY --from=tomo-idv-client-node . /deps/tomo-idv-client-node/

# Copy all source
COPY typescript/ .
COPY test-board/ /home/app/test-board/

# Fix file: dependency path for Docker context, then install
RUN sed -i 's|file:../../tomo-idv-client-node|file:/deps/tomo-idv-client-node|' package.json
RUN pnpm install

RUN pnpm build

ENV TEST_BOARD_PATH=/home/app/test-board/test-board.html
EXPOSE 3000

CMD ["pnpm", "start:prod"]


FROM node:20-alpine AS production

RUN npm install -g pnpm

WORKDIR /home/app

COPY --from=development /home/app/package.json ./package.json
COPY --from=development /home/app/pnpm-lock.yaml ./pnpm-lock.yaml

# tomo-idv-client-node needed for pnpm install --prod
COPY --from=development /deps/tomo-idv-client-node /deps/tomo-idv-client-node

RUN pnpm install --prod

COPY --from=development /home/app/dist ./dist
COPY --from=development /home/app/test-board ./test-board

EXPOSE 3000

CMD ["pnpm", "start:prod"]
