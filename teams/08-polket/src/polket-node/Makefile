.PHONY: init
init:
	./scripts/init.sh

.PHONY: check
check:
	SKIP_WASM_BUILD=1 cargo check --release

.PHONY: test
test:
	SKIP_WASM_BUILD=1 cargo test --release --all

.PHONY: run
run:
	 cargo run --release -- --dev --tmp

.PHONY: build
build:
	 cargo build --release

.PHONY: build-runtime
build-runtime:
	 cargo build --release -p polket-node-runtime

.PHONY: build-spec
build-spec:
	./target/release/polket-node build-spec --disable-default-bootnode --chain polket-node-staging > ./specs/testnet.json

.PHONY: build-spec-raw
build-spec-raw:
	./target/release/polket-node build-spec --chain=./specs/testnet.json --raw --disable-default-bootnode > ./specs/testnetRaw.json

.PHONY: benchmark
benchmark:
	cargo run --release --bin polket-node --features runtime-benchmarks -- benchmark \
	--chain dev \
	--execution wasm \
	--wasm-execution Interpreted \
	--pallet=* \
	--extrinsic=* \
	--steps 50 \
	--repeat 20 \
	--heap-pages 4096 \
	--raw \
	--output ./runtime-weights/ \
	--template ./templates/runtime-weight-template.hbs