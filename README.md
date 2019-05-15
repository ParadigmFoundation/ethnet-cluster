# `ethnet-cluster`
Service (and Docker) definitions (via `cloud-init`) for Geth clusters on GCP. All services run as Docker containers. Provides simple healthcheck image (`geth-healthcheck`) and an example `Caddyfile` demonstrating a reverse proxy router/load-balancer. 

## Access

Currently available endpoints (TLS required for all endpoints):

### Mainnet (ID 1)

- __HTTPS:__  `https://ethnet.zaidan.io/mainnet`
- __WSS:__  `wss://ethnet.zaidan.io/ws/mainnet`   

### Ropsten (ID 3)

- __HTTPS:__  `https://ethnet.zaidan.io/ropsten`
- __WSS:__  `wss://ethnet.zaidan.io/ws/ropsten`  

### Kovan (ID 3)

- __HTTPS:__  `https://ethnet.zaidan.io/kovan`
- __WSS:__  `wss://ethnet.zaidan.io/ws/kovan`   

## Development

### Deploy VM

You can use the `cloud-init` definitions provided to quickly launch mainnet or ropsten `geth` nodes. You will need to configure services to provided RPC access via a VPN. 

```bash
gcloud compute \
    --project ${PROJECT_ID} \
    instances create ${INSTANCE_NAME} \
    --image IMAGE_NAME \
    --metadata-from-file user-data=cloud-init-mainnet.yaml \
    --zone ${ZONE_ID} \
    --machine-type ${INSTANCE_TYPE}
```

You can also use a pre-defined template used in the `zaidan-eth-net` project.

```bash
gcloud compute \
    --project zaidan-eth-net \
    instances create ${INSTANCE_NAME} \
    --source-instance-template {ropsten-geth-template | mainnet-geth-template}
```

See [the docs](https://cloud.google.com/container-optimized-os/docs/how-to/create-configure-instance) for more details.

### Deploy image

Build (and deploy) a new healthcheck image to `gcr.io` with the following command. Requires authentication via Google Cloud SDK.

```bash
yarn publish:health_check
```

### Build locally

You can build the `geth-healthcheck` image for use locally as well. The image will be tagged according to the config provided in `package.json`.

```bash
yarn build:health_check
```
