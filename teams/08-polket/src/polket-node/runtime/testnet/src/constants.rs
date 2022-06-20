// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

/// Money matters.
pub mod currency {
	use polket_primitives::Balance;

	pub const DOLLARS: Balance = 1_000_000_000_000;
	pub const CENTS: Balance = DOLLARS / 100;
	pub const MILLICENTS: Balance = CENTS / 1_000;
	pub const MICROCENTS: Balance = MILLICENTS / 1_000;

	pub const fn deposit(items: u32, bytes: u32) -> Balance {
		items as Balance * 20 * DOLLARS + (bytes as Balance) * 100 * MILLICENTS
	}
}

/// Time and blocks.
pub mod time {
	use polket_primitives::{BlockNumber, Moment};
	// mainnet
	pub const MILLISECS_PER_BLOCK: Moment = 2000;
	// Testnet
	//	pub const MILLISECS_PER_BLOCK: Moment = 1000;
	pub const SLOT_DURATION: Moment = MILLISECS_PER_BLOCK;
	// Kusama
	pub const EPOCH_DURATION_IN_BLOCKS: BlockNumber = 1 * HOURS;
	// Mainnet
	//	pub const EPOCH_DURATION_IN_BLOCKS: BlockNumber = 4 * HOURS;
	// Testnet
	//	pub const EPOCH_DURATION_IN_BLOCKS: BlockNumber = 10 * MINUTES;

	// These time units are defined in number of blocks.
	pub const MINUTES: BlockNumber = 60_000 / (MILLISECS_PER_BLOCK as BlockNumber);
	pub const HOURS: BlockNumber = MINUTES * 60;
	pub const DAYS: BlockNumber = HOURS * 24;

	// 1 in 4 blocks (on average, not counting collisions) will be primary babe blocks.
	pub const PRIMARY_PROBABILITY: (u64, u64) = (1, 4);
}

/// Fee-related.
pub mod fee {
	use frame_support::{
		dispatch::Weight,
		weights::{WeightToFeeCoefficients, WeightToFeePolynomial},
	};
	use polket_primitives::Balance;
	use smallvec::smallvec;
	pub use sp_runtime::Perbill;

	pub struct FixTransactionFee;
	impl WeightToFeePolynomial for FixTransactionFee {
		type Balance = Balance;
		fn polynomial() -> WeightToFeeCoefficients<Self::Balance> {
			// smallvec![WeightToFeeCoefficient {
			//     degree: 1,
			//     negative: false,
			//     coeff_frac: Perbill::zero(),
			//     coeff_integer: Zero::zero(),
			// }]
			smallvec![]
		}

		fn calc(_: &Weight) -> Self::Balance {
			10 * super::currency::MICROCENTS
		}
	}
}
