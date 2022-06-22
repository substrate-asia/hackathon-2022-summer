use super::*;
use crate::mock::*;
use frame_support::{assert_ok, traits::ConstU32, BoundedVec};
use frame_system::Call;
use sp_core::{
	offchain::{testing, OffchainWorkerExt, TransactionPoolExt},
	sr25519::Public,
};
use sp_keystore::{testing::KeyStore, KeystoreExt};
use std::sync::Arc;

#[test]
fn create_trigger_should_work() {
	new_test_ext().execute_with(|| {
		// pub enum Triger {
		// 	Timer(u64, u64),    //insert_time,  timer_seconds
		// 	Schedule(u64, u64), //insert_time,  timestamp
		// 	PriceGT(u64, u64),  //insert_time,  price   //todo,price use float
		// 	PriceLT(u64, u64),  //insert_time,  price   //todo,price use float
		// }

		let timer = Triger::Timer(1, 1);
		let schedule = Triger::Schedule(2, 2);
		let price_gt = Triger::PriceGT(3, 3);
		let price_lt = Triger::PriceLT(4, 4);
		// Dispatch a signed extrinsic.
		assert_ok!(DiftttModule::create_triger(Origin::signed(Public::from_raw([0; 32])), timer)); 
		assert_ok!(DiftttModule::create_triger(
			Origin::signed(Public::from_raw([0; 32])),
			schedule
		)); 
		assert_ok!(DiftttModule::create_triger(
			Origin::signed(Public::from_raw([0; 32])),
			price_gt
		)); 
		assert_ok!(DiftttModule::create_triger(
			Origin::signed(Public::from_raw([0; 32])),
			price_lt
		)); 
	});
}

#[test]
fn create_action_should_work() {
	new_test_ext().execute_with(|| {
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
		let a_u8_const32: BoundedVec<u8, ConstU32<32>> = vec![1, 2, 3].try_into().unwrap();
		let b_u8_const128: BoundedVec<u8, ConstU32<128>> = vec![4, 5, 6].try_into().unwrap();
		let oracle = Action::Oracle(a_u8_const32, b_u8_const128);
		// Dispatch a signed extrinsic.
		assert_ok!(DiftttModule::create_action(
			Origin::signed(Public::from_raw([0; 32])),
			mail_with_token
		)); 
		assert_ok!(DiftttModule::create_action(Origin::signed(Public::from_raw([0; 32])), oracle)); 
	});
}

#[test]
fn create_recipe_should_work() {
	new_test_ext().execute_with(|| {
		let timer = Triger::Timer(1, 1);
		assert_ok!(DiftttModule::create_triger(Origin::signed(Public::from_raw([0; 32])), timer)); 

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
		assert_ok!(DiftttModule::create_action(
			Origin::signed(Public::from_raw([0; 32])),
			mail_with_token
		));

		assert_ok!(DiftttModule::create_recipe(Origin::signed(Public::from_raw([0; 32])), 0, 0));
		
	});
}

#[test]
fn turn_on_recipe_should_work() {
	new_test_ext().execute_with(|| {
		let timer = Triger::Timer(1, 1);
		assert_ok!(DiftttModule::create_triger(Origin::signed(Public::from_raw([0; 32])), timer)); 

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
		assert_ok!(DiftttModule::create_action(
			Origin::signed(Public::from_raw([0; 32])),
			mail_with_token
		)); 

		assert_ok!(DiftttModule::create_recipe(Origin::signed(Public::from_raw([0; 32])), 0, 0)); 

		assert_ok!(DiftttModule::turn_on_recipe(Origin::signed(Public::from_raw([0; 32])), 0));

	});
}

#[test]
fn turn_off_recipe_should_work() {
	new_test_ext().execute_with(|| {
		let timer = Triger::Timer(1, 1);
		assert_ok!(DiftttModule::create_triger(Origin::signed(Public::from_raw([0; 32])), timer)); 

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
		assert_ok!(DiftttModule::create_action(
			Origin::signed(Public::from_raw([0; 32])),
			mail_with_token
		)); 

		assert_ok!(DiftttModule::create_recipe(Origin::signed(Public::from_raw([0; 32])), 0, 0)); 

		assert_ok!(DiftttModule::turn_off_recipe(Origin::signed(Public::from_raw([0; 32])), 0));
		
	});
}

#[test]
fn del_recipe_should_work() {
	new_test_ext().execute_with(|| {
		let timer = Triger::Timer(1, 1);
		assert_ok!(DiftttModule::create_triger(Origin::signed(Public::from_raw([0; 32])), timer)); 

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
		assert_ok!(DiftttModule::create_action(
			Origin::signed(Public::from_raw([0; 32])),
			mail_with_token
		)); 

		assert_ok!(DiftttModule::create_recipe(Origin::signed(Public::from_raw([0; 32])), 0, 0)); 

		assert_ok!(DiftttModule::turn_off_recipe(Origin::signed(Public::from_raw([0; 32])), 0));

	});
}
