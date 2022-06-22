// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use frame_support::traits::EnsureOrigin;
use frame_system::RawOrigin;
use pallet_support::identity::{IdentitySupport, RoleValue};

pub struct EnsureIdentity<AccountId, Role, Identity>(
	sp_std::marker::PhantomData<(AccountId, Role, Identity)>,
);
impl<
		O: Into<Result<RawOrigin<AccountId>, O>> + From<RawOrigin<AccountId>>,
		Identity: IdentitySupport<AccountId>,
		Role: RoleValue,
		AccountId: Default,
	> EnsureOrigin<O> for EnsureIdentity<AccountId, Role, Identity>
{
	type Success = AccountId;
	fn try_origin(o: O) -> Result<Self::Success, O> {
		o.into().and_then(|o| match o {
			RawOrigin::Signed(who) if Identity::get_identity_role(&who) == Role::VALUE => Ok(who),
			r => Err(O::from(r)),
		})
	}

	#[cfg(feature = "runtime-benchmarks")]
	fn successful_origin() -> O {
		O::from(RawOrigin::Signed(Default::default()))
	}
}
