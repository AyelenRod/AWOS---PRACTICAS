FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3005

ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:4045
ENV PORT=3005

CMD ["npm", "run", "dev"]
