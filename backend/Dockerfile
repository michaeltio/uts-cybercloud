FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN npx prisma generate

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN pnpm seed

EXPOSE 3000

CMD ["pnpm", "start"]