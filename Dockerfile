FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8000

EXPOSE 8000

#RUN apt-get update && apt-get install -y nginx
#COPY ./project-to-test ./project-to-test
#COPY ./project-to-test/nginx.conf /etc/nginx/nginx.conf

CMD npm start