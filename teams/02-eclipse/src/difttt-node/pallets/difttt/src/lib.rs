#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Decode, Encode, MaxEncodedLen};
use frame_support::{traits::ConstU32, BoundedVec};
/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://docs.substrate.io/v3/runtime/frame>
pub use pallet::*;
use scale_info::TypeInfo;
use sp_runtime::RuntimeDebug;
use sp_std::cmp::{Eq, PartialEq};

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;

#[derive(Encode, Decode, Eq, PartialEq, Copy, Clone, RuntimeDebug, TypeInfo, MaxEncodedLen)]
// #[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
// #[cfg_attr(feature = "std", serde(rename_all = "camelCase"))]
pub enum Triger {
	Timer(u64, u64),    //insert_time,  timer_seconds
	Schedule(u64, u64), //insert_time,  timestamp
	PriceGT(u64, u64),  //insert_time,  price   //todo,price use float
	PriceLT(u64, u64),  //insert_time,  price   //todo,price use float
	Arh999LT(u64, u64, u64), /* insert_time,  indicator, Minimum buy interval   //todo,
	                     * indicator use float */
}

#[derive(Encode, Decode, Eq, PartialEq, Clone, RuntimeDebug, TypeInfo, MaxEncodedLen)]
//#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
//#[cfg_attr(feature = "std", serde(rename_all = "camelCase"))]
pub enum Action<AccountId> {
	MailWithToken(
		BoundedVec<u8, ConstU32<128>>,
		BoundedVec<u8, ConstU32<256>>,
		BoundedVec<u8, ConstU32<128>>,
		BoundedVec<u8, ConstU32<128>>,
		BoundedVec<u8, ConstU32<256>>,
	),
	/* url, encrypted access_token
	 * by asymmetric encryption,
	 * revicer, title, body */
	Oracle(BoundedVec<u8, ConstU32<32>>, BoundedVec<u8, ConstU32<128>>), // TokenName, SourceURL
	BuyToken(AccountId, BoundedVec<u8, ConstU32<32>>, u64),              // TokenName, Number
}

#[derive(Encode, Decode, Eq, PartialEq, Clone, RuntimeDebug, TypeInfo, MaxEncodedLen)]
// #[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
// #[cfg_attr(feature = "std", serde(rename_all = "camelCase"))]
pub struct Recipe {
	triger_id: u64,
	action_id: u64,
	enable: bool,
	times: u64,
	done: bool,
	last_triger_timestamp: u64,
}

#[frame_support::pallet]
pub mod pallet {
	use crate::{Action, Recipe, Triger};
	use codec::alloc::string::ToString;
	use data_encoding::BASE64;
	use frame_support::{ensure, pallet_prelude::*, traits::UnixTime};
	use frame_system::{
		offchain::{CreateSignedTransaction, SubmitTransaction},
		pallet_prelude::*,
	};
	use lite_json::json::JsonValue;
	use serde::{Deserialize, Deserializer};
	use sp_runtime::{
		offchain::{
			http,
			storage::StorageValueRef,
			storage_lock::{BlockAndTime, StorageLock},
			Duration,
		},
		traits::{BlockNumberProvider, One},
	};

	use sp_std::{collections::btree_map::BTreeMap, prelude::*, str};

	const FETCH_TIMEOUT_PERIOD: u64 = 3000; // in milli-seconds
	const LOCK_TIMEOUT_EXPIRATION: u64 = FETCH_TIMEOUT_PERIOD + 1000; // in milli-seconds
	const LOCK_BLOCK_EXPIRATION: u32 = 3; // in block number
	const ARH999_DECIMAL_PRECISION: usize = 2;

	/*
	{
		"data": [
			[1655725195.0, 0.3143, 20827.92, 35400.82, 38982.87],
			[1655725195.0, 0.3143, 20827.92, 35400.82, 38982.87]
		],
		"code": 200,
		"msg": "success"
	}

	for test
	{
		"data": "0.31",
		"code": 200,
		"msg": "success"
	}
	*/
	#[derive(Deserialize, Encode, Decode, Default, RuntimeDebug)]
	struct ArhResponseData {
		#[serde(deserialize_with = "de_string_to_bytes")]
		data: Vec<u8>,
		code: u64,
		#[serde(deserialize_with = "de_string_to_bytes")]
		msg: Vec<u8>,
	}

	pub fn de_string_to_bytes<'de, D>(de: D) -> Result<Vec<u8>, D::Error>
	where
		D: Deserializer<'de>,
	{
		let s: &str = Deserialize::deserialize(de)?;
		Ok(s.as_bytes().to_vec())
	}

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config + CreateSignedTransaction<Call<Self>> {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
		type TimeProvider: UnixTime;

		/// The overarching dispatch call type.
		type Call: From<Call<Self>>;

		/// A configuration for base priority of unsigned transactions.
		///
		/// This is exposed so that it can be tuned for particular runtime, when
		/// multiple pallets send unsigned transactions.
		#[pallet::constant]
		type UnsignedPriority: Get<TransactionPriority>;
	}

	#[pallet::pallet]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);

	// The pallet's runtime storage items.
	// https://docs.substrate.io/v3/runtime/storage

	#[pallet::storage]
	#[pallet::getter(fn triger_owner)]
	pub type TrigerOwner<T: Config> =
		StorageDoubleMap<_, Twox64Concat, T::AccountId, Twox64Concat, u64, (), OptionQuery>;

	#[pallet::storage]
	#[pallet::getter(fn action_owner)]
	pub type ActionOwner<T: Config> =
		StorageDoubleMap<_, Twox64Concat, T::AccountId, Twox64Concat, u64, (), OptionQuery>;

	#[pallet::storage]
	#[pallet::getter(fn recipe_owner)]
	pub type RecipeOwner<T: Config> =
		StorageDoubleMap<_, Twox64Concat, T::AccountId, Twox64Concat, u64, (), OptionQuery>;

	#[pallet::storage]
	#[pallet::getter(fn map_triger)]
	pub(super) type MapTriger<T: Config> = StorageMap<_, Twox64Concat, u64, Triger>;

	#[pallet::storage]
	#[pallet::getter(fn map_action)]
	pub(super) type MapAction<T: Config> = StorageMap<_, Twox64Concat, u64, Action<T::AccountId>>;

	#[pallet::storage]
	#[pallet::getter(fn map_recipe)]
	pub(super) type MapRecipe<T: Config> = StorageMap<_, Twox64Concat, u64, Recipe>;

	#[pallet::storage]
	#[pallet::getter(fn next_triger_id)]
	pub type NextTrigerId<T: Config> = StorageValue<_, u64>;
	#[pallet::storage]
	#[pallet::getter(fn next_action_id)]
	pub type NextActionId<T: Config> = StorageValue<_, u64>;
	#[pallet::storage]
	#[pallet::getter(fn next_recipe_id)]
	pub type NextRecipeId<T: Config> = StorageValue<_, u64>;

	// Pallets use events to inform users when important changes are made.
	// https://docs.substrate.io/v3/runtime/events-and-errors
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Event documentation should end with an array that provides descriptive names for event
		/// parameters. [something, who]
		SomethingStored(u32, T::AccountId),

		TrigerCreated(u64, Triger),
		ActionCreated(u64, Action<T::AccountId>),
		RecipeCreated(u64, Recipe),
		RecipeRemoved(u64),
		RecipeTurnOned(u64),
		RecipeTurnOffed(u64),
		RecipeDone(u64),
		TokenBought(T::AccountId, Vec<u8>, u64),
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// Error names should be descriptive.
		NoneValue,
		/// Errors should have helpful documentation associated with them.
		StorageOverflow,

		TrigerIdNotExist,
		ActionIdNotExist,
		RecipeIdNotExist,
		NotOwner,
		OffchainUnsignedTxError,
	}

	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// create_trigerid
		#[pallet::weight(0)]
		pub fn create_triger(origin: OriginFor<T>, triger: Triger) -> DispatchResult {
			let user = ensure_signed(origin)?;
			let triger_id = NextTrigerId::<T>::get().unwrap_or_default();

			MapTriger::<T>::insert(triger_id, triger.clone());
			TrigerOwner::<T>::insert(user, triger_id, ());
			NextTrigerId::<T>::put(triger_id.saturating_add(One::one()));

			Self::deposit_event(Event::TrigerCreated(triger_id, triger));

			Ok(())
		}

		/// create_action
		#[pallet::weight(0)]
		pub fn create_action(origin: OriginFor<T>, action: Action<T::AccountId>) -> DispatchResult {
			let user = ensure_signed(origin)?;
			let action_id = NextActionId::<T>::get().unwrap_or_default();

			MapAction::<T>::insert(action_id, action.clone());
			ActionOwner::<T>::insert(user, action_id, ());
			NextActionId::<T>::put(action_id.saturating_add(One::one()));

			Self::deposit_event(Event::ActionCreated(action_id, action));

			Ok(())
		}

		/// test
		#[pallet::weight(0)]
		pub fn create_recipe(
			origin: OriginFor<T>,
			triger_id: u64,
			action_id: u64,
		) -> DispatchResult {
			let user = ensure_signed(origin)?;
			let recipe_id = NextRecipeId::<T>::get().unwrap_or_default();

			ensure!(MapTriger::<T>::contains_key(&triger_id), Error::<T>::TrigerIdNotExist);
			ensure!(MapAction::<T>::contains_key(&action_id), Error::<T>::ActionIdNotExist);

			let recipe = Recipe {
				triger_id,
				action_id,
				enable: true,
				times: 0,
				done: false,
				last_triger_timestamp: 0,
			};

			MapRecipe::<T>::insert(recipe_id, recipe.clone());
			RecipeOwner::<T>::insert(user, recipe_id, ());
			NextRecipeId::<T>::put(recipe_id.saturating_add(One::one()));

			Self::deposit_event(Event::RecipeCreated(recipe_id, recipe));

			Ok(())
		}

		/// test
		#[pallet::weight(0)]
		pub fn del_recipe(origin: OriginFor<T>, recipe_id: u64) -> DispatchResult {
			let user = ensure_signed(origin)?;

			ensure!(MapRecipe::<T>::contains_key(&recipe_id), Error::<T>::RecipeIdNotExist);
			ensure!(RecipeOwner::<T>::contains_key(&user, &recipe_id), Error::<T>::NotOwner);

			RecipeOwner::<T>::remove(user, recipe_id);
			MapRecipe::<T>::remove(recipe_id);

			Self::deposit_event(Event::RecipeRemoved(recipe_id));

			Ok(())
		}

		/// test
		#[pallet::weight(0)]
		pub fn turn_on_recipe(origin: OriginFor<T>, recipe_id: u64) -> DispatchResult {
			let user = ensure_signed(origin)?;

			ensure!(MapRecipe::<T>::contains_key(&recipe_id), Error::<T>::RecipeIdNotExist);
			ensure!(RecipeOwner::<T>::contains_key(&user, &recipe_id), Error::<T>::NotOwner);

			MapRecipe::<T>::try_mutate(recipe_id, |recipe| -> DispatchResult {
				if let Some(recipe) = recipe {
					recipe.enable = true;
					Self::deposit_event(Event::RecipeTurnOned(recipe_id));
				}
				Ok(())
			})?;

			Ok(())
		}

		/// test
		#[pallet::weight(0)]
		pub fn turn_off_recipe(origin: OriginFor<T>, recipe_id: u64) -> DispatchResult {
			let user = ensure_signed(origin)?;

			ensure!(MapRecipe::<T>::contains_key(&recipe_id), Error::<T>::RecipeIdNotExist);
			ensure!(RecipeOwner::<T>::contains_key(user, &recipe_id), Error::<T>::NotOwner);

			MapRecipe::<T>::try_mutate(recipe_id, |recipe| -> DispatchResult {
				if let Some(recipe) = recipe {
					recipe.enable = false;
					Self::deposit_event(Event::RecipeTurnOffed(recipe_id));
				}
				Ok(())
			})?;

			Ok(())
		}

		#[pallet::weight(0)]
		pub fn set_recipe_done_unsigned(
			origin: OriginFor<T>,
			_block_number: T::BlockNumber,
			recipe_id: u64,
		) -> DispatchResult {
			// This ensures that the function can only be called via unsigned transaction.
			ensure_none(origin)?;

			ensure!(MapRecipe::<T>::contains_key(&recipe_id), Error::<T>::RecipeIdNotExist);

			MapRecipe::<T>::try_mutate(recipe_id, |recipe| -> DispatchResult {
				if let Some(recipe) = recipe {
					recipe.done = true;
					Self::deposit_event(Event::RecipeDone(recipe_id));
				}
				Ok(())
			})?;

			Ok(())
		}

		#[pallet::weight(0)]
		pub fn buy_token_unsigned(
			origin: OriginFor<T>,
			_block_number: T::BlockNumber,
			buyer: T::AccountId,
			token_name: Vec<u8>,
			amount: u64,
		) -> DispatchResult {
			// This ensures that the function can only be called via unsigned transaction.
			ensure_none(origin)?;

			Self::deposit_event(Event::TokenBought(buyer, token_name, amount));

			Ok(())
		}
	}

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		fn offchain_worker(block_number: T::BlockNumber) {
			log::info!("###### Hello from pallet-difttt-offchain-worker.");

			// let parent_hash = <frame_system::Pallet<T>>::block_hash(block_number - 1u32.into());
			// log::info!("###### Current block: {:?} (parent hash: {:?})", block_number,
			// parent_hash);

			let timestamp_now = T::TimeProvider::now();
			log::info!("###### Current time: {:?} ", timestamp_now.as_secs());

			let store_hashmap_recipe = StorageValueRef::persistent(b"difttt_ocw::recipe_task");

			let mut map_recipe_task: BTreeMap<u64, Recipe>;
			if let Ok(Some(info)) = store_hashmap_recipe.get::<BTreeMap<u64, Recipe>>() {
				map_recipe_task = info;
			} else {
				map_recipe_task = BTreeMap::new();
			}

			let mut lock = StorageLock::<BlockAndTime<Self>>::with_block_and_time_deadline(
				b"offchain-demo::lock",
				LOCK_BLOCK_EXPIRATION,
				Duration::from_millis(LOCK_TIMEOUT_EXPIRATION),
			);

			let mut map_running_action_recipe_task: BTreeMap<u64, Recipe> = BTreeMap::new();
			if let Ok(_guard) = lock.try_lock() {
				for (recipe_id, recipe) in MapRecipe::<T>::iter() {
					if recipe.enable && !recipe.done {
						if !map_recipe_task.contains_key(&recipe_id) {
							log::info!("###### map_recipe_task.insert {:?}", &recipe_id);
							map_recipe_task.insert(
								recipe_id,
								Recipe {
									triger_id: recipe.triger_id,
									action_id: recipe.action_id,
									enable: true,
									times: 0,
									done: false,
									last_triger_timestamp: 0,
								},
							);
						}
					} else {
						log::info!("###### map_recipe_task.remove {:?}", &recipe_id);
						map_recipe_task.remove(&recipe_id);
					};
				}

				for (recipe_id, recipe) in map_recipe_task.iter_mut() {
					let triger = MapTriger::<T>::get(recipe.triger_id);

					match triger {
						Some(Triger::Timer(insert_time, timer_seconds)) => {
							if insert_time + recipe.times * timer_seconds < timestamp_now.as_secs()
							{
								(*recipe).times += 1;
								log::info!(
									"###### recipe {:?} Current Triger times: {:?} ",
									recipe_id,
									recipe.times
								);

								map_running_action_recipe_task.insert(*recipe_id, recipe.clone());
							}
						},
						Some(Triger::Schedule(_, timestamp)) => {
							if timestamp < timestamp_now.as_secs() {
								(*recipe).times += 1;
								(*recipe).done = true;

								map_running_action_recipe_task.insert(*recipe_id, recipe.clone());
							}
						},
						Some(Triger::PriceGT(_, price)) => {
							let _fetch_price = match Self::fetch_price() {
								Ok(fetch_price) => {
									//fetch_price{"USD":19670.47} => 1967047
									log::info!(
										"###### PriceGT price{:?}    fetch_price{:?}   ",
										price,
										fetch_price
									);
									if price < fetch_price {
										(*recipe).times += 1;
										(*recipe).done = true;

										map_running_action_recipe_task
											.insert(*recipe_id, recipe.clone());
									}
								},
								Err(e) => {
									log::info!("###### fetch_price error {:?}", e);
								},
							};
						},
						Some(Triger::PriceLT(_, price)) => {
							let _fetch_price = match Self::fetch_price() {
								Ok(fetch_price) => {
									//fetch_price{"USD":19670.47} => 1967047
									log::info!(
										"###### PriceLT price {:?}    fetch_price{:?}   ",
										price,
										fetch_price
									);
									if price > fetch_price {
										(*recipe).times += 1;
										(*recipe).done = true;

										map_running_action_recipe_task
											.insert(*recipe_id, recipe.clone());
									}
								},
								Err(e) => {
									log::info!("###### fetch_price error  {:?}", e);
								},
							};
						},
						Some(Triger::Arh999LT(_, indicator, min_interval)) => {
							let _fetch_arh999 = match Self::fetch_arh999() {
								Ok(fetch_arh999) => {
									//fetch_price{"USD":19670.47} => 1967047
									log::info!(
										"###### Arh999LT indicator {:?}   fetch_arh999{:?}  min_interval {:?}  last_triger_timestamp  {:?} ",
										indicator,
										fetch_arh999,
										min_interval,
										recipe.last_triger_timestamp,
									);
									if indicator > fetch_arh999 {
										(*recipe).times += 1;
										//(*recipe).done = true;

										map_running_action_recipe_task
											.insert(*recipe_id, recipe.clone());
									}
								},
								Err(e) => {
									log::info!("###### fetch_arh999 error  {:?}", e);
								},
							};
						},
						_ => {},
					}
				}

				store_hashmap_recipe.set(&map_recipe_task);
			};

			//todo run action
			for (recipe_id, recipe) in map_running_action_recipe_task.iter() {
				let action = MapAction::<T>::get(recipe.action_id);
				match action {
					Some(Action::MailWithToken(url, token, revicer, title, body)) => {
						let url = match scale_info::prelude::string::String::from_utf8(url.to_vec())
						{
							Ok(v) => v,
							Err(e) => {
								log::info!("###### decode url error  {:?}", e);
								continue
							},
						};

						let token =
							match scale_info::prelude::string::String::from_utf8(token.to_vec()) {
								Ok(v) => v,
								Err(e) => {
									log::info!("###### decode token error  {:?}", e);
									continue
								},
							};

						let revicer = match scale_info::prelude::string::String::from_utf8(
							revicer.to_vec(),
						) {
							Ok(v) => v,
							Err(e) => {
								log::info!("###### decode revicer error  {:?}", e);
								continue
							},
						};

						let title =
							match scale_info::prelude::string::String::from_utf8(title.to_vec()) {
								Ok(v) => v,
								Err(e) => {
									log::info!("###### decode title error  {:?}", e);
									continue
								},
							};

						let body =
							match scale_info::prelude::string::String::from_utf8(body.to_vec()) {
								Ok(v) => v,
								Err(e) => {
									log::info!("###### decode body error  {:?}", e);
									continue
								},
							};

						let options = scale_info::prelude::format!(
							"/email --url={} --token={} --revicer={} --title={} --body={}",
							url,
							token,
							revicer,
							title,
							body,
						);

						log::info!("###### publish_task mail options  {:?}", options);

						let _rt = match Self::publish_task(
							"registry.cn-shenzhen.aliyuncs.com/difttt/email:latest",
							&options,
							3,
						) {
							Ok(_i) => {
								log::info!("###### publish_task mail ok");

								match Self::offchain_unsigned_tx_recipe_done(
									block_number,
									*recipe_id,
								) {
									Ok(_) => {
										log::info!("###### submit_unsigned_transaction ok");
									},
									Err(e) => {
										log::info!(
											"###### submit_unsigned_transaction error  {:?}",
											e
										);
									},
								};
							},

							Err(e) => {
								log::info!("###### publish_task mail error  {:?}", e);
							},
						};
					},

					Some(Action::Oracle(token_name, source_url)) => {
						let token_name = match scale_info::prelude::string::String::from_utf8(
							token_name.to_vec(),
						) {
							Ok(v) => v,
							Err(e) => {
								log::info!("###### decode token_name error  {:?}", e);
								continue
							},
						};
						let source_url = match scale_info::prelude::string::String::from_utf8(
							source_url.to_vec(),
						) {
							Ok(v) => v,
							Err(e) => {
								log::info!("###### decode source_url error  {:?}", e);
								continue
							},
						};
						let options = scale_info::prelude::format!(
							"oracle_price --token_name={} --source_url={} --delay=45",
							token_name,
							source_url
						);
						//todo(publish oracle task)
						let _rt = match Self::publish_task(
							"registry.cn-shenzhen.aliyuncs.com/difttt/oracle_price:latest",
							&options,
							3,
						) {
							Ok(_i) => {
								log::info!("###### publish_task ok");

								match Self::offchain_unsigned_tx_recipe_done(
									block_number,
									*recipe_id,
								) {
									Ok(_) => {
										log::info!("###### submit_unsigned_transaction ok");
									},
									Err(e) => {
										log::info!(
											"###### submit_unsigned_transaction error  {:?}",
											e
										);
									},
								};
							},

							Err(e) => {
								log::info!("###### publish_task error  {:?}", e);
							},
						};
					},
					Some(Action::BuyToken(account_id, token_name, amount)) => {
						let token_name = match scale_info::prelude::string::String::from_utf8(
							token_name.to_vec(),
						) {
							Ok(v) => v,
							Err(e) => {
								log::info!("###### decode token_name error  {:?}", e);
								continue
							},
						};

						match Self::offchain_unsigned_tx_buy_token(
							block_number,
							*recipe_id,
							account_id,
							token_name.as_bytes().to_vec(),
							amount,
						) {
							Ok(_) => {
								log::info!("###### submit_unsigned_transaction ok");
								log::info!("###### BuyToken ok");
							},
							Err(e) => {
								log::info!("###### submit_unsigned_transaction error  {:?}", e);
							},
						};
					},
					_ => {},
				}
			}
		}
	}

	#[pallet::validate_unsigned]
	impl<T: Config> ValidateUnsigned for Pallet<T> {
		type Call = Call<T>;

		/// Validate unsigned call to this module.
		///
		/// By default unsigned transactions are disallowed, but implementing the validator
		/// here we make sure that some particular calls (the ones produced by offchain worker)
		/// are being whitelisted and marked as valid.
		fn validate_unsigned(_source: TransactionSource, call: &Self::Call) -> TransactionValidity {
			// Firstly let's check that we call the right function.
			let valid_tx = |provide| {
				ValidTransaction::with_tag_prefix("ocw-difttt")
					.priority(T::UnsignedPriority::get())
					.and_provides([&provide])
					.longevity(3)
					.propagate(true)
					.build()
			};

			match call {
				Call::set_recipe_done_unsigned { block_number: _, recipe_id: _ } =>
					valid_tx(b"set_recipe_done_unsigned".to_vec()),
				Call::buy_token_unsigned {
					block_number: _,
					buyer: _,
					token_name: _,
					amount: _,
				} => valid_tx(b"buy_token_unsigned".to_vec()),
				_ => InvalidTransaction::Call.into(),
			}
		}
	}

	impl<T: Config> Pallet<T> {
		/// Fetch current price and return the result in cents.
		fn fetch_price() -> Result<u64, http::Error> {
			let deadline = sp_io::offchain::timestamp().add(Duration::from_millis(2_000));
			// Initiate an external HTTP GET request.
			// This is using high-level wrappers from `sp_runtime`, for the low-level calls that
			// you can find in `sp_io`. The API is trying to be similar to `reqwest`, but
			// since we are running in a custom WASM execution environment we can't simply
			// import the library here.
			let request = http::Request::get(
				"https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD",
			);

			// We set the deadline for sending of the request, note that awaiting response can
			// have a separate deadline. Next we send the request, before that it's also possible
			// to alter request headers or stream body content in case of non-GET requests.
			let pending = request.deadline(deadline).send().map_err(|_| http::Error::IoError)?;

			// The request is already being processed by the host, we are free to do anything
			// else in the worker (we can send multiple concurrent requests too).
			// At some point however we probably want to check the response though,
			// so we can block current thread and wait for it to finish.
			// Note that since the request is being driven by the host, we don't have to wait
			// for the request to have it complete, we will just not read the response.
			let response =
				pending.try_wait(deadline).map_err(|_| http::Error::DeadlineReached)??;
			// Let's check the status code before we proceed to reading the response.
			if response.code != 200 {
				log::warn!("Unexpected status code: {}", response.code);
				return Err(http::Error::Unknown)
			}

			// Next we want to fully read the response body and collect it to a vector of bytes.
			// Note that the return object allows you to read the body in chunks as well
			// with a way to control the deadline.
			let body = response.body().collect::<Vec<u8>>();

			// Create a str slice from the body.
			let body_str = sp_std::str::from_utf8(&body).map_err(|_| {
				log::warn!("No UTF8 body");
				http::Error::Unknown
			})?;

			log::info!("fetch_price: {}", body_str);

			let price = match Self::parse_price(body_str) {
				Some(price) => Ok(price),
				None => {
					log::warn!("Unable to extract price from the response: {:?}", body_str);
					Err(http::Error::Unknown)
				},
			}?;

			log::info!("Got price: {} cents", price);

			Ok(price)
		}

		/// Parse the price from the given JSON string using `lite-json`.
		///
		/// Returns `None` when parsing failed or `Some(price in cents)` when parsing is successful.
		fn parse_price(price_str: &str) -> Option<u64> {
			let val = lite_json::parse_json(price_str);
			let price = match val.ok()? {
				JsonValue::Object(obj) => {
					let (_, v) =
						obj.into_iter().find(|(k, _)| k.iter().copied().eq("USD".chars()))?;
					match v {
						JsonValue::Number(number) => number,
						_ => return None,
					}
				},
				_ => return None,
			};

			let exp = price.fraction_length.checked_sub(2).unwrap_or(0);
			Some(price.integer as u64 * 100 + (price.fraction / 10_u64.pow(exp)) as u64)
		}

		/// Fetch current arh999 and return the result in cents.
		/// //fetch_arh999
		/// {"data":[[1655725195.0,0.3143,20827.92,35400.82,38982.87]],"code":200,"msg":"success"}
		/// => 31
		fn fetch_arh999() -> Result<u64, http::Error> {
			let deadline = sp_io::offchain::timestamp().add(Duration::from_millis(2_000));
			// Initiate an external HTTP GET request.
			// This is using high-level wrappers from `sp_runtime`, for the low-level calls that
			// you can find in `sp_io`. The API is trying to be similar to `reqwest`, but
			// since we are running in a custom WASM execution environment we can't simply
			// import the library here.
			let request = http::Request::get("http://127.0.0.1:8000/arh999");

			// We set the deadline for sending of the request, note that awaiting response can
			// have a separate deadline. Next we send the request, before that it's also possible
			// to alter request headers or stream body content in case of non-GET requests.
			let pending = request.deadline(deadline).send().map_err(|_| http::Error::IoError)?;

			// The request is already being processed by the host, we are free to do anything
			// else in the worker (we can send multiple concurrent requests too).
			// At some point however we probably want to check the response though,
			// so we can block current thread and wait for it to finish.
			// Note that since the request is being driven by the host, we don't have to wait
			// for the request to have it complete, we will just not read the response.
			let response =
				pending.try_wait(deadline).map_err(|_| http::Error::DeadlineReached)??;
			// Let's check the status code before we proceed to reading the response.
			if response.code != 200 {
				log::warn!("Unexpected status code: {}", response.code);
				return Err(http::Error::Unknown)
			}

			// Next we want to fully read the response body and collect it to a vector of bytes.
			// Note that the return object allows you to read the body in chunks as well
			// with a way to control the deadline.
			let body = response.body().collect::<Vec<u8>>();

			// Create a str slice from the body.
			let body_str = sp_std::str::from_utf8(&body).map_err(|_| {
				log::warn!("No UTF8 body");
				http::Error::Unknown
			})?;

			log::info!("fetch_arh999: {}", body_str);

			let arh_response_data: ArhResponseData = match serde_json::from_str(&body_str) {
				Ok(v) => v,
				Err(e) => {
					log::error!("fetch_arh999 ParseError error 1: {:?}", e);
					return Err(http::Error::Unknown)
				},
			};

			log::info!("Got last arh999 arh_response_data: {:?}", arh_response_data);

			let data = match scale_info::prelude::string::String::from_utf8(arh_response_data.data)
			{
				Ok(v) => v,
				Err(e) => {
					log::info!("###### decode source_url error  {:?}", e);
					return Err(http::Error::Unknown)
				},
			};

			let data = scale_info::prelude::format!("{}", data);

			let result: Vec<&str> = data.split('.').collect();

			let arh999_u64: u64 = match result[0].parse::<u64>() {
				Ok(v) => v,
				Err(e) => {
					log::info!("###### decode parse error1  {:?}", e);
					return Err(http::Error::Unknown)
				},
			};
			log::info!("### arh999_u64: {:?}", &arh999_u64);

			let new_substring = result[1].get(0..ARH999_DECIMAL_PRECISION).unwrap();

			log::info!("### new_substring: {:?}", &new_substring);

			let arh999_sub: u64 = match new_substring.parse::<u64>() {
				Ok(v) => v,
				Err(e) => {
					log::info!("###### decode parse error2  {:?}", e);
					return Err(http::Error::Unknown)
				},
			};
			log::info!("### format_data: {:?}", &arh999_sub);

			let arh999 = arh999_u64 as u64 * 100 + arh999_sub as u64;

			log::info!("Got arh999: {}", arh999);

			Ok(arh999)
		}

		fn publish_task(
			dockr_url: &str,
			options: &str,
			max_run_num: u64,
		) -> Result<u64, http::Error> {
			let deadline = sp_io::offchain::timestamp().add(Duration::from_millis(10_000));
			let dockr_url = BASE64.encode(dockr_url.as_bytes());
			let options = BASE64.encode(options.as_bytes());

			//let url = "https://reqbin.com/echo/post/json";
			let url = "http://127.0.0.1:8000/".to_owned() +
				&dockr_url.to_owned() +
				"/" + &options.to_owned() +
				"/" + &max_run_num.to_string();

			let request = http::Request::get(&url).add_header("content-type", "application/json");

			let pending = request.deadline(deadline).send().map_err(|e| {
				log::info!("####post pending error: {:?}", e);
				http::Error::IoError
			})?;

			let response = pending.try_wait(deadline).map_err(|e| {
				log::info!("####post response error: {:?}", e);
				http::Error::DeadlineReached
			})??;

			if response.code != 200 {
				log::info!("Unexpected status code: {}", response.code);
				return Err(http::Error::Unknown)
			}

			let body = response.body().collect::<Vec<u8>>();

			// Create a str slice from the body.
			let body_str = sp_std::str::from_utf8(&body).map_err(|_| {
				log::info!("No UTF8 body");
				http::Error::Unknown
			})?;

			if "ok" != body_str {
				log::info!("publish task fail: {}", body_str);
				return Err(http::Error::Unknown)
			}

			Ok(0)
		}

		fn offchain_unsigned_tx_recipe_done(
			block_number: T::BlockNumber,
			recipe_id: u64,
		) -> Result<(), Error<T>> {
			let call = Call::set_recipe_done_unsigned { block_number, recipe_id };

			SubmitTransaction::<T, Call<T>>::submit_unsigned_transaction(call.into()).map_err(|e| {
				log::error!("Failed in offchain_unsigned_tx {:?}", e);
				<Error<T>>::OffchainUnsignedTxError
			})
		}

		fn offchain_unsigned_tx_buy_token(
			block_number: T::BlockNumber,
			_recipe_id: u64,
			buyer: T::AccountId,
			token_name: Vec<u8>,
			amount: u64,
		) -> Result<(), Error<T>> {
			let call = Call::buy_token_unsigned { block_number, buyer, token_name, amount };

			SubmitTransaction::<T, Call<T>>::submit_unsigned_transaction(call.into()).map_err(|e| {
				log::error!("Failed in offchain_unsigned_tx {:?}", e);
				<Error<T>>::OffchainUnsignedTxError
			})
		}
	}

	impl<T: Config> BlockNumberProvider for Pallet<T> {
		type BlockNumber = T::BlockNumber;

		fn current_block_number() -> Self::BlockNumber {
			<frame_system::Pallet<T>>::block_number()
		}
	}
}
