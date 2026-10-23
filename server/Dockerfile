FROM node:24-alpine
WORKDIR /app
COPY --chown=node:node server ./server
COPY --chown=node:node src/data/timeServers.json ./src/data/timeServers.json
ENV HOST=0.0.0.0 PORT=3100
USER node
EXPOSE 3100
CMD ["node", "server/time-gateway.mjs"]
