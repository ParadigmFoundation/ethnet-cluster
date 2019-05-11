FROM node:lts
WORKDIR /workspace

# latest 0x ganache snapshot
ENV SNAPSHOT_URL http://ganache-snapshots.0x.org.s3.amazonaws.com/0x_ganache_snapshot-latest.zip
ENV DOCKER true

# ganache CLI as entrypoint (and other common deps)
RUN yarn global add scrypt node-gyp ganache-cli

# get latest 0x ganache snapshot archive
RUN wget -O ./0x_ganache_snapshot-latest.zip ${SNAPSHOT_URL}
RUN unzip ./0x_ganache_snapshot-latest.zip -d ./0x_ganache_snapshot
RUN rm ./0x_ganache_snapshot-latest.zip

EXPOSE 8545

CMD ganache-cli \
    --networkId 50 \
    --host 0.0.0.0 \
    --port 8545 \
    --mnemonic "concert load couple harbor equip island argue ramp clarify fence smart topic" \
    --db ./0x_ganache_snapshot