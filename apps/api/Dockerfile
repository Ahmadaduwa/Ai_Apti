# builder (Debian-slim) - build native modules & prisma
FROM node:20-bullseye-slim AS builder
WORKDIR /usr/src/app

# Install build deps for native modules & prisma
RUN apt-get update && apt-get install -y python3 make g++ git curl ca-certificates --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# ใช้ npm ci เพื่อ deterministic install
RUN npm ci --legacy-peer-deps

COPY prisma ./prisma
COPY . .

# generate prisma client and build
RUN npx prisma generate
RUN npm run build

# prune devDependencies to minimize
RUN npm prune --production \
    && rm -rf /root/.npm /tmp/*

# runtime
FROM node:20-bullseye-slim AS runtime
WORKDIR /usr/src/app

ENV NODE_ENV=production
# minimal runtime deps
RUN apt-get update && apt-get install -y ca-certificates curl --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/entrypoint.js ./entrypoint.js
COPY package*.json ./

EXPOSE 3001
CMD ["node", "entrypoint.js"]
