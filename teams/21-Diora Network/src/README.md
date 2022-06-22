# Diora Network

https://user-images.githubusercontent.com/49777543/168764160-121147ce-78c3-4e77-a020-5e03df8e6e06.mp4

Diora Network is a incentivised smart contract parachain, utilizing advanced PoSM with Double Validation & Randomization for security guarantees

## Devnet Chain Specs

The Devnet is a public early access testnet to validate the technical architecture and security of our blockchain in a setting that is as realistic as possible.

Chain ID
```
201
```
RPC

```
https://testnet.diora.network/
```

## Launch a local setup including a Relay Chain and a Parachain

* polkadot & diora
```
# Compile Polkadot
git clone https://github.com/paritytech/polkadot
git checkout release-v0.9.20
cargo build --release

# Compile Diora
https://github.com/Diora-Network/Diora
cargo build --release
```
By shell 

```
cd script
bash ./build.sh
bash ./start-all.sh
# log
tail -f data/log.2022

# stop-all and remove data
bash ./stop-all.sh
```
After the relay chain produces 10 blocks, the parachain starts producing blocks

# Launch the multi-chain
```
polkdot-launch ./diora/polkadot-launch/config.json



