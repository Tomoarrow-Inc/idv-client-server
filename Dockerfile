FROM node:20-alpine AS development

RUN npm install -g pnpm

WORKDIR /home/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start:prod"]


FROM node:20-alpine AS production

RUN npm install -g pnpm

WORKDIR /home/app

COPY --from=development /home/app/package.json ./package.json
COPY --from=development /home/app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --prod

COPY --from=development /home/app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start:prod"] 