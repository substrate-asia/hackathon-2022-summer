// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use super::*;
use crate::mock::*;
use frame_support::{assert_noop, assert_ok};

#[test]
fn generate_class_id_should_work() {
	new_test_ext().execute_with(|| {
		assert_ok!(crate::Pallet::<Test>::generate_class_id(), 0u32);
		assert_eq!(UniqueId::next_class_id(), 1u32);
	});
}

#[test]
fn generate_instance_id_should_work() {
	new_test_ext().execute_with(|| {
		assert_noop!(
			crate::Pallet::<Test>::generate_instance_id(0u32),
			Error::<Test>::ClassIdIsNotExisted
		);
		assert_ok!(crate::Pallet::<Test>::generate_class_id(), 0u32);
		assert_ok!(crate::Pallet::<Test>::generate_instance_id(0u32), 0u32);
		assert_eq!(UniqueId::next_instance_id(0u32), 1u32);
	});
}
