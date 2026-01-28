FROM node:22

WORKDIR /app

COPY api/package*.json ./
RUN npm install --production

COPY api/ ./

EXPOSE 3000

CMD ["npm", "start"]