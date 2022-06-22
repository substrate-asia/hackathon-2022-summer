//! Benchmarking setup for pallet-template

use super::*;

#[allow(unused)]
use crate::Pallet as Difttt;
use frame_benchmarking::{benchmarks, whitelisted_caller, Zero};
use frame_support::{traits::ConstU32, BoundedVec};
use frame_system::RawOrigin;
use sp_std::vec;

benchmarks! {
	create_triger {
		let caller: T::AccountId = whitelisted_caller();
		let timer = Triger::Timer(1, 1);
	}: _(RawOrigin::Signed(caller.clone()), timer)
	verify {
	}

	create_action {
		let caller: T::AccountId = whitelisted_caller();
		let a_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let b_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let c_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let d_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let e_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let mail_with_token = Action::MailWithToken(
			a_u8_const128,
			b_u8_const256,
			c_u8_const128,
			d_u8_const128,
			e_u8_const256,
		);
	}: _(RawOrigin::Signed(caller.clone()), mail_with_token)
	verify {
	}

	create_recipe {
		let caller: T::AccountId = whitelisted_caller();
		let timer = Triger::Timer(1, 1);
		let a_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let b_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let c_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let d_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let e_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let mail_with_token = Action::MailWithToken(
			a_u8_const128,
			b_u8_const256,
			c_u8_const128,
			d_u8_const128,
			e_u8_const256,
		);
		Difttt::<T>::create_triger(RawOrigin::Signed(caller.clone()).into(),timer)?;
		Difttt::<T>::create_action(RawOrigin::Signed(caller.clone()).into(),mail_with_token)?;
	}: _(RawOrigin::Signed(caller), 0, 0)
	verify {
	}

	del_recipe {
		let caller: T::AccountId = whitelisted_caller();
		let timer = Triger::Timer(1, 1);
		let a_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let b_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let c_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let d_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let e_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let mail_with_token = Action::MailWithToken(
			a_u8_const128,
			b_u8_const256,
			c_u8_const128,
			d_u8_const128,
			e_u8_const256,
		);
		Difttt::<T>::create_triger(RawOrigin::Signed(caller.clone()).into(),timer)?;
		Difttt::<T>::create_action(RawOrigin::Signed(caller.clone()).into(),mail_with_token)?;
		Difttt::<T>::create_recipe(RawOrigin::Signed(caller.clone()).into(),0, 0)?;
	}: _(RawOrigin::Signed(caller), 0)
	verify {
	}

	turn_on_recipe {
		let caller: T::AccountId = whitelisted_caller();
		let timer = Triger::Timer(1, 1);
		let a_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let b_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let c_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let d_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let e_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let mail_with_token = Action::MailWithToken(
			a_u8_const128,
			b_u8_const256,
			c_u8_const128,
			d_u8_const128,
			e_u8_const256,
		);
		Difttt::<T>::create_triger(RawOrigin::Signed(caller.clone()).into(),timer)?;
		Difttt::<T>::create_action(RawOrigin::Signed(caller.clone()).into(),mail_with_token)?;
		Difttt::<T>::create_recipe(RawOrigin::Signed(caller.clone()).into(),0, 0)?;
	}: _(RawOrigin::Signed(caller), 0)
	verify {
	}

	turn_off_recipe {
		let caller: T::AccountId = whitelisted_caller();
		let timer = Triger::Timer(1, 1);
		let a_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let b_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let c_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let d_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let e_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let mail_with_token = Action::MailWithToken(
			a_u8_const128,
			b_u8_const256,
			c_u8_const128,
			d_u8_const128,
			e_u8_const256,
		);
		Difttt::<T>::create_triger(RawOrigin::Signed(caller.clone()).into(),timer)?;
		Difttt::<T>::create_action(RawOrigin::Signed(caller.clone()).into(),mail_with_token)?;
		Difttt::<T>::create_recipe(RawOrigin::Signed(caller.clone()).into(),0, 0)?;
	}: _(RawOrigin::Signed(caller), 0)
	verify {
	}

	set_recipe_done_unsigned {
		let caller: T::AccountId = whitelisted_caller();
		let timer = Triger::Timer(1, 1);
		let a_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let b_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let c_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let d_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![1, 2, 3].try_into().unwrap();
		let e_u8_const256: BoundedVec<u8, ConstU32<256>> = vec![4, 5, 6].try_into().unwrap();
		let mail_with_token = Action::MailWithToken(
			a_u8_const128,
			b_u8_const256,
			c_u8_const128,
			d_u8_const128,
			e_u8_const256,
		);
		Difttt::<T>::create_triger(RawOrigin::Signed(caller.clone()).into(),timer)?;
		Difttt::<T>::create_action(RawOrigin::Signed(caller.clone()).into(),mail_with_token)?;
		Difttt::<T>::create_recipe(RawOrigin::Signed(caller.clone()).into(),0, 0)?;
	}: _(RawOrigin::None, T::BlockNumber::zero(), 0)
	verify {
	}

	buy_token_unsigned {
		let caller: T::AccountId = whitelisted_caller();
		let buyer: T::AccountId = whitelisted_caller();
		let token_name = vec![1, 2, 3].try_into().unwrap();
	}: _(RawOrigin::None, T::BlockNumber::zero(), buyer, token_name, 0)
	verify {
	}

	impl_benchmark_test_suite!(Template, crate::mock::new_test_ext(), crate::mock::Test);
}
