FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/*.html ./
COPY --from=builder /app/*.css ./
COPY --from=builder /app/*.js ./
COPY --from=builder /app/components ./js/components/
COPY --from=builder /app/assets ./assets/
COPY --from=builder /app/node_modules ./node_modules/

EXPOSE 80