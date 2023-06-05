FROM node:latest
WORKDIR /app
COPY . .
RUN npm install --force
EXPOSE 3000
CMD ["node", "index.js"]