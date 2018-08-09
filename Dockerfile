FROM alpine:edge
ENV NODE_ENV develop
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python

RUN apk --no-cache add git bash
RUN apk add --update nodejs nodejs-npm && npm install -g npm

RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango \
    pango-dev \
    giflib-dev \
    bash \
    gettext \
    librsvg \
    ghostscript \
    imagemagick \
    # for canvas-prebuilt
    pixman \
    libc6-compat \
    # defaults fonts for canvas
    ttf-opensans ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

ADD assets/fonts/helvetica /usr/share/fonts/helvetica

RUN mkdir -p /usr/app \
    && npm i -g nodemon

WORKDIR /usr/app
VOLUME ["/usr/app"]
