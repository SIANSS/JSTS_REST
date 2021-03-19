FROM node:12-alpine AS builder

# Create App directory
WORKDIR /home/ubuntu/5and_dollar

#Install Dependencies
COPY package*.json ./
RUN npm install --quiet

#Compile typescript to 15
COPY . .
RUN npm run dev
#Remove dev dependencies after build

#Running code under slim image
FROM node:12-alpine

## Clean new directory
WORKDIR /home/ubuntu/5and_dollar

## We just need the build and package to execute the command
COPY --from=builder /home/ubuntu/5and_dollar/dist dist
COPY --from=builder /home/ubuntu/5and_dollar/node_modules node_modules
COPY package*.json ./
COPY config config
# COPY views views
COPY ormconfig.js /
COPY tsconfig.json ./tsconfig.json

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "dist/index.js"]
