FROM node:alpine 
WORKDIR /app 
COPY package.json .
RUN npm install\
    && npm install -g typescript
COPY . . 
RUN tsc
CMD ["npm", "run", "start"]