FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY services/whatsapp-adapter/package.json services/whatsapp-adapter/package.json
COPY services/whatsapp-adapter/tsconfig.json services/whatsapp-adapter/tsconfig.json
COPY packages/bot-flow/package.json packages/bot-flow/package.json
COPY packages/bot-flow/tsconfig.json packages/bot-flow/tsconfig.json
COPY packages/bot-flow/src packages/bot-flow/src
COPY services/whatsapp-adapter/src services/whatsapp-adapter/src

RUN npm install
RUN npm run build --workspace whatsapp-adapter

FROM node:20-alpine AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/services/whatsapp-adapter/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/whatsapp-adapter/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
