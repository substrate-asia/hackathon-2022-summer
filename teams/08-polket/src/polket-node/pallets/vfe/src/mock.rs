// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

use super::*;
use crate as pallet_vfe;
use frame_support::{parameter_types, PalletId};
use frame_support_test::TestRandomness;
use frame_system as system;
use pallet_assets::FrozenBalance;
use sp_core::H256;
use sp_runtime::{
	testing::Header,
	traits::{BlakeTwo256, IdentityLookup},
	AccountId32,
};
use system::RawOrigin;

pub type AccountId = AccountId32;
pub type BlockNumber = u64;

pub const ALICE: AccountId = AccountId::new([1u8; 32]);
pub const BOB: AccountId = AccountId::new([2u8; 32]);
pub const TOM: AccountId = AccountId::new([3u8; 32]);
type UncheckedExtrinsic = frame_system::mocking::MockUncheckedExtrinsic<Test>;
type Block = frame_system::mocking::MockBlock<Test>;
pub type Instance = pallet_uniques::Instance1;

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
		Uniques: pallet_uniques::{Pallet, Call, Storage, Event<T>},
		SportUniques: pallet_uniques::<Instance1>::{Pallet, Call, Storage, Event<T>},
		UniqueId: pallet_unique_id::{Pallet, Storage},
		Sport: pallet_vfe::{Pallet, Call, Storage, Event<T>},

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
	pub const ExistentialDeposit: u64 = 0;
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

pub struct EnsureProducer<AccountId>(sp_std::marker::PhantomData<AccountId>);
impl<O: Into<Result<RawOrigin<AccountId>, O>> + From<RawOrigin<AccountId>>> EnsureOrigin<O>
for EnsureProducer<AccountId>
{
	type Success = AccountId;
	fn try_origin(o: O) -> Result<Self::Success, O> {
		o.into().and_then(|o| match o {
			RawOrigin::Signed(who) if  (who == ALICE || who == TOM ) => Ok(who),
			r => Err(O::from(r)),
		})
	}

	#[cfg(feature = "runtime-benchmarks")]
	fn successful_origin() -> O {
		O::from(RawOrigin::Signed(Default::default()))
	}
}

parameter_types! {
	pub const ClassDeposit: u64 = 2;
	pub const InstanceDeposit: u64 = 1;
	pub const KeyLimit: u32 = 50;
	pub const ValueLimit: u32 = 50;
	pub const StringLimit: u32 = 50;
	pub const MetadataDepositBase: u64 = 1;
	pub const AttributeDepositBase: u64 = 1;
	pub const MetadataDepositPerByte: u64 = 1;
}

impl pallet_uniques::Config<Instance> for Test {
	type Event = Event;
	type ClassId = u32;
	type InstanceId = u32;
	type Currency = Balances;
	type ForceOrigin = frame_system::EnsureRoot<AccountId>;
	type ClassDeposit = ClassDeposit;
	type InstanceDeposit = InstanceDeposit;
	type MetadataDepositBase = MetadataDepositBase;
	type AttributeDepositBase = AttributeDepositBase;
	type DepositPerByte = MetadataDepositPerByte;
	type StringLimit = StringLimit;
	type KeyLimit = KeyLimit;
	type ValueLimit = ValueLimit;
	type WeightInfo = ();
}

impl pallet_uniques::Config for Test {
	type Event = Event;
	type ClassId = u32;
	type InstanceId = u32;
	type Currency = Balances;
	type ForceOrigin = frame_system::EnsureRoot<AccountId>;
	type ClassDeposit = ClassDeposit;
	type InstanceDeposit = InstanceDeposit;
	type MetadataDepositBase = MetadataDepositBase;
	type AttributeDepositBase = AttributeDepositBase;
	type DepositPerByte = MetadataDepositPerByte;
	type StringLimit = StringLimit;
	type KeyLimit = KeyLimit;
	type ValueLimit = ValueLimit;
	type WeightInfo = ();
}

impl pallet_unique_id::Config for Test {
	type ClassId = u32;
	type InstanceId = u32;
	type AssetId = u32;
}

parameter_types! {
	pub const PickUpRealRequestPeriod: u64 = 500;
}



parameter_types! {
	pub const MaxGenerateRandom: u32 = 1000000;
	pub const SportPalletId: PalletId = PalletId(*b"poc/acas");
	pub const CommonMin :u16 = 1;
	pub const CommonMax :u16 = 10;
	pub const EliteMin :u16 = 8;
	pub const EliteMax :u16 = 20;
	pub const RareMin :u16 = 18;
	pub const RareMax :u16 = 30;
	pub const EpicMin :u16 = 30;
	pub const EpicMax :u16 = 50;
	pub const Electric :u16 = 100;

	pub const NativeToken: u32 = 0;
	pub const IncentiveToken: u32 = 0;
	pub const UnbindFee:u32 = 1;

}


impl pallet_vfe::Config for Test {
	type Event = Event;
	type CreateOrigin = EnsureProducer<Self::AccountId>;
	type RoleOrigin = EnsureProducer<Self::AccountId>;
	type ProducerId = u32;
	type Currencies = Assets;
	type PalletId = SportPalletId;
	type UniqueId = UniqueId;
	type UniquesInstance = Instance;
	type Randomness = TestRandomness<Self>;
	type Currency = Balances;
	type MaxGenerateRandom = MaxGenerateRandom;
	type Electric = Electric;
	type CommonMin = CommonMin;
	type CommonMax = CommonMin;
	type EliteMin = EliteMin;
	type EliteMax = EliteMax;
	type RareMin = RareMin;
	type RareMax = RareMax;
	type EpicMin = EpicMin;
	type EpicMax = EpicMax;
	type IncentiveToken = IncentiveToken;
	type NativeToken = NativeToken;
	type UnbindFee = UnbindFee;
}

pub(crate) fn new_test_ext() -> sp_io::TestExternalities {
	let mut t = frame_system::GenesisConfig::default().build_storage::<Test>().unwrap();
	pallet_balances::GenesisConfig::<Test> { balances: vec![(ALICE, 10000000000)] }
		.assimilate_storage(&mut t)
		.unwrap();

	pallet_balances::GenesisConfig::<Test> { balances: vec![(BOB, 10000000000)] }
		.assimilate_storage(&mut t)
		.unwrap();

	pallet_assets::GenesisConfig::<Test> {
		assets: vec![
			// id, owner, is_sufficient, min_balance
			(0, ALICE, true, 1),
			(5, ALICE, true, 1),
		],
		metadata: vec![
			// id, name, symbol, decimals
			(0, "Token Name".into(), "TOKEN".into(), 2),
			(5, "Token Name2".into(), "TOKEN2".into(), 2),
		],
		accounts: vec![
			// id, account_id, balance
			(0, ALICE, 1000),
			(0, BOB, 1000),
			(0, TOM, 1000),
		],
	}
		.assimilate_storage(&mut t)
		.unwrap();

	let mut ext = sp_io::TestExternalities::new(t);
	ext.execute_with(|| System::set_block_number(1));
	ext
}
