// This file is part of Polket.
// Copyright (C) 2020-2021 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use super::*;
use crate::mock::{Event, *};
use frame_support::{assert_noop, assert_ok};
use pallet_identity::{Data, IdentityInfo};
use pallet_support::identity::IdentityRole;
use sp_std::convert::TryInto;

fn test_identity() -> IdentityInfo<MaxAdditionalFields> {
	IdentityInfo {
		additional: Default::default(),
		display: Data::Raw(b"ten".to_vec().try_into().unwrap()),
		legal: Data::Raw(b"The Right Ordinal Ten, Esq.".to_vec().try_into().unwrap()),
		web: Default::default(),
		riot: Default::default(),
		email: Default::default(),
		pgp_fingerprint: None,
		image: Default::default(),
		twitter: Default::default(),
	}
}

#[test]
fn set_identity_role_should_work() {
	new_test_ext().execute_with(|| {
		// set_identity_role should work.
		assert_ok!(IdentityExtra::set_identity_role(
			Origin::signed(ALICE),
			Box::new(test_identity()),
			IdentityRole::Producer,
		));

		// Event log
		System::assert_has_event(Event::IdentityExtra(crate::Event::IdentityRoleSet(
			ALICE,
			test_identity(),
			IdentityRole::Producer,
		)));

		assert!(IdentityExtra::get_account_roles(ALICE).is_some());
		assert_eq!(IdentityExtra::get_account_roles(ALICE).unwrap().0, IdentityRole::Producer);
		assert_eq!(IdentityExtra::get_account_roles(ALICE).unwrap().1, false);

		// //application should be existed
		// assert!(AnchorAssetsModule::get_anchor_assets(0).is_some());
		// let application =
		// 	AnchorAssetsModule::get_anchor_assets(0).expect("application is not existed");
		// assert_eq!(Vec::<u8>::from(application.name), b"Polket".to_vec());
		// assert_eq!(Vec::<u8>::from(application.symbol), b"NFT".to_vec());
		// assert_eq!(application.decimals, 2);
		// assert_eq!(application.min_balance, 1);

		// //ApplicationCount should be increased
		// assert_eq!(AnchorAssetsModule::application_count(), 1);
	});
}

#[test]
fn review_identity_role_should_work() {
	new_test_ext().execute_with(|| {
		// set_identity_role should work.
		assert_ok!(IdentityExtra::set_identity_role(
			Origin::signed(ALICE),
			Box::new(test_identity()),
			IdentityRole::Producer,
		));

		assert_ok!(IdentityModule::add_registrar(Origin::root(), BOB));

		// wrong origin
		assert_noop!(
			IdentityExtra::review_identity_role(
				Origin::signed(ALICE),
				0,
				ALICE,
				true,
				Judgement::KnownGood,
				None
			),
			pallet_identity::Error::<Test>::InvalidIndex
		);

		// approve
		assert_ok!(IdentityExtra::review_identity_role(
			Origin::signed(BOB),
			0,
			ALICE,
			true,
			Judgement::KnownGood,
			None
		));

		// Event log
		System::assert_has_event(Event::IdentityExtra(crate::Event::IdentityRoleReviewed(
			ALICE,
			BOB,
			true,
			Judgement::KnownGood,
			None,
		)));

		assert!(IdentityExtra::get_account_roles(ALICE).is_some());
		assert_eq!(IdentityExtra::get_account_roles(ALICE).unwrap().0, IdentityRole::Producer);
		assert_eq!(IdentityExtra::get_account_roles(ALICE).unwrap().1, true);

		// not approve
		assert_ok!(IdentityExtra::review_identity_role(
			Origin::signed(BOB),
			0,
			ALICE,
			false,
			Judgement::Erroneous,
			Some(b"info invalid".to_vec()),
		));

		// Event log
		System::assert_has_event(Event::IdentityExtra(crate::Event::IdentityRoleReviewed(
			ALICE,
			BOB,
			false,
			Judgement::Erroneous,
			Some(b"info invalid".to_vec()),
		)));

		assert!(IdentityExtra::get_account_roles(ALICE).is_none());
	});
}

#[test]
fn identity_support_impl_should_work() {
	new_test_ext().execute_with(|| {
		let subs = vec![(BOB, Data::Raw(vec![40; 1].try_into().unwrap()))];
		assert_ok!(IdentityExtra::set_identity_role(
			Origin::signed(ALICE),
			Box::new(test_identity()),
			IdentityRole::Producer,
		));
		assert_ok!(IdentityModule::add_registrar(Origin::root(), BOB));
		assert_ok!(IdentityExtra::review_identity_role(
			Origin::signed(BOB),
			0,
			ALICE,
			true,
			Judgement::KnownGood,
			None
		));
		assert_eq!(IdentityExtra::get_identity_role(&ALICE), IdentityRole::Producer);
		assert_eq!(IdentityExtra::get_identity_role(&BOB), IdentityRole::None);
		assert_ok!(IdentityModule::set_subs(Origin::signed(ALICE), subs.clone()));
		assert_eq!(IdentityExtra::get_identity_role(&BOB), IdentityRole::Producer);
		assert_eq!(IdentityExtra::get_super_of(&BOB), Some(ALICE));
		assert_eq!(IdentityExtra::get_subs_of(&ALICE), vec![BOB]);
		assert_eq!(IdentityExtra::is_have_relationship(&BOB, &ALICE), true);
		assert_eq!(IdentityExtra::is_have_relationship(&COCO, &ALICE), false);

		assert_ok!(IdentityModule::remove_sub(Origin::signed(ALICE), BOB));
		assert_eq!(IdentityExtra::get_identity_role(&BOB), IdentityRole::None);
	});
}
