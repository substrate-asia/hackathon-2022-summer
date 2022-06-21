// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use codec::{Decode, Encode};
use frame_support::{traits::tokens::nonfungibles::Inspect, RuntimeDebug};
use scale_info::TypeInfo;
use sp_core::H256;
use sp_std::vec::Vec;

#[derive(Eq, PartialEq, Copy, Clone, RuntimeDebug, Encode, Decode, TypeInfo)]
pub enum CouponType {
	/// Satisfy the quota buckle amount.
	Reduce,
	/// Meet the quota and return cash.
	Return,
}

impl Default for CouponType {
	fn default() -> Self {
		CouponType::Reduce
	}
}

#[derive(Encode, Decode, Default, Clone, Eq, PartialEq, RuntimeDebug, TypeInfo)]
pub struct CouponInfo<AssetId, Balance, BlockNumber> {
	pub coupon_type: CouponType,
	pub asset_id: AssetId,
	pub suffice: Balance,
	pub value: Balance,
	pub max_issued: u32,
	pub issued: u32,
	pub period: BlockNumber,
	pub start: BlockNumber,
	pub permit_pk: Option<H256>,
	pub nonce: u64,
	pub support_overlay: bool,
}

pub trait CouponsHandler<AccountId>: Inspect<AccountId> {
	type AssetId;
	type Balance;

	/// Return if a `ClassId` coupon payment with a specific asset.
	fn payment_asset(class: &Self::ClassId) -> Option<Self::AssetId>;

	/// try_use_coupons
	/// Try to use the coupon, check if the coupon is available and if the owner has it
	/// call `f: FnOnce(bool, Self::Balance)`, pass (is_can_use, discounted_price)
	/// if `f()` return ok, handling the final recycling logic of coupons
	fn try_use_coupons<R, E: From<&'static str>, F: FnOnce(bool, Self::Balance, Vec<(&Self::ClassId, &Self::InstanceId, &AccountId)>) -> Result<R, E>>(
		coupons: Vec<(Self::ClassId, Self::InstanceId)>,
		owner: &AccountId,
		payment: (Self::AssetId, Self::Balance),
		target: &AccountId,
		f: F,
	) -> Result<R, E>;
}
