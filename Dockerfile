FROM node:slim
WORKDIR /app 
COPY package.json .
RUN apt-get update\
    && apt-get install python3 autoconf automake g++ libtool build-essential libtool-bin -y
RUN npm install --legacy-peer-deps\
    && npm install -g typescript
COPY . . 
RUN tsc
CMD ["npm", "run", "start"]