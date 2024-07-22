FROM node:lts-buster
RUN git clone https://github.com/Kiranxer/DevilSer-MD /root/Devil-MD
WORKDIR /root/Devil-MD
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*
RUN npm install
CMD ["npm", "start"]
EXPOSE 3000
