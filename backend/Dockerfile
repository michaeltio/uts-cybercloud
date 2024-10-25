FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN npx prisma generate

RUN pnpm seed

EXPOSE 3000

CMD ["pnpm", "start"]