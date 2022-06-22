#[macro_use]
extern crate rocket;

use anyhow::Result;
use base64::{decode, encode};
use core::panic;
use ethers::core::rand::thread_rng;
use ethers::prelude::k256::ecdsa::SigningKey;
use ethers::prelude::{Wallet, U256};
use ethers::signers::{LocalWallet, Signer};
use hex::FromHex;
use hex_literal::hex;
use secp256k1::SecretKey;
use serde::{Deserialize, Serialize};
use simplelog::*;
use std::default::Default;
use std::fs::{File, OpenOptions};
use std::io::{BufReader, BufWriter};
use std::path::Path;
use tokio::{join, process::Command};
use web3::contract::{Contract, Options};
use web3::{
    ethabi::{self, param_type::ParamType, Token},
    types::{BlockNumber, FilterBuilder},
};

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub operator: String,
    pub chain: String,
    pub topic: String,
    pub wallet_dir: String,
    pub wallet_filename: String,
    pub eth_key_password: String,
    pub operator_phrase: String,
    pub substrate_endpoint: String,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            operator: "5HmxV7yUHQnJYnVZVqDW2zd2qGznrvtqKLgyzFKnCS7jCAtT".into(),
            chain: "https://mainnet-dev.deeper.network/rpc".into(),
            topic: "f73572a14c820f867be454ea2eba1ec98b27da2ccc4e50373c3565b77bf6c569".into(),
            wallet_dir: "./".into(),
            wallet_filename: "eth_key".into(),
            eth_key_password: "9527".into(),
            operator_phrase:
                "boring crush turtle chronic dignity taxi glide hill exist twenty sure movie".into(),
            substrate_endpoint: "wss://mainnet-dev.deeper.network:443".into(),
        }
    }
}

impl Config {
    pub fn from_yaml(config_path: &str) -> Result<Self, std::io::Error> {
        let file = File::open(config_path)?;
        let reader = BufReader::new(file);
        Ok(serde_yaml::from_reader(reader).map_err(|e| {
            std::io::Error::new(std::io::ErrorKind::InvalidData, format!("{:?}", e))
        })?)
    }
    pub fn to_yaml(&self, config_path: &str) -> Result<(), std::io::Error> {
        let file = OpenOptions::new()
            .create(true)
            .truncate(true)
            .write(true)
            .open(config_path)?;
        let writer = BufWriter::new(file);
        serde_yaml::to_writer(writer, &self).map_err(|e| {
            std::io::Error::new(std::io::ErrorKind::InvalidData, format!("{:?}", e))
        })?;
        Ok(())
    }
    pub fn ensure_config(config_path: &str) -> Result<Self, std::io::Error> {
        match Self::from_yaml(config_path) {
            Ok(config) => {
                log::info!("Restore config from {}", config_path);
                Ok(config)
            }
            Err(e) => {
                log::info!("No valid config file found, using default config");
                log::debug!("Failed to load wallet: {:?}", e);
                let config = Self::default();
                config.to_yaml(config_path)?;
                Ok(config)
            }
        }
    }
}

#[get("/<url>/<options>/<maxRunNum>")]
async fn index(url: &str, options: &str, maxRunNum: u64 ) -> String {
    let url = match decode(url) {
        Ok(v) => v,
        Err(e) => return "decode url fail".to_string(),
    };

    let options = match decode(options) {
        Ok(v) => v,
        Err(e) => return "decode options fail".to_string(),
    };

    let url = match String::from_utf8(url) {
        Ok(v) => v,
        Err(e) => return "Invalid UTF-8 sequence: url".to_string(),
    };

    let options = match String::from_utf8(options) {
        Ok(v) => v,
        Err(e) => return "Invalid UTF-8 sequence: options ".to_string(),
    };

    let t = format!("url {}  options {}!", url, options);

    let config = match Config::ensure_config("./config.yaml") {
        Err(e) => return "load config fail".to_string(),
        Ok(y) => y,
    };
    let wallet = match ensure_wallet(
        &config.wallet_dir,
        &config.wallet_filename,
        &config.eth_key_password,
    ) {
        Err(e) => return "load wallet fail".to_string(),
        Ok(y) => y,
    };

    let transport = match web3::transports::Http::new(&config.chain.clone()) {
        Err(e) => return "load transport fail".to_string(),
        Ok(y) => y,
    };
    let mut web3 = web3::Web3::new(transport);

    let rt = match public_task(
        web3.clone(),
        url.to_string(),
        options.to_string(),
        wallet.clone(),
    )
    .await
    {
        Ok(_) => {
            log::info!("public_task success");
        }
        Err(e) => {
            log::error!("Failed to public_task: {:?}", e);
            return "Failed to public_task".to_string();
        }
    };
    "ok".to_string()
}

#[launch]
fn rocket() -> _ {
    CombinedLogger::init(vec![TermLogger::new(
        LevelFilter::Info,
        simplelog::Config::default(),
        TerminalMode::Mixed,
        ColorChoice::Auto,
    )])
    .expect("Failed to init logger");

    rocket::build().mount("/", routes![index])
}

pub async fn public_task(
    web3: web3::Web3<web3::transports::Http>,
    url: String,
    options: String,
    self_eth_wallet: Wallet<SigningKey>,
) -> Result<(), anyhow::Error> {
    let contract = Contract::from_json(
        web3.eth(),
        hex!("60eF94dbbe8E80024Eff0693976Be26d27aEA746").into(),
        include_bytes!("../token.json"),
    )?;

    let key = &SecretKey::from_slice(&self_eth_wallet.signer().to_bytes()).unwrap();

    let result = contract
        .signed_call(
            "nNodeUnSpecifiedAddressTask",
            //(url, options),
            (
                Token::String(url),
                Token::String(options),
                Token::Uint(U256([3, 0, 0, 0])),
                Token::Uint(U256([255, 0, 0, 0])),
            ),
            Options {
                gas: Some(240850_u64.into()),
                ..Options::default()
            },
            key,
        )
        .await?;
    log::info!("Public_task tx: {:?}", result);

    Ok(())
}

/// Making sure wallet file exists and readable
fn ensure_wallet(
    wallet_dir: &str,
    wallet_filename: &str,
    password: &str,
) -> Result<LocalWallet, std::io::Error> {
    if !Path::new(wallet_dir).exists() {
        std::fs::create_dir_all(wallet_dir)?;
    }
    let key_path = Path::new(wallet_dir).join(wallet_filename);
    match LocalWallet::decrypt_keystore(&key_path, password) {
        Ok(wallet) => {
            log::info!("Restore evm wallet from key {:?}", key_path.to_str());
            Ok(wallet)
        }
        Err(e) => {
            if !key_path.exists() {
                log::info!("No existing key found, creating new evm wallet");
                let (wallet, filename) =
                    LocalWallet::new_keystore(&wallet_dir, &mut thread_rng(), password).unwrap();
                std::fs::rename(Path::new(wallet_dir).join(filename), &key_path)?;
                Ok(wallet)
            } else {
                Err(std::io::Error::new(
                    std::io::ErrorKind::InvalidData,
                    format!("{:?}", e),
                ))
            }
        }
    }
}
