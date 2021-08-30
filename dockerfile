FROM jakubkriz/nodejs-alpine-python:13

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

# To handle 'not get uid/gid'
# RUN npm config set unsafe-perm true
# RUN npm install -g yarn

RUN yarn install

COPY . /app

EXPOSE 3000

CMD ["yarn", "start"]