// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use super::*;
use crate as pallet_currencies;
use frame_support::parameter_types;
use frame_system as system;
use pallet_assets::FrozenBalance;
use sp_core::H256;
use sp_runtime::{
	testing::Header,
	traits::{BlakeTwo256, IdentityLookup},
	AccountId32,
};

pub type AccountId = AccountId32;
pub const ALICE: AccountId = AccountId::new([1u8; 32]);
pub const BOB: AccountId = AccountId::new([2u8; 32]);

type UncheckedExtrinsic = frame_system::mocking::MockUncheckedExtrinsic<Test>;
type Block = frame_system::mocking::MockBlock<Test>;

// Configure a mock runtime to test the pallet.
frame_support::construct_runtime!(
	pub enum Test where
		Block = Block,
		NodeBlock = Block,
		UncheckedExtrinsic = UncheckedExtrinsic,
	{
		System: frame_system::{Pallet, Call, Config, Storage, Event<T>},
		Balances: pallet_balances::{Pallet, Call, Storage, Config<T>, Event<T>},
		Assets: pallet_assets::{Pallet, Call, Storage, Event<T>},
		Currencies: pallet_currencies::{Pallet, Call, Storage, Event<T>},
	}
);

parameter_types! {
	pub const BlockHashCount: u64 = 250;
	pub const SS58Prefix: u8 = 42;
}

impl system::Config for Test {
	type BaseCallFilter = frame_support::traits::Everything;
	type BlockWeights = ();
	type BlockLength = ();
	type DbWeight = ();
	type Origin = Origin;
	type Call = Call;
	type Index = u64;
	type BlockNumber = u64;
	type Hash = H256;
	type Hashing = BlakeTwo256;
	type AccountId = AccountId;
	type Lookup = IdentityLookup<Self::AccountId>;
	type Header = Header;
	type Event = Event;
	type BlockHashCount = BlockHashCount;
	type Version = ();
	type PalletInfo = PalletInfo;
	type AccountData = pallet_balances::AccountData<u64>;
	type OnNewAccount = ();
	type OnKilledAccount = ();
	type SystemWeightInfo = ();
	type SS58Prefix = SS58Prefix;
	type OnSetCode = ();
}

parameter_types! {
	pub const ExistentialDeposit: u64 = 10;
}

impl pallet_balances::Config for Test {
	type Balance = u64;
	type DustRemoval = ();
	type Event = Event;
	type ExistentialDeposit = ExistentialDeposit;
	type AccountStore = System;
	type WeightInfo = ();
	type MaxLocks = ();
	type MaxReserves = ();
	type ReserveIdentifier = [u8; 8];
}

parameter_types! {
	pub const AssetDeposit: u64 = 0;
	pub const ApprovalDeposit: u64 = 0;
	pub const StringLimit: u32 = 256;
	pub const MetadataDepositBase: u64 = 1;
	pub const MetadataDepositPerByte: u64 = 1;
}

impl pallet_assets::Config for Test {
	type Event = Event;
	type Balance = u64;
	type AssetId = u32;
	type Currency = Balances;
	type ForceOrigin = frame_system::EnsureRoot<Self::AccountId>;
	type AssetDeposit = AssetDeposit;
	type MetadataDepositBase = MetadataDepositBase;
	type MetadataDepositPerByte = MetadataDepositPerByte;
	type ApprovalDeposit = ApprovalDeposit;
	type StringLimit = StringLimit;
	type Freezer = TestFreezer;
	type WeightInfo = ();
	type Extra = ();
}

use std::{cell::RefCell, collections::HashMap};

#[derive(Clone, Eq, PartialEq, Debug)]
pub(crate) enum Hook {
	Died(u32, AccountId),
}
thread_local! {
	static FROZEN: RefCell<HashMap<(u32, AccountId), u64>> = RefCell::new(Default::default());
	static HOOKS: RefCell<Vec<Hook>> = RefCell::new(Default::default());
}

pub struct TestFreezer;
impl FrozenBalance<u32, AccountId, u64> for TestFreezer {
	fn frozen_balance(asset: u32, who: &AccountId) -> Option<u64> {
		FROZEN.with(|f| f.borrow().get(&(asset, who.clone())).cloned())
	}

	fn died(asset: u32, who: &AccountId) {
		HOOKS.with(|h| h.borrow_mut().push(Hook::Died(asset, who.clone())));
	}
}

parameter_types! {
	pub const NativeToken: u32 = 0;
}

impl pallet_currencies::Config for Test {
	type Event = Event;
	type NativeToken = NativeToken;
	type MultiCurrency = Assets;
	type NativeCurrency = Balances;
}

// Build genesis storage according to the mock runtime.
pub fn new_test_ext() -> sp_io::TestExternalities {
	let mut t = system::GenesisConfig::default().build_storage::<Test>().unwrap();
	pallet_balances::GenesisConfig::<Test> { balances: vec![(ALICE, 10000000000)] }
		.assimilate_storage(&mut t)
		.unwrap();

	pallet_assets::GenesisConfig::<Test> {
		assets: vec![
			// id, owner, is_sufficient, min_balance
			(0, ALICE, true, 1),
			(1, ALICE, true, 1),
		],
		metadata: vec![
			// id, name, symbol, decimals
			(0, "Polket Native Token".into(), "PNT".into(), 12),
			(1, "To Earn Fun".into(), "FUN".into(), 8),
		],
		accounts: vec![(1, BOB, 1000)],
	}
	.assimilate_storage(&mut t)
	.unwrap();

	let mut ext = sp_io::TestExternalities::new(t);
	ext.execute_with(|| System::set_block_number(1));
	ext
}
