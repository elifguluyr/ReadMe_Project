# Aşama 1: Build (Derleme)
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Aşama 2: Serve (Sunma)
FROM nginx:alpine
# Kendi nginx ayarımızı konteynere kopyalayalım
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Derlenmiş dosyaları nginx'in sunacağı klasöre kopyalayalım
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
