const express = require('express');
const request = require('request');
const uuid = require("uuid/v4");
const ld = require('lodash');

const healthCheck = express();

const ETHERSCAN_URL_MAINNET = "https://api.etherscan.io/api?module=proxy&action=eth_blockNumber";
const ETHERSCAN_URL_ROPSTEN = "https://api-ropsten.etherscan.io/api?module=proxy&action=eth_blockNumber";

const REQ_URL = process.env.ROPSTEN === "true" ?
    ETHERSCAN_URL_ROPSTEN :
    ETHERSCAN_URL_MAINNET;

healthCheck.get('/*', (req, res) => {
    request.get(REQ_URL, { timeout: 2000 }, (err, _, body) => {
        // get best block from etherscan
        let bestBlock = 0x0;
        try {
            const parsed = JSON.parse(body)
            blockNumHex = parsed.result ? parsed.result : "0x0";
            bestBlock = parseInt(blockNumHex, 16);
        } catch (error) {
            console.error(`Etherscan request failed: ${error.message}`);
            return res.sendStatus(500);
        }
    
        // get best block from our node
        const reqId = uuid();
        const req = {
            jsonrpc: "2.0",
            id: reqId,
            method: "eth_blockNumber",
            params: []
        };
    
        const reqOpts = {
            uri: "http://geth:8545",
            method: "POST",
            json: req
        }

        request.post(reqOpts, (nodeErr, nodeRes, nodeBody) => {

            if (nodeErr) {
                res.sendStatus(500);
                return
            }

            if (ld.isEmpty(nodeBody)) {
                res.sendStatus(501);
                return
            }

            if (!nodeBody.id || !nodeBody.id === reqId) {
                res.sendStatus(502);
                return
            }

            if (!nodeBody.result || ld.isEmpty(nodeBody.result)) {
                res.sendStatus(503);
                return
            }

            const nodeBlock = parseInt(nodeBody.result, 16);
            if (Math.abs(nodeBlock - bestBlock) < 8) {
                res.status(200).send({
                    nodeBlock,
                    etherscanBlock: bestBlock
                });
                return;
            } else {
                res.sendStatus(504);
                return;
            }
        });
    });
});

healthCheck.listen(3000, process.env.HOSTNAME, () => {
    console.log(`Health check started on port ${process.env.HOSTNAME}:3000`);
});