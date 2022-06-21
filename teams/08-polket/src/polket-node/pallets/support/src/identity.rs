// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use codec::{Decode, Encode};
use frame_support::RuntimeDebug;
use scale_info::TypeInfo;
use sp_std::{fmt, prelude::*};

#[derive(Clone, Eq, PartialEq, RuntimeDebug, Encode, Decode)]
pub enum IdentityExtraField {
	None,
	Role,
	Display,
	Web,
	Legal,
	Email,
	Avatar,
	Wechat,
	Weibo,
	Twitter,
	Tiktok,
	Bilibili,
	Youtube,
}

impl Default for IdentityExtraField {
	fn default() -> Self {
		Self::None
	}
}

impl fmt::Display for IdentityExtraField {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "{:?}", self)
	}
}

#[derive(Clone, Eq, PartialEq, RuntimeDebug, Encode, Decode, TypeInfo)]
pub enum IdentityRole {
	None,
	Producer,
	Exchange,
	Audit,
}

impl Default for IdentityRole {
	fn default() -> Self {
		Self::None
	}
}

impl fmt::Display for IdentityRole {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "{:?}", self)
	}
}

pub trait IdentitySupport<AccountId> {
	/// get account's role of identity
	fn get_identity_role(account: &AccountId) -> IdentityRole;
	/// get account parent account
	fn get_super_of(account: &AccountId) -> Option<AccountId>;
	/// get account sub accounts
	fn get_subs_of(account: &AccountId) -> Vec<AccountId>;
	/// check sub and parent relationship
	fn is_have_relationship(sub: &AccountId, parent: &AccountId) -> bool;
}

pub trait RoleValue {
	/// The actual value represented by the impl'ing type.
	const VALUE: IdentityRole;
}
pub struct IdentityRoleProducer;
impl RoleValue for IdentityRoleProducer {
	const VALUE: IdentityRole = IdentityRole::Producer;
}

pub struct IdentityRoleExchange;
impl RoleValue for IdentityRoleExchange {
	const VALUE: IdentityRole = IdentityRole::Exchange;
}

pub struct IdentityRoleAudit;
impl RoleValue for IdentityRoleAudit {
	const VALUE: IdentityRole = IdentityRole::Audit;
}
