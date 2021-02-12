FROM node:12.20.1

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build
EXPOSE 5000

CMD [ "npm", "start" ]

# docker build -t leo/catalogue:v1 .
