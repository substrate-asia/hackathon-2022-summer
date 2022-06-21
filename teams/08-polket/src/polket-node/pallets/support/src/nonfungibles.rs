// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use codec::{Decode, Encode, FullCodec};
use frame_support::{
	dispatch::DispatchResult, traits::tokens::nonfungibles::Inspect, RuntimeDebug,
};
use scale_info::TypeInfo;
use sp_std::fmt::Debug;

#[derive(Encode, Decode, Clone, Eq, PartialEq, RuntimeDebug, TypeInfo)]
pub struct PaidApproval<AssetId, Balance> {
	pub mint_amount: u32,
	pub mint_cost: Option<(AssetId, Balance)>,
}

/// Trait for providing an interface for multiple classes of NFT-like approvals.
pub trait Approval<AccountId>: Inspect<AccountId> {
	type ApprovalInfo: FullCodec + Clone + Debug + TypeInfo;

	// Check the approval info approved by an NFT class to be minted by a delegate
	fn allowance_mint(class: Self::ClassId, delegate: &AccountId) -> Option<Self::ApprovalInfo>;

	// Aprove a delegate account to mint an `instance` of `class` owned by an NFT class owner
	fn approve_mint(
		class: Self::ClassId,
		operator: &AccountId,
		delegate: &AccountId,
		approval: Self::ApprovalInfo,
	) -> DispatchResult;

	// Mint some asset `instance` of `class` from a delegate approved by the owner of the NFT
	fn mint_from(_class: Self::ClassId, delegate: &AccountId, _who: &AccountId) -> Result<Self::InstanceId, sp_runtime::DispatchError>;

	// Get the class owner
	fn owner(
		class: &Self::ClassId,
	) -> Option<AccountId>;
}
