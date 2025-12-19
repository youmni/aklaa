FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_BACKEND_URL
ARG VITE_DEFAULT_IMAGE_URL

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_DEFAULT_IMAGE_URL=$VITE_DEFAULT_IMAGE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]