// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

#![cfg_attr(not(feature = "std"), no_std)]
#![allow(clippy::unused_unit)]

use frame_support::{pallet_prelude::*, traits::Currency, transactional};
use frame_system::pallet_prelude::*;
pub use pallet::*;
use pallet_identity::{IdentityInfo, Judgement, RegistrarIndex, WeightInfo};
use pallet_support::identity::{IdentityRole, IdentitySupport};
use sp_runtime::traits::StaticLookup;
use sp_std::prelude::*;

#[cfg(test)]
mod tests;

#[cfg(test)]
mod mock;

type BalanceOf<T> = <<T as pallet_identity::Config>::Currency as Currency<
	<T as frame_system::Config>::AccountId,
>>::Balance;

#[frame_support::pallet]
pub mod pallet {
	use super::*;

	#[pallet::config]
	pub trait Config: frame_system::Config + pallet_identity::Config {
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
	}

	#[pallet::pallet]
	#[pallet::generate_store(pub (super) trait Store)]
	pub struct Pallet<T>(_);

	#[pallet::storage]
	#[pallet::getter(fn get_account_roles)]
	pub type AccountRoles<T: Config> =
		StorageMap<_, Blake2_128Concat, T::AccountId, (IdentityRole, bool), OptionQuery>;

	#[pallet::event]
	#[pallet::generate_deposit(pub (super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// IdentityRoleSet 身份额外新已设置事件, [who, identity_info, role]
		IdentityRoleSet(T::AccountId, IdentityInfo<T::MaxAdditionalFields>, IdentityRole),

		/// IdentityRoleReviewed 身份认证已审核事件, [target, reviewer, is_approve,
		/// judgement, reason]
		IdentityRoleReviewed(
			T::AccountId,
			T::AccountId,
			bool,
			Judgement<BalanceOf<T>>,
			Option<Vec<u8>>,
		),
	}

	#[pallet::error]
	pub enum Error<T> {
		/// Error names should be descriptive.
		NoneValue,
		/// Errors should have helpful documentation associated with them.
		StorageOverflow,
		/// the identity of account is not existed.
		IdentityNotExisted,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// set_identity_role 角色身份认证
		/// 底层是通过pallet-identity的set_identity方法注册身份信息
		/// - origin AccountId 请求者
		/// - info Box<IdentityInfo> 身份信息
		/// - role IdentityRole 身份角色
		#[pallet::weight( <T as pallet_identity::Config>::WeightInfo::set_identity(
			T::MaxRegistrars::get().into(), // R
			T::MaxAdditionalFields::get().into(), // X
		))]
		pub fn set_identity_role(
			origin: OriginFor<T>,
			info: Box<IdentityInfo<T::MaxAdditionalFields>>,
			role: IdentityRole,
		) -> DispatchResultWithPostInfo {
			let sender = ensure_signed(origin.clone())?;
			let result = pallet_identity::Pallet::<T>::set_identity(origin, info.clone())?;
			AccountRoles::<T>::insert(sender.clone(), (role.clone(), false));
			Self::deposit_event(Event::IdentityRoleSet(sender, *info, role));
			Ok(result)
		}

		/// review_identity_role 审核身份认证
		/// 底层是通过pallet-identity的provide_judgement方法完成身份审核
		/// - origin AccountId 请求者
		/// - reg_index RegistrarIndex 审核者索引
		/// - target AccountId 被审核的账户
		/// - is_approve bool 是否通过
		/// - judgement Judgement 身份裁定级别
		/// - reason Option<Vec<u8>> 不通过原因
		#[pallet::weight(<T as pallet_identity::Config>::WeightInfo::provide_judgement(
			T::MaxRegistrars::get().into(), // R
			T::MaxAdditionalFields::get().into(), // X
		))]
		#[transactional]
		pub fn review_identity_role(
			origin: OriginFor<T>,
			reg_index: RegistrarIndex,
			target: <T::Lookup as StaticLookup>::Source,
			is_approve: bool,
			judgement: Judgement<BalanceOf<T>>,
			reason: Option<Vec<u8>>,
		) -> DispatchResultWithPostInfo {
			let reviewer = ensure_signed(origin.clone())?;
			let target_select = T::Lookup::lookup(target.clone())?;
			let mut acc_role = Self::get_account_roles(target_select.clone())
				.ok_or(Error::<T>::IdentityNotExisted)?;

			if is_approve {
				acc_role.1 = true;
				AccountRoles::<T>::insert(target_select.clone(), &acc_role);
			} else {
				AccountRoles::<T>::remove(target_select.clone());
			}

			let result = pallet_identity::Pallet::<T>::provide_judgement(
				origin, reg_index, target, judgement,
			)?;

			Self::deposit_event(Event::IdentityRoleReviewed(
				target_select,
				reviewer,
				is_approve,
				judgement,
				reason,
			));

			Ok(result)
		}
	}
}

impl<T: Config> IdentitySupport<T::AccountId> for Pallet<T> {
	fn get_identity_role(account: &T::AccountId) -> IdentityRole {
		let mut role = IdentityRole::None;
		let acc_role = Self::get_account_roles(account).unwrap_or((IdentityRole::None, false));
		if acc_role.1 {
			role = acc_role.0;
		}
		if role == IdentityRole::None {
			// check role of super
			if let Some(super_account) = Self::get_super_of(account) {
				role = Self::get_identity_role(&super_account);
			}
		}

		role
	}

	fn get_super_of(account: &T::AccountId) -> Option<T::AccountId> {
		pallet_identity::Pallet::<T>::super_of(account).map(|x| x.0)
	}

	fn get_subs_of(account: &T::AccountId) -> Vec<T::AccountId> {
		let subs = pallet_identity::Pallet::<T>::subs_of(account).1;
		subs.into()
	}

	fn is_have_relationship(sub: &T::AccountId, parent: &T::AccountId) -> bool {
		if sub == parent {
			true
		} else {
			if let Some(parent_of_sub) = pallet_identity::Pallet::<T>::super_of(sub).map(|x| x.0) {
				&parent_of_sub == parent
			} else {
				false
			}
		}
	}
}
