// This file is part of Polket.
// Copyright (C) 2021-2022 Polket.
// SPDX-License-Identifier: GPL-3.0-or-later

pub trait ProjectHandler<AccountId,ProjectId,AssetId,Balance,BlockNumber> {


	/// Report the manager (permissioned owner) of a project, if there is one.
	fn manager_of(id: ProjectId) -> Option<AccountId>;

	/// Return if a `ProjectId` is a Project.
	fn is_project(id: ProjectId) -> bool;

	/// Return if a `ProjectId` is completed in the system.
	fn is_completed(id: ProjectId) -> bool;

	/// Apply a lock to the project registration so that it cannot be modified by
	/// the manager directly. Instead the project must use its sovereign governance
	/// or the system root.
	fn apply_lock(account_id:AccountId,id: ProjectId);

	/// Remove any lock on the project registration.
	fn remove_lock(id: ProjectId);

	/// Check if it's project is lock.
	fn is_lock(id: ProjectId)-> bool;

	/// Return if a `ProjectId` has fund info.
	fn fund_info_of(
		id: ProjectId,
	) -> Option<(AssetId, Balance, BlockNumber)>;

    // start project, if success return true
	fn start_projcet(id: ProjectId) -> bool;

    // stop project, if success return true
	fn stop_projcet(id: ProjectId) -> bool;

	// end project, if success return true
	fn end_projcet(id: ProjectId) -> bool;

    // dissolve project, if success return true
	fn dissolve_projcet(id: ProjectId) -> bool;

	// Return if a `ProjectId` settlements with a specific asset.
	fn project_settlement_asset(id: ProjectId) -> Option<AssetId>;

	// Return if a `ProjectId` requires a certain cost.
	fn project_cost(id: ProjectId) -> Option<Balance>;

	// Return if a `ProjectId` can estimate expected income
	fn estimate_expected_income(id: ProjectId) -> Option<Balance>;

	// Return if a `ProjectId` has execution period
	fn execution_period(id: ProjectId) -> Option<BlockNumber>;
}
