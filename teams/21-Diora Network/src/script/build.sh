#!/bin/bash

cp ../target/release/diora .
cp ../../polkadot/target/release/polkadot .

bash ./regenerateConfig-rococo-local.sh