#![cfg_attr(not(feature = "std"), no_std)]

use codec::HasCompact;
use frame_support::{
	dispatch::DispatchResult,
	pallet_prelude::*,
	traits::{
		Randomness,
		fungibles::{Inspect as MultiAssets, Transfer,Mutate as MultiAssetsMutate},
		tokens::nonfungibles::{Create, Inspect, Mutate},
		 ReservableCurrency,
	},
	transactional, PalletId, RuntimeDebug,
};

use frame_system::{
	pallet_prelude::*,
	RawOrigin,
};
use num_integer::Roots;

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://substrate.dev/docs/en/knowledgebase/runtime/frame>
pub use pallet::*;
use pallet_support::{ uniqueid::UniqueIdGenerator};
use pallet_uniques::WeightInfo;
use scale_info::{
	prelude::format,
	TypeInfo,
};
use sp_core::{sr25519, H256};
use bitcoin_hashes::ripemd160 as Ripemd;
use bitcoin_hashes::sha256 as Sha256;
use bitcoin_hashes::Hash as OtherHash;
use sp_runtime::{
	traits::{
		AccountIdConversion, AtLeast32BitUnsigned, CheckedAdd, One, 
		StaticLookup, Verify,
	},
	
};

use sp_std::{convert::From, prelude::*};

type BalanceOf<T> =
<<T as Config>::Currencies as MultiAssets<<T as frame_system::Config>::AccountId>>::Balance;
type AssetIdOf<T> =
<<T as Config>::Currencies as MultiAssets<<T as frame_system::Config>::AccountId>>::AssetId;


#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;


mod impl_nonfungibles;


#[derive(Eq, PartialEq, Copy, Clone, RuntimeDebug, Encode, Decode, TypeInfo)]
pub enum DeviceStatus {
	/// Registered
	Registered = 0,
	/// Activated
	Activated = 1,
	/// Voided
	Voided = 2,
}

impl Default for DeviceStatus {
	fn default() -> Self {
		DeviceStatus::Registered
	}
}


#[derive(Eq, PartialEq, Copy, Clone, RuntimeDebug, Encode, Decode, TypeInfo)]
pub enum SportType {
	/// SkippingRope
	SkippingRope = 0,
	/// Run
	Run = 1,
	/// Bicycle
	Bicycle = 2,
}

impl Default for SportType {
	fn default() -> Self {
		SportType::SkippingRope
	}
}

#[derive(Eq, PartialEq, Copy, Clone, RuntimeDebug, Encode, Decode, TypeInfo)]
pub enum Rarity {
	/// Common
	Common = 0,
	/// Elite
	Elite = 1,
	/// Rare
	Rare = 2,
	/// Epic
	Epic = 3,
}

impl Default for Rarity {
	fn default() -> Self {
		Rarity::Common
	}
}


#[derive(Eq, PartialEq, Clone, RuntimeDebug, Encode, Decode, TypeInfo)]
#[scale_info(skip_type_params(StringLimit))]
pub struct User<Account,BlockNumber> {
	owner: Account,
	energy_total: u16,
	energy: u16,
	create_block:BlockNumber,
	last_block:BlockNumber,
}


#[derive(Eq, PartialEq, Copy, Clone, RuntimeDebug, Encode, Decode, TypeInfo)]
pub struct Producer<Account, ProducerId, Balance> {
	owner: Account,
	id: ProducerId,
	account: Account,
	activated: u32,
	registered: u32,
	voided: u32,
	bond: Balance,
}

#[derive(Eq, PartialEq, Clone, RuntimeDebug, Encode, Decode, TypeInfo)]
#[scale_info(skip_type_params(StringLimit))]
pub struct DeviceType<ClassId, ProducerId, StringLimit: Get<u32>> {
	class_id: ClassId,
	sport_type: SportType,
	note: BoundedVec<u8, StringLimit>,
	producer_id: ProducerId,
}


#[derive(Eq, PartialEq, Copy, Clone, RuntimeDebug, Encode, Decode, TypeInfo)]
pub struct Device<Class, ProducerId, Instance> {
	class_id: Class,
	sport_type: SportType,
	instance_id: Option<Instance>,
	producer_id: ProducerId,
	status: DeviceStatus,
	pk: H256,
	nonce: u32,
	new:u8,
	timestamp:u32,
}

#[derive(Encode, Decode, Default, Eq, PartialEq, RuntimeDebug, TypeInfo)]
pub struct DeviceVFE<Class, Instance, Hash,BlockNumber> {
	class_id: Class,
	instance_id: Instance,
	efficiency: u16,
	skill: u16,
	luck: u16,
	durable: u16,
	rarity: Rarity,
	level: u8,
	electric: u16,
	gene: Hash,
	is_update: bool,
	last_block:BlockNumber,
}

#[derive(Encode, Decode, Default, Eq, PartialEq, RuntimeDebug, TypeInfo)]
pub struct Item<Class, Instance> {
	class_id: Class,
	instance_id: Instance,
}

#[frame_support::pallet]
pub mod pallet {
	use super::*;

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config + pallet_uniques::Config<Self::UniquesInstance> {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
	
		///  To control certain logic in admin
		type CreateOrigin: EnsureOrigin<Self::Origin>;

		/// To control certain logic, a specific role is required to operate.
		type RoleOrigin: EnsureOrigin<Self::Origin, Success=Self::AccountId>;

		/// ProducerId
		type ProducerId: Parameter + Member + AtLeast32BitUnsigned + Default + Copy + HasCompact;

		/// Multiple asset types
		type Currencies: MultiAssets<Self::AccountId>
		+ Transfer<Self::AccountId> + MultiAssetsMutate<Self::AccountId>;

		/// UniqueId is used to generate new ClassId or InstanceId.
		type UniqueId: UniqueIdGenerator<ClassId=Self::ClassId, AssetId=AssetIdOf<Self>, InstanceId=Self::InstanceId>;

		/// The pallet id
		#[pallet::constant]
		type PalletId: Get<PalletId>;

		/// Randomness
		type Randomness: Randomness<Self::Hash, Self::BlockNumber>;

		/// The currency in which the crowdfunds will be denominated
		type Currency: ReservableCurrency<Self::AccountId, Balance=BalanceOf<Self>>;

		/// pallet-uniques instance
		type UniquesInstance: Copy + Clone + PartialEq + Eq;

		#[pallet::constant]
		type MaxGenerateRandom: Get<u32>;

		#[pallet::constant]
		type CommonMin: Get<u16>;

		#[pallet::constant]
		type CommonMax: Get<u16>;

		#[pallet::constant]
		type EliteMin: Get<u16>;

		#[pallet::constant]
		type EliteMax: Get<u16>;

		#[pallet::constant]
		type RareMin: Get<u16>;

		#[pallet::constant]
		type RareMax: Get<u16>;

		#[pallet::constant]
		type EpicMin: Get<u16>;

		#[pallet::constant]
		type EpicMax: Get<u16>;

		#[pallet::constant]
		type Electric: Get<u16>;


		#[pallet::constant]
		type UnbindFee: Get<BalanceOf<Self>>;

		#[pallet::constant]
		type IncentiveToken: Get<AssetIdOf<Self>>;

		#[pallet::constant]
		type NativeToken: Get<AssetIdOf<Self>>;
	}

	#[pallet::pallet]
	#[pallet::generate_store(pub (super) trait Store)]
	pub struct Pallet<T>(_);

	#[pallet::storage]
	#[pallet::getter(fn next_producer_index)]
	// Next Producer Index .
	pub type NextProducerIndex<T: Config> = StorageValue<_, T::ProducerId, ValueQuery>;


	#[pallet::storage]
	#[pallet::getter(fn nonce)]
	pub type Nonce<T> = StorageValue<_, u8, ValueQuery>;


	#[pallet::storage]
	#[pallet::getter(fn producers)]
	pub(crate) type Producers<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		T::ProducerId,
		Producer<T::AccountId, T::ProducerId, BalanceOf<T>>,
		OptionQuery,
	>;


	#[pallet::storage]
	#[pallet::getter(fn device_types)]
	pub(crate) type DeviceTypes<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		T::ClassId,
		DeviceType<T::ClassId, T::ProducerId, T::StringLimit>,
		OptionQuery,
	>;

	#[pallet::storage]
	#[pallet::getter(fn users)]
	pub(crate) type Users<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		T::AccountId,
		User<T::AccountId,T::BlockNumber>,
		OptionQuery,
	>;



	#[pallet::storage]
	#[pallet::getter(fn devices)]
	pub(crate) type Devices<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		H256,
		Device<T::ClassId, T::ProducerId, T::InstanceId>,
		OptionQuery,
	>;


	#[pallet::storage]
	#[pallet::getter(fn device_vfes)]
	pub(super) type DeviceVFEs<T: Config> = StorageDoubleMap<
		_,
		Blake2_128Concat,
		T::ClassId,
		Twox64Concat,
		T::InstanceId,
		DeviceVFE<T::ClassId, T::InstanceId, T::Hash,T::BlockNumber>,
		OptionQuery,
	>;


	#[pallet::storage]
	#[pallet::getter(fn public_key)]
	pub(crate) type PublicKey<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		H256,
		u8,
		OptionQuery,
	>;



	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
		// fn on_finalize (now: T::BlockNumber) {
		fn on_initialize(now: T::BlockNumber) -> Weight {
			Users::<T>::iter_values().for_each(|value| {
				let _ = Users::<T>::try_mutate(
					value.owner,
					|maybe_details| -> Result<(), DispatchError> {
						let user = maybe_details
							.as_mut()
							.ok_or(Error::<T>::UserNotExist)?;

						if now > user.last_block + T::BlockNumber::from(43200u32){
							user.last_block = user.last_block + T::BlockNumber::from(43200u32);
							user.energy = user.energy_total;
						}

						Ok(())
					},
				);
			});
			0
		}
	}

	// Pallets use events to inform users when important changes are made.
	// https://substrate.dev/docs/en/knowledgebase/runtime/events
	#[pallet::event]
	#[pallet::generate_deposit(pub (super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Register Producer . \[creater, producer_id, account_id\]
		ProducerRegister(T::AccountId, T::ProducerId, T::AccountId),

		/// producer change the owner  \[former_owner, producer_id,  new_owner\]
		ProducerOwnerChanged(T::AccountId, T::ProducerId, T::AccountId),

		///  producer charge the bond   \[former_owner, producer_id,  asset_id, balance \]
		ProducerCharge(T::AccountId, T::ProducerId, AssetIdOf<T>, BalanceOf<T>),

		/// producer withdraw the bond  \[former_owner, producer_id,  asset_id, balance \]
		ProducerWithdraw(T::AccountId, T::ProducerId, AssetIdOf<T>, BalanceOf<T>),

		/// Created device type class. \[executor, class_id,producer_id,sport_type,  note\]
		DeviceTypeCreate(T::AccountId, T::ClassId, T::ProducerId, SportType, Vec<u8>),

		/// Register device. \[producer, public_key,  class\]
		RegisterDevice(T::AccountId, H256, T::ClassId),

		/// Create DeviceVFE. \[miner, class_id, instance_id, note  note\]
		CreateDeviceVFE(T::AccountId, T::ClassId, T::InstanceId, Rarity),

		/// Minted Art Toy vfe token. \[class, instance, owner\]
		Issued(T::ClassId, T::InstanceId, T::AccountId),

		/// An asset `instance` was transferred. \[ class, instance, from, to \]
		Transferred(T::ClassId, T::InstanceId, T::AccountId, T::AccountId),

		/// An asset `instance` was destroyed. \[ class, instance, owner \]
		Burned(T::ClassId, T::InstanceId, T::AccountId),

		/// Bind the device with vfe. \[ owner,public_key, class, instance  \]
		BindDevice(T::AccountId, H256, T::ClassId,T::InstanceId),

		/// UnBind the device with vfe. \[ owner,public_key, class,former instance  \]
		UnBindDevice(T::AccountId, H256, T::ClassId,T::InstanceId),

		/// Award from device with vfe. \[ owner, target_amount  \]
		SportAward(T::AccountId, BalanceOf<T>),
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// OperationIsNotAllowed
		OperationIsNotAllowed,
		/// ClassNotFound
		ClassNotFound,
		/// RoleInvalid
		RoleInvalid,
		/// Error names should be descriptive.
		NoneValue,
		/// ValueOverflow
		ValueOverflow,
		/// ProducerNotExist
		ProducerNotExist,
		/// DeviceTypeNotExist
		DeviceTypeNotExist,
		/// DeviceNotExist
		DeviceNotExist,
		/// DeviceNotAnyBind
		DeviceNotAnyBind,
		/// DeviceTimeStampMustGreaterThanBefore
		DeviceTimeStampMustGreaterThanBefore,
		/// OperationIsNotAllowedForProducer
		OperationIsNotAllowedForProducer,
		/// OperationIsNotAllowedForSign
		OperationIsNotAllowedForSign,
		/// NonceMustGreatThanBefore
		NonceMustGreatThanBefore,
		/// BalanceNotEnough
		BalanceNotEnough,
		/// PublicKeyExist
		PublicKeyExist,
		/// ToolSeriesNotExist
		ToolSeriesNotExist,
		/// ToolParamNotExist
		ToolParamNotExist,
		/// ToolParamValueNotExist
		ToolParamValueNotExist,
		/// OperationIsNotAllowedForTool
		OperationIsNotAllowedForTool,
		/// InstanceNotFound
		InstanceNotFound,
		/// InstanceIdCannotBeNull
		InstanceIdCannotBeNull,
		/// InstanceNotBelongAnyone
		InstanceNotBelongAnyone,
		/// InstanceNotBelongTheTarget
		InstanceNotBelongTheTarget,
		/// DeviceNotBindAnyvfe
		DeviceNotBindAnyvfe,
		/// DeviceMsgNotCanNotBeDecode
		DeviceMsgNotCanNotBeDecode,
		/// DeviceMsgDecodeErr
		DeviceMsgDecodeErr,
		/// VFENotExist
		VFENotExist,
		/// VFENotFullElectric
		VFENotFullElectric,
		/// VFEUpdating
		VFEUpdating,
		/// UserNotExist
		UserNotExist,
	}

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// register_producer -Register the Producer
		/// - origin AccountId -creater
		#[pallet::weight(10_000)]
		#[transactional]
		pub fn producer_register(
			origin: OriginFor<T>,
		) -> DispatchResult {
			// Get identity role of origin
			let who = T::RoleOrigin::ensure_origin(origin.clone())?;

			let index = NextProducerIndex::<T>::try_mutate(
				|id| -> Result<T::ProducerId, DispatchError> {
					let current_id = *id;
					*id = id.checked_add(&One::one()).ok_or(Error::<T>::ValueOverflow)?;
					Ok(current_id)
				},
			)?;

			let account_id = Self::into_account_id(index.clone());

			Producers::<T>::insert(index.clone(), Producer {
				owner: who.clone(),
				id: index.clone(),
				account: account_id.clone(),
				activated: 0u32,
				registered: 0u32,
				voided: 0u32,
				bond: BalanceOf::<T>::from(0u32),
			});

			Self::deposit_event(Event::ProducerRegister(who, index, account_id));
			Ok(())
		}


		/// register_producer -Register the Producer
		/// - origin AccountId -creater
		#[pallet::weight(10_000)]
		#[transactional]
		pub fn producer_owner_change(
			origin: OriginFor<T>,
			id: T::ProducerId,
			new_owner: <T::Lookup as StaticLookup>::Source,
		) -> DispatchResult {
			// Get identity role of origin
			let owner = T::RoleOrigin::ensure_origin(origin.clone())?;

			let new_owner = T::Lookup::lookup(new_owner)?;

			// check the role if it meets the rules
			T::RoleOrigin::ensure_origin(RawOrigin::Signed(new_owner.clone()).into())
				.map_err(|_| Error::<T>::RoleInvalid)?;

			let mut producer = Self::check_producer(owner.clone(), id)?;

			// change the new owner
			producer.owner = new_owner.clone();

			Producers::<T>::insert(producer.id, producer);

			// save it to event
			Self::deposit_event(Event::ProducerOwnerChanged(owner, id, new_owner));

			Ok(())
		}

		/// producer_charge - Owner charge the bond to  the Producer
		/// - origin AccountId -creater
		/// - producer_id ProducerId -producer
		/// - amount Balance -target amount
		/// - asset_id AssetId - Asset ID
		#[pallet::weight(10_000)]
		#[transactional]
		pub fn producer_charge(
			origin: OriginFor<T>,
			producer_id: T::ProducerId,
			asset_id: AssetIdOf<T>,
			amount: BalanceOf<T>,
		) -> DispatchResult {
			// Get identity role of origin
			let owner = T::RoleOrigin::ensure_origin(origin.clone())?;

			// get the producer
			let mut producer = Self::check_producer(owner.clone(), producer_id)?;

			// check out the owner_balance
			let owner_balance = T::Currencies::balance(asset_id, &owner);

			// check the owner's balance greater or equal to the target amount
			ensure!(owner_balance >= amount, Error::<T>::BalanceNotEnough);

			let producer_account = producer.account.clone();

			// try to transfer the charge
			T::Currencies::transfer(
				asset_id,
				&owner,
				&producer_account,
				amount,
				true,
			)?;

			let producer_balance = T::Currencies::balance(asset_id, &producer_account);

			// change the bond
			producer.bond = producer_balance;

			// update the producer
			Producers::<T>::insert(producer.id, producer);

			// save it to event
			Self::deposit_event(Event::ProducerCharge(owner, producer_id, asset_id, amount));

			Ok(())
		}

		/// producer_withdraw - Owner withdraw the bond from the Producer
		/// - origin AccountId -creater
		/// - producer_id ProducerId -producer
		/// - amount Balance -target amount
		/// - asset_id AssetId - Asset ID
		#[pallet::weight(10_000)]
		#[transactional]
		pub fn producer_withdraw(
			origin: OriginFor<T>,
			producer_id: T::ProducerId,
			asset_id: AssetIdOf<T>,
			amount: BalanceOf<T>,
		) -> DispatchResult {
			// Get identity role of origin
			let owner = T::RoleOrigin::ensure_origin(origin.clone())?;

			// get the producer
			let mut producer = Self::check_producer(owner.clone(), producer_id)?;

			// check out the producer account
			let producer_account = producer.account.clone();

			// get the producer bond balance
			let producer_balance = T::Currencies::balance(asset_id, &producer_account);

			// check the owner's balance greater or equal to the target amount
			ensure!(producer_balance >= amount, Error::<T>::BalanceNotEnough);

			// try to transfer the charge
			T::Currencies::transfer(
				asset_id,
				&producer_account,
				&owner,
				amount,
				true,
			)?;

			// change the bond
			producer.bond = producer_balance;

			// update the producer
			Producers::<T>::insert(producer.id, producer);

			// save it to event
			Self::deposit_event(Event::ProducerWithdraw(owner, producer_id, asset_id, amount));

			Ok(())
		}


		/// create_class 
		/// - origin AccountId 
		/// - class_id ClassId 
		/// - meta_data Vec<u8> 
		#[pallet::weight(< T as pallet_uniques::Config < T::UniquesInstance >>::WeightInfo::create()
		+ < T as pallet_uniques::Config < T::UniquesInstance >>::WeightInfo::set_class_metadata())]
		#[transactional]
		pub fn device_type_create(
			origin: OriginFor<T>,
			meta_data: BoundedVec<u8, T::StringLimit>,
			producer_id: T::ProducerId,
			sport_type: SportType,
		) -> DispatchResult {
			// Get identity role of origin
			let who = T::RoleOrigin::ensure_origin(origin.clone())?;

			let producer = Self::check_producer(who.clone(), producer_id)?;

			let class = T::UniqueId::generate_class_id()?;
			// let meta_data = meta_data.unwrap_or(Default::default());

			pallet_uniques::Pallet::<T, T::UniquesInstance>::create_class(&class, &who, &who)?;
			pallet_uniques::Pallet::<T, T::UniquesInstance>::set_class_metadata(
				origin.clone(),
				class.clone(),
				meta_data.clone(),
				false,
			)?;


			DeviceTypes::<T>::insert(
				class.clone(),
				DeviceType {
					class_id: class.clone(),
					note: meta_data.clone(),
					sport_type: sport_type.clone(),
					producer_id: producer.id.clone(),
				},
			);

			Self::deposit_event(Event::DeviceTypeCreate(who, class, producer.id, sport_type, Vec::<u8>::from(meta_data)));

			Ok(())
		}



		/// register_device 
		/// - origin AccountId 
		/// - puk   H256  
		/// - producer_id ProducerId 
		/// - class ClassId 
		#[pallet::weight(10_000)]
		#[transactional]
		pub fn register_device(
			origin: OriginFor<T>,
			puk: H256,
			producer_id: T::ProducerId,
			class: T::ClassId,
		) -> DispatchResult {
			let admin = T::RoleOrigin::ensure_origin(origin.clone())?;

			ensure!(!PublicKey::<T>::contains_key(puk), Error::<T>::PublicKeyExist);

			let producer = Self::check_producer(admin.clone(), producer_id)?;

			let device_type = DeviceTypes::<T>::get(class.clone()).ok_or(Error::<T>::DeviceTypeNotExist)?;

			let class_owner = Self::class_owner(&class).ok_or(Error::<T>::ClassNotFound)?;
			ensure!(admin == class_owner, Error::<T>::OperationIsNotAllowed);


			PublicKey::<T>::insert(puk, 1u8);

			Devices::<T>::insert(puk, Device {
				class_id: class,
				instance_id: None,
				producer_id: producer.id.clone(),
				status: DeviceStatus::Registered,
				pk: puk,
				nonce: 0u32,
				new:1u8,
				sport_type : device_type.sport_type,
				timestamp:0u32,
			});


			Self::deposit_event(Event::RegisterDevice(admin.clone(), puk, class.clone()));

			Ok(())
		}


		/// bind_device
		#[pallet::weight(10_000)]
		#[transactional]
		pub fn bind_device(
			origin: OriginFor<T>,
			puk: H256,
			req_sig: BoundedVec<u8, T::StringLimit>,
			nonce:u32,
			ins_opt : Option<T::InstanceId>,
		) -> DispatchResult {
			let from = ensure_signed(origin.clone())?;

			let mut device = Self::check_device_pub(from.clone(),puk,req_sig,nonce)?;

			// create the user if it is new
			Self::create_new_user(from.clone())?;

			// In this case, if the device is
			if device.new == 1u8{
				// create the new instance
				let instance = Self::create_vfe(device.class_id.clone(), from.clone(),Rarity::Common)?;

				device.instance_id = Some(instance);
				device.new = 0u8;

				Devices::<T>::insert(puk, device);
				Self::deposit_event(Event::BindDevice(from, puk, device.class_id,instance));

			}else{
				let instance = ins_opt.ok_or(Error::<T>::InstanceIdCannotBeNull)?;


				if device.instance_id.is_some(){

					let unbind_fee = T::UnbindFee::get();

					let native_asset = T::NativeToken::get();

					let target_account = Self::into_account_id(device.producer_id);

					// try to transfer the charge
					T::Currencies::transfer(
						native_asset,
						&from,
						&target_account,
						unbind_fee,
						true,
					)?;
				}

				device.instance_id = Some(instance);

				Devices::<T>::insert(puk, device);

				Self::deposit_event(Event::BindDevice(from, puk, device.class_id,instance));
			}




			Ok(())
		}


		/// unbind the device
		#[pallet::weight(10_000)]
		#[transactional]
		pub fn unbind_device(
			origin: OriginFor<T>,
			puk: H256,
			req_sig: BoundedVec<u8, T::StringLimit>,
			nonce:u32,
		) -> DispatchResult {
			let from = ensure_signed(origin.clone())?;

			let mut device = Self::check_device_pub(from.clone(),puk,req_sig,nonce)?;

			// check the owner's balance greater or equal to the target amount
			let former_instance = device.instance_id.ok_or(Error::<T>::DeviceNotBindAnyvfe)?;

			let unbind_fee = T::UnbindFee::get();

			let native_asset = T::NativeToken::get();

			let target_account = Self::into_account_id(device.producer_id);
			// try to transfer the charge
			T::Currencies::transfer(
				native_asset,
				&from,
				&target_account,
				unbind_fee,
				true,
			)?;

			device.instance_id = None;

			Devices::<T>::insert(puk, device);

			Self::deposit_event(Event::UnBindDevice(from, puk, device.class_id,former_instance));

			Ok(())
		}


		/// sport_upload update the data to the chain
		///  - origin AccountId
		/// - puk H256
		/// - req_sig BoundedVec<u8, T::StringLimit>
		/// - msg AccountId BoundedVec<u8, T::StringLimit>
		#[pallet::weight(10_000)]
		#[transactional]
		pub fn sport_upload(
			origin: OriginFor<T>,
			puk: H256,
			req_sig: BoundedVec<u8, T::StringLimit>,
			msg: BoundedVec<u8, T::StringLimit>,
		) -> DispatchResult {
			let from = ensure_signed(origin.clone())?;

			let mut device = Self::check_device_data(from.clone(),puk,req_sig,msg.clone())?;

			// decode the msg and earn the award
			Self::decode_device_msg(&mut device,from,msg)?;

			Ok(())
		}


		/// transfer vfe
		/// - origin AccountId
		/// - class ClassId
		/// - instance InstanceId
		/// - Source AccountId
		#[pallet::weight(<T as pallet_uniques::Config<T::UniquesInstance>>::WeightInfo::transfer())]
		pub fn transfer(
			origin: OriginFor<T>,
			#[pallet::compact] class: T::ClassId,
			#[pallet::compact] instance: T::InstanceId,
			dest: <T::Lookup as StaticLookup>::Source,
		) -> DispatchResult {
			let from = ensure_signed(origin.clone())?;
			let to = T::Lookup::lookup(dest.clone())?;

			let vfe = DeviceVFEs::<T>::get(class,instance).ok_or(Error::<T>::VFENotExist)?;

			ensure!(vfe.electric == T::Electric::get(), Error::<T>::VFENotFullElectric);

			ensure!(!vfe.is_update , Error::<T>::VFEUpdating);

			pallet_uniques::Pallet::<T, T::UniquesInstance>::transfer(
				origin,
				class.clone(),
				instance.clone(),
				dest,
			)?;
			Self::deposit_event(Event::Transferred(class, instance, from, to));
			Ok(())
		}


	}

}


impl<T: Config> Pallet<T> {
	pub fn do_mint(
		class_id: T::ClassId,
		instance_id: T::InstanceId,
		owner: T::AccountId,
	) -> DispatchResult {
		pallet_uniques::Pallet::<T, T::UniquesInstance>::mint_into(
			&class_id,
			&instance_id,
			&owner,
		)?;
		Self::deposit_event(Event::Issued(class_id, instance_id, owner));
		Ok(())
	}

	pub fn do_burn(class_id: T::ClassId, instance_id: T::InstanceId) -> DispatchResult {
		let owner = Self::owner(&class_id, &instance_id).ok_or(Error::<T>::InstanceNotFound)?;
		pallet_uniques::Pallet::<T, T::UniquesInstance>::burn_from(&class_id, &instance_id)?;
		Self::deposit_event(Event::Burned(class_id, instance_id, owner));
		Ok(())
	}


	/// The account ID of the Producer.
	pub fn into_account_id(id: T::ProducerId) -> T::AccountId {
		T::PalletId::get().into_sub_account(id)
	}


	fn get_and_increment_nonce() -> Vec<u8> {
		let nonce = Nonce::<T>::get();
		Nonce::<T>::put(nonce.wrapping_add(1));
		nonce.encode()
	}

	fn generate_random_number() -> (u32, T::Hash, T::BlockNumber) {
		let nonce = Self::get_and_increment_nonce();
		let (random_seed, block_number) = T::Randomness::random(&nonce);
		let random_number = <u32>::decode(&mut random_seed.as_ref())
			.expect("secure hashes should always be bigger than u32; qed");
		(random_number, random_seed, block_number)
	}

	// Randomly choose a winner from among the total number of participants.
	fn choose_winner_num(total: u16) -> u16 {
		let (mut random_number, _, _) = Self::generate_random_number();

		// Best effort attempt to remove bias from modulus operator.
		for _ in 1..T::MaxGenerateRandom::get() {
			if random_number < u32::MAX - u32::MAX % (total as u32) {
				break;
			}

			let (random_number2, _, _) = Self::generate_random_number();
			random_number = random_number2;
		}

		(random_number as u16) % total
	}

	// Randomly choose a winner from among the total number of participants.
	fn choose_winner(total: u32) -> (u32, T::Hash, T::BlockNumber) {
		let (mut random_number, mut random_seed, mut block_number) = Self::generate_random_number();

		// Best effort attempt to remove bias from modulus operator.
		for _ in 1..T::MaxGenerateRandom::get() {
			if random_number < u32::MAX - u32::MAX % total {
				break;
			}

			let (random_number2, random_seed2, block_number2) = Self::generate_random_number();
			random_number = random_number2;
			random_seed = random_seed2;
			block_number = block_number2;
		}

		(random_number % total, random_seed, block_number)
	}

	// check the device's public key.
	fn check_device_pub(
						account:T::AccountId,
						puk: H256,
						req_sig: BoundedVec<u8, T::StringLimit>,
						nonce: u32,
	) -> Result<Device<T::ClassId, T::ProducerId, T::InstanceId>, sp_runtime::DispatchError> {
		// get the producer owner
		let mut device =
			Devices::<T>::get(puk).ok_or(Error::<T>::DeviceNotExist)?;

		let pk = sr25519::Public::from_h256(device.pk.clone());

		let target = &req_sig[..];

		let mut nonce_account = nonce.clone().encode();

		let account_rip160 = Ripemd::Hash::hash(account.encode().as_ref());

		nonce_account.append(&mut account_rip160.encode());

		// check the validity of the signature
		let flag = sr25519::Signature::from_slice(target)
			.verify(Sha256::Hash::hash(&nonce_account.as_ref()).encode().as_ref(), &pk);

		ensure!(flag, Error::<T>::OperationIsNotAllowedForSign);

		// check the nonce
		ensure!(nonce > device.nonce, Error::<T>::NonceMustGreatThanBefore);

		device.nonce = nonce;

		Devices::<T>::insert(puk, device.clone());

		Ok(device)
	}

	// check the device's public key.
	fn check_device_data(
		account:T::AccountId,
		puk: H256,
		req_sig: BoundedVec<u8, T::StringLimit>,
		msg: BoundedVec<u8, T::StringLimit>,
	) -> Result<Device<T::ClassId, T::ProducerId, T::InstanceId>, sp_runtime::DispatchError> {
		// get the producer owner
		let  device =
			Devices::<T>::get(puk).ok_or(Error::<T>::DeviceNotExist)?;

		let instance = device.instance_id.ok_or(Error::<T>::DeviceNotAnyBind)?;

		let device_owner = Self::owner(&device.class_id,&instance).ok_or(Error::<T>::InstanceNotBelongAnyone)?;

		ensure!(account == device_owner, Error::<T>::InstanceNotBelongTheTarget);

		let pk = sr25519::Public::from_h256(device.pk.clone());

		let target = &req_sig[..];

		// check the validity of the signature
		let flag = sr25519::Signature::from_slice(target)
			.verify(Sha256::Hash::hash(&msg.as_ref()).encode().as_ref(), &pk);

		ensure!(flag, Error::<T>::OperationIsNotAllowedForSign);


		Ok(device)
	}


	// decode the device's message.
	fn decode_device_msg(
		device: &mut Device<T::ClassId, T::ProducerId, T::InstanceId>,
		account:T::AccountId,
		msg: BoundedVec<u8, T::StringLimit>,
	) -> Result<(), sp_runtime::DispatchError> {

		let class_id = device.class_id;

		let instance_id = device.instance_id.ok_or(Error::<T>::DeviceNotBindAnyvfe)?;

		let sport_type = device.sport_type;

		match sport_type{
			SportType::SkippingRope =>{
				ensure!(msg.len() == 14, Error::<T>::DeviceMsgNotCanNotBeDecode);

				let mut timestamp_vec = &msg[0..4];
				// let mode = msg[4];
				let mut skipping_duration_vec = &msg[5..7];
				// let mut skipping_times_vec = &msg[7..9];
				let mut average_frequency_vec =  &msg[9..11];
				let mut maximum_skipping_vec =  &msg[11..13];
				let rope_tying_times = msg[13];

				let timestamp = u32::decode(&mut timestamp_vec).map_err(|_| Error::<T>::DeviceMsgDecodeErr)?;
				let skipping_duration = u16::decode(&mut skipping_duration_vec).map_err(|_| Error::<T>::DeviceMsgDecodeErr)?;
				// let skipping_times = u16::decode(&mut skipping_times_vec).map_err(|_| Error::<T>::DeviceMsgDecodeErr)?;
				let average_frequency = u16::decode(&mut average_frequency_vec).map_err(|_| Error::<T>::DeviceMsgDecodeErr)?;
				let maximum_skipping = u16::decode(&mut maximum_skipping_vec).map_err(|_| Error::<T>::DeviceMsgDecodeErr)?;


				ensure!(timestamp > device.timestamp, Error::<T>::DeviceTimeStampMustGreaterThanBefore);


				let mut vfe = DeviceVFEs::<T>::get(class_id,instance_id).ok_or(Error::<T>::VFENotExist)?;

				let mut user = Users::<T>::get(account.clone()).ok_or(Error::<T>::UserNotExist)?;

				let mut electric_use = skipping_duration / 60u16;

				// check the user energy
				if electric_use > user.energy {
					electric_use = user.energy;
				}

				// check the vfe electric
				if electric_use >  vfe.electric{
					electric_use = vfe.electric;
				}

				user.energy = user.energy - electric_use;
				vfe.electric = vfe.electric.clone() - electric_use;
				device.timestamp = timestamp;




				let r = Self::choose_winner_num(100u16);
				let k = 120u16;
				

				let mut r_luck = (r % vfe.luck) + 1;
				let r_skill = (vfe.skill * maximum_skipping) / ( ( (rope_tying_times as u16) + 1u16) * k);
				let s_skill = r % (vfe.skill - r_skill );

				let e_skill:u16;
				if vfe.skill > r_skill {
					e_skill = vfe.skill - s_skill;
				}else{
					e_skill = vfe.skill + s_skill
				}


				let e :u16;
				if average_frequency >= 80u16 && average_frequency<= 400u16{
					e = 1u16;
				}else{
					e = 0u16;
				}

				let p_one:u16;
				let p_two:u16;
				if vfe.luck <= 2{
					p_one= 1u16;
					p_two= 1u16;
				}else{
					let log_luck = format!("{:b} ", vfe.luck).len() - 2;
					p_one = log_luck as u16;
					p_two = (log_luck - 1) as u16 ;
				}

				r_luck = r_luck.pow(p_one.into() );
				r_luck = r_luck.nth_root(p_two.into());

				let final_use = electric_use * ((vfe.efficiency + e_skill) + r_luck ) *average_frequency * e;

				let final_award = BalanceOf::<T>::from(final_use as u32);


				// update the electric with user and vfe and device.
				Devices::<T>::insert(device.pk ,device);
				Users::<T>::insert(account.clone(),user);
				DeviceVFEs::<T>::insert(class_id.clone(), instance_id.clone(), vfe);

				T::Currencies::mint_into(T::IncentiveToken::get(),&account.clone(),final_award.clone())?;

				Self::deposit_event(Event::SportAward(account, final_award));

				Ok(())

			},
			SportType::Run =>{
				Err(Error::<T>::DeviceMsgNotCanNotBeDecode)?
			},
			SportType::Bicycle =>{
				Err(Error::<T>::DeviceMsgNotCanNotBeDecode)?
			},
		}

	}

	// check the producer if it is exist and the owner meets the rules
	fn check_producer(
		owner: T::AccountId,
		id: T::ProducerId,
	) -> Result<Producer<T::AccountId, T::ProducerId, BalanceOf<T>>, sp_runtime::DispatchError> {
		// get the producer owner
		let producer =
			Producers::<T>::get(id).ok_or(Error::<T>::ProducerNotExist)?;
		// check the machine owner
		ensure!(owner == producer.owner, Error::<T>::OperationIsNotAllowedForProducer);

		Ok(producer.into())
	}

	// check the user if it is not exist and create it
	fn create_new_user(
		account_id: T::AccountId
	) -> Result<(), sp_runtime::DispatchError> {
		// get the producer owner
		let block_number = frame_system::Pallet::<T>::block_number();
		if !Users::<T>::contains_key(account_id.clone()){
			let user = User{
				owner : account_id.clone(),
				energy_total : 10u16,
				energy:0u16,
				create_block:block_number,
				last_block:block_number,
			};

			Users::<T>::insert(account_id, user);

		}

		Ok(())
	}


	pub fn create_vfe(
		class_id: T::ClassId,
		miner: T::AccountId,
		rarity: Rarity,
	) -> Result<T::InstanceId, sp_runtime::DispatchError> {
		let instance = T::UniqueId::generate_instance_id(class_id.clone())?;

		let efficiency:u16;

		let skill:u16 ;

		let luck:u16 ;

		let durable:u16 ;

		match rarity {
			Rarity::Common => {
				let common_range = T::CommonMax::get() - T::CommonMin::get();
				efficiency = T::CommonMin::get() + Self::choose_winner_num(common_range);
				skill = T::CommonMin::get() + Self::choose_winner_num(common_range);
				luck = T::CommonMin::get() + Self::choose_winner_num(common_range);
				durable = T::CommonMin::get() + Self::choose_winner_num(common_range);
			}
			Rarity::Elite => {
				let elite_range = T::EliteMax::get() - T::EliteMin::get();
				efficiency = T::EliteMin::get() + Self::choose_winner_num(elite_range);
				skill = T::EliteMin::get() + Self::choose_winner_num(elite_range);
				luck = T::EliteMin::get() + Self::choose_winner_num(elite_range);
				durable = T::EliteMin::get() + Self::choose_winner_num(elite_range);
			}
			Rarity::Rare => {
				let rare_range = T::RareMax::get() - T::RareMin::get();
				efficiency = T::RareMin::get() + Self::choose_winner_num(rare_range);
				skill = T::RareMin::get() + Self::choose_winner_num(rare_range);
				luck = T::RareMin::get() + Self::choose_winner_num(rare_range);
				durable = T::RareMin::get() + Self::choose_winner_num(rare_range);
			}
			Rarity::Epic => {
				let epic_range = T::EpicMax::get() - T::EpicMin::get();
				efficiency = T::EpicMin::get() + Self::choose_winner_num(epic_range);
				skill = T::EpicMin::get() + Self::choose_winner_num(epic_range);
				luck = T::EpicMin::get() + Self::choose_winner_num(epic_range);
				durable = T::EpicMin::get() + Self::choose_winner_num(epic_range);
			}
		}

		pallet_uniques::Pallet::<T, T::UniquesInstance>::mint_into(
			&class_id,
			&instance,
			&miner,
		)?;

		let (_, gene, _) = Self::choose_winner(100);

		let block_number = frame_system::Pallet::<T>::block_number();
		let device_vfes = DeviceVFE {
			class_id: class_id,
			instance_id: instance.clone(),
			efficiency: efficiency,
			skill: skill,
			luck: luck,
			durable: durable,
			rarity: rarity,
			level: 0,
			electric: T::Electric::get(),
			gene: gene,
			last_block:block_number,
			is_update:false,
		};

		// save common_prize
		DeviceVFEs::<T>::insert(class_id, instance.clone(), device_vfes);

		Self::deposit_event(Event::CreateDeviceVFE(miner, class_id, instance.clone(), rarity));

		Ok(instance)
	}
}
