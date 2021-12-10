FROM node:14.17.6

# ENV NODE_ENV=production

WORKDIR /face-app-api

RUN npm install

# RUN npm install --production

COPY . .

CMD [ "npm start" ]
