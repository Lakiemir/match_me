# Этап сборки
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап запуска (Nginx)
FROM nginx:stable-alpine
# Копируем собранную статику
COPY --from=build /app/dist /usr/share/nginx/html
# Копируем конфиг для поддержки React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000