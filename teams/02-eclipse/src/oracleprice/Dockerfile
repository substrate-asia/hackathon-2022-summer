FROM rust:1 as builder
WORKDIR /app
COPY . .
COPY ./config $HOME/.cargo/config
RUN cargo install --path .

FROM debian:buster-slim as runner
RUN apt update && apt install -y ca-certificates
COPY --from=builder /usr/local/cargo/bin/oracle_price /bin/oracle_price
CMD ["oracle_price"]

