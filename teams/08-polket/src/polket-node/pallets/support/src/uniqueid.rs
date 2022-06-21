// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

pub trait UniqueIdGenerator {
	type ClassId;
	type InstanceId;
	type AssetId;

	/// generate new class id: Return the current ID, and increment the current ID
	fn generate_class_id() -> Result<Self::ClassId, sp_runtime::DispatchError>;
	/// generate new instance id with class id: Return the current ID, and increment the current ID
	fn generate_instance_id(
		class_id: Self::ClassId,
	) -> Result<Self::InstanceId, sp_runtime::DispatchError>;
	/// generate new asset id with class id: Return the current ID, and increment the current ID
	fn generate_asset_id(
	) -> Result<Self::AssetId, sp_runtime::DispatchError>;
}
