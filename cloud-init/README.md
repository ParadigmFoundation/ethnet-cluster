# GCP `cloud-init` definitions

These `.yaml` files define `systemd` services for Ethereum clients running on container-optimized linux (COS) distros.

- `cloud-init-mainnet.yaml`: Mainnet Geth full (non-archival) node
- `cloud-init-ropsten.yaml`: Ropsten Geth full (non-archival) node
- `cloud-init-kovan.yaml`: Kovan Parity full (non-archival) node
- `cloud-init-zrx-ganache.yaml`: Ganache RPC server with 0x (V2) snapshot (see [here](https://0x.org/wiki#Ganache-Setup-Guide))

They may be passed in as `user-data` during GCP VM initialization, or can be provided as metadata during initialization with the Google Cloud SDK. Authentication required. 

_Below copied from top-level README._

## Deploy a VM

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