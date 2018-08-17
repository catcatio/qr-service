#!/bin/bash

npm i --production
pm2-runtime start pm2.json --web ${PM2_PORT}