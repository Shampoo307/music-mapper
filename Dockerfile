FROM node

WORKDIR /usr/src/app

COPY /client/package.json /client/package.json
COPY /client/package-lock.json /client/package-lock.json
RUN cd /client && npm install
COPY /client /client
RUN cd /client && npm run build && cd ..

COPY /server/package.json /server/package.json
COPY /server/package-lock.json /server/package-lock.json
RUN cd /server && npm install
COPY /server /server

EXPOSE 3000
WORKDIR /server
CMD [ "node", "index.js" ]



