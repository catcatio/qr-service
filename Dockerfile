FROM keymetrics/pm2:8-alpine

ENV NODE_ENV production
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV NPM_CONFIG_LOGLEVEL warn

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
    # ttf-opensans \
    ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

ADD assets/fonts/helvetica /usr/share/fonts/helvetica

# Install app dependencies
RUN pm2 install pm2-logrotate \
    && pm2 set pm2-logrotate:max_size 10M \
    && pm2 set pm2-logrotate:compress true \
    && pm2 set pm2-logrotate:rotateInterval '0 0 * * * *'

VOLUME ["/usr/app"]

CMD ["pm2-runtime", "start", "pm2.json"]
