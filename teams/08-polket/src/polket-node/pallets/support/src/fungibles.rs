// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later


pub trait TransferNotifier<AccountId,AssetId,Balance> {
	fn transferred_notification(
		from: &AccountId,
		to: &AccountId,
		asset_id: AssetId,
		value: Balance,
	) -> bool;
}
