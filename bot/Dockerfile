FROM node:20.17.0

RUN apt-get update -y

RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libtool \
    autoconf \
    automake \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home/node/app
COPY ./package.json .

RUN npm i -g pnpm typescript
RUN pnpm i

COPY . .

CMD [ "pnpm", "run", "dev" ]
