FROM node:latest

EXPOSE 8083
ENV ENV=production

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY . .

RUN npm i typescript pm2 -g
RUN npm i @prisma/client -g
RUN npx prisma generate 

RUN npm run build

#RUN npx prisma migrate resolve
#RUN npx prisma migrate dev --name init
#RUN npx prisma db ./prisma/seed --preview-feature
#RUN npx prisma migrate resolve --applied "prisma-preview" --preview-feature
#RUN npx prisma db seed

RUN npm i
COPY . .
RUN tsc

CMD [ "node", "./dist/src/server.js" ]