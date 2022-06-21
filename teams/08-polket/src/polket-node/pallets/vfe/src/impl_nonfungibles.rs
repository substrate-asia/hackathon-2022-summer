// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use super::*;
use frame_support::traits::tokens::nonfungibles::*;
use sp_runtime::DispatchResult;

impl<T: Config> Inspect<T::AccountId> for Pallet<T> {
	type InstanceId = T::InstanceId;
	type ClassId = T::ClassId;

	fn owner(class: &Self::ClassId, instance: &Self::InstanceId) -> Option<T::AccountId> {
		<pallet_uniques::Pallet<T, T::UniquesInstance> as Inspect<T::AccountId>>::owner(
			class, instance,
		)
	}

	fn class_owner(class: &Self::ClassId) -> Option<T::AccountId> {
		pallet_uniques::Pallet::<T, T::UniquesInstance>::class_owner(class)
	}

	fn attribute(
		class: &Self::ClassId,
		instance: &Self::InstanceId,
		key: &[u8],
	) -> Option<Vec<u8>> {
		pallet_uniques::Pallet::<T, T::UniquesInstance>::attribute(class, instance, key)
	}

	fn class_attribute(class: &Self::ClassId, key: &[u8]) -> Option<Vec<u8>> {
		pallet_uniques::Pallet::<T, T::UniquesInstance>::class_attribute(class, key)
	}

	fn can_transfer(class: &Self::ClassId, instance: &Self::InstanceId) -> bool {
		pallet_uniques::Pallet::<T, T::UniquesInstance>::can_transfer(class, instance)
	}
}

impl<T: Config> Mutate<T::AccountId> for Pallet<T> {
	fn mint_into(
		class: &Self::ClassId,
		instance: &Self::InstanceId,
		who: &T::AccountId,
	) -> DispatchResult {
		Self::do_mint(class.clone(), instance.clone(), who.clone())
	}

	fn burn_from(class: &Self::ClassId, instance: &Self::InstanceId) -> DispatchResult {
		Self::do_burn(class.clone(), instance.clone())
	}
}

impl<T: Config> InspectEnumerable<T::AccountId> for Pallet<T> {
	/// Returns an iterator of the asset classes in existence.
	///
	/// NOTE: iterating this list invokes a storage read per item.
	fn classes() -> Box<dyn Iterator<Item = Self::ClassId>> {
		pallet_uniques::Pallet::<T, T::UniquesInstance>::classes()
	}

	/// Returns an iterator of the instances of an asset `class` in existence.
	///
	/// NOTE: iterating this list invokes a storage read per item.
	fn instances(class: &Self::ClassId) -> Box<dyn Iterator<Item = Self::InstanceId>> {
		pallet_uniques::Pallet::<T, T::UniquesInstance>::instances(class)
	}

	/// Returns an iterator of the asset instances of all classes owned by `who`.
	///
	/// NOTE: iterating this list invokes a storage read per item.
	fn owned(who: &T::AccountId) -> Box<dyn Iterator<Item = (Self::ClassId, Self::InstanceId)>> {
		pallet_uniques::Pallet::<T, T::UniquesInstance>::owned(who)
	}

	/// Returns an iterator of the asset instances of `class` owned by `who`.
	///
	/// NOTE: iterating this list invokes a storage read per item.
	fn owned_in_class(
		class: &Self::ClassId,
		who: &T::AccountId,
	) -> Box<dyn Iterator<Item = Self::InstanceId>> {
		pallet_uniques::Pallet::<T, T::UniquesInstance>::owned_in_class(class, who)
	}
}
