FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps || npm install
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
EXPOSE 3001
CMD sh -c "npm run prisma:generate && npm run prisma:push && npm run dev"

