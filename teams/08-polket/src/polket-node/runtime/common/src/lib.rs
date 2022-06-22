// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

//! Common runtime code for polket.

#![cfg_attr(not(feature = "std"), no_std)]

pub mod origin;

/// The type used for currency conversion.
///
/// This must only be used as long as the balance type is `u128`.
pub type CurrencyToVote = frame_support::traits::U128CurrencyToVote;
static_assertions::assert_eq_size!(polket_primitives::Balance, u128);


pub type SportInstance = pallet_uniques::Instance1;
pub type CouponsInstance = pallet_uniques::Instance2;
