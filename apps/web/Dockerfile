# build stage
FROM node:20-bullseye-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# runtime (nginx)
FROM nginx:alpine AS runtime
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
# optional: copy custom nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
