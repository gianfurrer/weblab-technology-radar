FROM node:21-alpine
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/out/index.html" ]
