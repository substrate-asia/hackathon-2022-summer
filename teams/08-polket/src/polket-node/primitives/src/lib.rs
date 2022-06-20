// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

#![cfg_attr(not(feature = "std"), no_std)]
#![allow(clippy::unnecessary_cast)]

use sp_runtime::{
	generic,
	traits::{BlakeTwo256, IdentifyAccount, Verify},
	MultiSignature,
};

// #[cfg(test)]
// mod tests;

/// An index to a block.
pub type BlockNumber = u32;

/// Alias to 512-bit hash when used in the context of a transaction signature on
/// the chain.
pub type Signature = MultiSignature;

/// Alias to the public key used for this chain, actually a `MultiSigner`. Like
/// the signature, this also isn't a fixed size when encoded, as different
/// cryptos have different size public keys.
pub type AccountPublic = <Signature as Verify>::Signer;

/// Alias to the opaque account ID type for this chain, actually a
/// `AccountId32`. This is always 32 bytes.
pub type AccountId = <AccountPublic as IdentifyAccount>::AccountId;

/// The type for looking up accounts. We don't expect more than 4 billion of
/// them.
pub type AccountIndex = u32;

/// Index of a transaction in the chain. 32-bit should be plenty.
pub type Index = u32;

/// A hash of some data used by the chain.
pub type Hash = sp_core::H256;

/// An instant or duration in time.
pub type Moment = u64;

/// Counter for the number of eras that have passed.
pub type EraIndex = u32;

/// Balance of an account.
pub type Balance = u128;

/// Signed version of Balance
pub type Amount = i128;

/// Auction ID
pub type AuctionId = u32;

/// Share type
pub type Share = u128;

/// The address format for describing accounts.
// pub type Address = sp_runtime::MultiAddress<AccountId, ()>;
pub type Address = sp_runtime::MultiAddress<AccountId, ()>;

/// Block header type as expected by this runtime.
pub type Header = generic::Header<BlockNumber, BlakeTwo256>;

/// Block type as expected by this runtime.
pub type Block = generic::Block<Header, UncheckedExtrinsic>;

/// A Block signed with a Justification
pub type SignedBlock = generic::SignedBlock<Block>;

/// BlockId type as expected by this runtime.
pub type BlockId = generic::BlockId<Block>;

/// Digest item type.
pub type DigestItem = generic::DigestItem<Hash>;

/// Opaque, encoded, unchecked extrinsic.
pub use sp_runtime::OpaqueExtrinsic as UncheckedExtrinsic;

/// Asset ID for generic asset module.
pub type AssetId = u64;

/// NFT class id for uniques
pub type ClassId = u64;

/// NFT instance id for uniques
pub type InstanceId = u64;

/// 4 length of byte
pub type Byte4 = [u8; 4];

/// 8 length of byte
pub type Byte8 = [u8; 8];

/// 16 length of byte
pub type Byte16 = [u8; 16];

/// 32 length of byte
pub type Byte32 = [u8; 32];

/// 64 length of byte
pub type Byte64 = [u8; 64];

/// 128 length of byte
pub type Byte128 = [u8; 128];

/// Evm Address.
pub type EvmAddress = sp_core::H160;
