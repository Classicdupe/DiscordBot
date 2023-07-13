FROM node:slim
WORKDIR /app 
COPY package.json .
RUN npm install --legacy-peer-deps\
    && npm install -g typescript
COPY . . 
RUN tsc
CMD ["npm", "run", "start"]