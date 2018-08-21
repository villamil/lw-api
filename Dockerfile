FROM node:8.11.4

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install -g typescript
RUN npm install
# If you are building your code for production
# RUN npm install --only=production


EXPOSE 3000
CMD [ "npm", "start" ]