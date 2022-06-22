use ethers::prelude::U256;
use ethers::signers::LocalWallet;
use hex_literal::hex;
use secp256k1::SecretKey;
use serde::{Deserialize, Serialize};
use simplelog::*;
use std::time::{SystemTime, UNIX_EPOCH};
use web3::contract::{Contract, Options};

#[derive(Serialize, Deserialize, Debug)]
pub struct CoinBasePrice {
    #[serde(rename = "data")]
    data: Data,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Data {
    #[serde(rename = "assetByUuid")]
    asset_by_uuid: AssetByUuid,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AssetByUuid {
    #[serde(rename = "uuid")]
    uuid: String,

    #[serde(rename = "symbol")]
    symbol: String,

    #[serde(rename = "unitPriceScale")]
    unit_price_scale: i64,

    #[serde(rename = "latestQuote")]
    latest_quote: LatestQuote,

    #[serde(rename = "latestPercentChanges")]
    latest_percent_changes: LatestPercentChanges,

    #[serde(rename = "priceDataForHour")]
    price_data_for_hour: PriceDataFor,

    #[serde(rename = "priceDataForDay")]
    price_data_for_day: PriceDataFor,

    #[serde(rename = "priceDataForWeek")]
    price_data_for_week: PriceDataFor,

    #[serde(rename = "priceDataForMonth")]
    price_data_for_month: PriceDataFor,

    #[serde(rename = "priceDataForYear")]
    price_data_for_year: PriceDataFor,

    #[serde(rename = "priceDataForAll")]
    price_data_for_all: PriceDataFor,

    #[serde(rename = "id")]
    id: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LatestPercentChanges {
    #[serde(rename = "hour")]
    hour: f64,

    #[serde(rename = "day")]
    day: f64,

    #[serde(rename = "week")]
    week: f64,

    #[serde(rename = "month")]
    month: f64,

    #[serde(rename = "year")]
    year: f64,

    #[serde(rename = "all")]
    all: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LatestQuote {
    #[serde(rename = "baseCurrency")]
    base_currency: String,

    #[serde(rename = "quoteCurrency")]
    quote_currency: String,

    #[serde(rename = "price")]
    price: String,

    #[serde(rename = "timestamp")]
    timestamp: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PriceDataFor {
    #[serde(rename = "yAxisScalingFactor")]
    y_axis_scaling_factor: i64,

    #[serde(rename = "quotes")]
    quotes: Vec<Quote>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Quote {
    #[serde(rename = "price")]
    price: String,

    #[serde(rename = "timestamp")]
    timestamp: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CoinGeckoPrice {
    #[serde(rename = "stats")]
    stats: Vec<Vec<f64>>,

    #[serde(rename = "total_volumes")]
    total_volumes: Vec<Vec<f64>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CoinWatch {
    #[serde(rename = "success")]
    success: bool,

    #[serde(rename = "coin")]
    coin: String,

    #[serde(rename = "data")]
    data: Vec<Datum>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Datum {
    #[serde(rename = "date")]
    date: i64,

    #[serde(rename = "rate")]
    rate: f64,

    #[serde(rename = "volume")]
    volume: i64,

    #[serde(rename = "cap")]
    cap: i64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct KucoinPrice {
    #[serde(rename = "code")]
    code: String,

    #[serde(rename = "data")]
    data: KucoinData,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct KucoinData {
    #[serde(rename = "time")]
    time: i64,

    #[serde(rename = "sequence")]
    sequence: String,

    #[serde(rename = "price")]
    price: String,

    #[serde(rename = "size")]
    size: String,

    #[serde(rename = "bestBid")]
    best_bid: String,

    #[serde(rename = "bestBidSize")]
    best_bid_size: String,

    #[serde(rename = "bestAsk")]
    best_ask: String,

    #[serde(rename = "bestAskSize")]
    best_ask_size: String,
}

fn timestamp() -> u128 {
    let start = SystemTime::now();
    start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis()
}

async fn get_kucoin_price() -> Result<u64, Box<dyn std::error::Error>> {
    log::info!("Using kucoin price");
    let resp =
        reqwest::get("https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BTC-USDT")
            .await?
            .text()
            .await?;
    let price: KucoinPrice = serde_json::from_str(&resp)?;
    Ok((price.data.price.parse::<f32>()? * 10e18).round() as u64)
}

async fn get_crypto_price() -> Result<u64, Box<dyn std::error::Error>> {
    log::info!("Using coinwatch price");
    let now = timestamp();
    let resp = reqwest::get(format!("https://http-api.livecoinwatch.com/coins/history/range?coin=BTC&start={}&end={}&currency=USD",now-86400000,now))
        .await?
        .text()
        .await?;
    let price: CoinWatch = serde_json::from_str(&resp)?;
    Ok((price.data.last().unwrap().rate * 10e18).round() as u64)
}

// async fn get_coinbase_price() -> Result<u64, Box<dyn std::error::Error>> {
//     log::info!("Using coinbase price");
//     let resp = reqwest::get("https://www.coinbase.com/graphql/query?&operationName=useGetPricesForAssetPageQuery&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2259282a0565bfbdc0477f69ad3ae4b687c93d75c808445386bfbfa70be7b4a976%22%7D%7D&variables=%7B%22skip%22%3Afalse%2C%22uuid%22%3A%2271fab9a7-cf92-5a3a-a8f9-b5701eb4a7b7%22%2C%22currency%22%3A%22USD%22%7D")
//         .await?
//         .text()
//         .await?;
//     let price: CoinBasePrice = serde_json::from_str(&resp)?;
//     Ok((price.data.asset_by_uuid.latest_quote.price.parse::<f32>()? * 10e18).round() as u64)
// }

// async fn get_coin_gecko_price() -> Result<u64, Box<dyn std::error::Error>> {
//     log::info!("Using coingecko price");
//     let resp = reqwest::get("https://www.coingecko.com/price_charts/14748/usd/max.json")
//         .await?
//         .text()
//         .await?;
//     log::info!("{:?}", resp);
//     let price: CoinGeckoPrice = serde_json::from_str(&resp)?;
//     Ok((price.stats.last().unwrap().last().unwrap() * 10e18).round() as u64)
// }

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    CombinedLogger::init(vec![TermLogger::new(
        LevelFilter::Info,
        simplelog::Config::default(),
        TerminalMode::Mixed,
        ColorChoice::Auto,
    )])
    .expect("Failed to init logger");
    let now = timestamp();
    let p = match now % 2 {
        0 => get_crypto_price().await?,
        1 => get_kucoin_price().await?,
        _ => get_kucoin_price().await?,
    };
    log::info!("Got price: {}", p);
    let wallet = LocalWallet::decrypt_keystore("/eth.keystore", "VGPUmPKNtBzDvCJK")?;
    // let wallet = LocalWallet::decrypt_keystore("../web3d/key/eth.keystore", "VGPUmPKNtBzDvCJK")?;
    let transport = web3::transports::Http::new("https://mainnet-dev.deeper.network/rpc")?;
    let web3 = web3::Web3::new(transport);
    let eth = web3.eth();
    let contract = Contract::from_json(
        eth,
        hex!("297d8F72CFBD5e0908f68fa122A792e6EdeA0D2B").into(),
        include_bytes!("../abi.json"),
    )?;
    let reciept = contract
        .signed_call_with_confirmations(
            "setTokenPrice",
            (U256::from(p),),
            Options {
                gas: Some(140850_u64.into()),
                ..Options::default()
            },
            1,
            &SecretKey::from_slice(&wallet.signer().to_bytes()).unwrap(),
        )
        .await?;
    log::info!("{:?}", reciept);
    Ok(())
}
