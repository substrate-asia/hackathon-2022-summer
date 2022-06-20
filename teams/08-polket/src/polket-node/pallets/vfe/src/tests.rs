

// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use super::*;
use crate::mock::{Event, *};
use frame_support::{assert_noop, assert_ok};
use sp_std::convert::TryInto;

macro_rules! bvec {
	($( $x:tt )*) => {
		vec![$( $x )*].try_into().unwrap()
	}
}

#[test]
fn producer_register_should_work() {
	new_test_ext().execute_with(|| {
		// Dispatch a signed extrinsic.
		assert_ok!(Sport::producer_register(Origin::signed(ALICE)));

		let account_id = Sport::into_account_id(0);

		System::assert_has_event(Event::Sport(crate::Event::ProducerRegister(ALICE, 0, account_id)));

		// wrong origin role.
		assert_noop!(
			Sport::producer_register(Origin::signed(BOB)),
			DispatchError::BadOrigin
		);
	});
}



#[test]
fn producer_owner_change_should_work() {
	new_test_ext().execute_with(|| {

		assert_ok!(Sport::producer_register(Origin::signed(ALICE)));

		// Dispatch a signed extrinsic.
		assert_ok!(Sport::producer_owner_change(Origin::signed(ALICE),0,TOM));

		let account_id = Sport::into_account_id(0);

		System::assert_has_event(Event::Sport(crate::Event::ProducerOwnerChanged(ALICE, 0, TOM)));

		// wrong origin role.
		assert_noop!(
			Sport::producer_owner_change(Origin::signed(BOB),0,ALICE),
			DispatchError::BadOrigin
		);

		// RoleInvalid.
		assert_noop!(
			Sport::producer_owner_change(Origin::signed(TOM),0,BOB),
			Error::<Test>::RoleInvalid
		);

		// Operation is not allowed for producer.
		assert_noop!(
			Sport::producer_owner_change(Origin::signed(ALICE),0,TOM),
			Error::<Test>::OperationIsNotAllowedForProducer
		);

		// producer is not exist
		assert_noop!(
			Sport::producer_owner_change(Origin::signed(TOM),1,ALICE),
			Error::<Test>::ProducerNotExist
		);

	});
}



#[test]
fn producer_charge_should_work() {
	new_test_ext().execute_with(|| {

		assert_ok!(Sport::producer_register(Origin::signed(ALICE)));

		// Dispatch a signed extrinsic.
		assert_ok!(Sport::producer_charge(Origin::signed(ALICE),0,0,100));
		//
		//
		//
		System::assert_has_event(Event::Sport(crate::Event::ProducerCharge(ALICE, 0, 0,100)));

	});
}

#[test]
fn producer_withdraw_should_work() {
	new_test_ext().execute_with(|| {

		assert_ok!(Sport::producer_register(Origin::signed(ALICE)));

		// Dispatch a signed extrinsic.
		assert_ok!(Sport::producer_charge(Origin::signed(ALICE),0,0,100));
		System::assert_has_event(Event::Sport(crate::Event::ProducerCharge(ALICE, 0, 0,100)));


	});
}


#[test]
fn device_type_create_should_work() {
	new_test_ext().execute_with(|| {

		assert_ok!(Sport::producer_register(Origin::signed(ALICE)));


		assert_ok!(Sport::device_type_create(Origin::signed(ALICE),bvec![0u8; 20],0,SportType::SkippingRope));


		System::assert_has_event(Event::Sport(crate::Event::DeviceTypeCreate(ALICE, 0, 0,SportType::SkippingRope,bvec![0u8; 20])));

		assert_noop!(
			Sport::device_type_create(Origin::signed(ALICE),bvec![0u8; 20],1,SportType::SkippingRope),
			Error::<Test>::ProducerNotExist
		);

	});
}
