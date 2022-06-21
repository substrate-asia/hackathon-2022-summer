#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

pub mod cross_chain_helper;
pub use ink_sdk::{
    MultiDestContracts,
    CrossChainSQoS,
};

#[ink::contract]
mod ink_sdk {
    use ink_prelude::string::String;
    use ink_prelude::vec::Vec;
    use payload::message_define::{
        ISQoSType,
        ISQoS,
    };

    /// This trait can be used when a contract needs to communicate with more than one other chain.
    #[ink_lang::trait_definition]
    pub trait MultiDestContracts {
        /// Returns destination contract address and action name.
        #[ink(message)]
        fn get_dest_contract_info(& self, chain_name: String, action: String) -> Option<(String, String)>;

        /// Registers destination contract to which the ink contract will send message.
        #[ink(message)]
        fn register_dest_contract(&mut self, chain_name: String, action: String, contract: String, dest_action: String);
    }

    /// This trait can be used when a contract has custom SQoS demands.
    #[ink_lang::trait_definition]
    pub trait CrossChainSQoS {
        /// Inserts one SQoS item.
        /// If the item exists, it will be replaced.
        #[ink(message)]
        fn insert(&mut self, sqos_item: ISQoS) -> Result<(), u8>;

        /// Removes one SQoS item.
        #[ink(message)]
        fn remove(&mut self, sqos_type: ISQoSType);

        /// Clear all SQoS items.
        #[ink(message)]
        fn clear(&mut self);

        /// Sets SQoS items
        #[ink(message)]
        fn set(&mut self, sqos: Vec<ISQoS>) -> Result<(), u8>;

        /// Returns SQoS items
        #[ink(message)]
        fn get(& self, a: u8) -> Vec<ISQoS>;
    }

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct InkSdk {
    }

    impl InkSdk {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {

            }
        }

        #[ink(message)]
        pub fn placeholder(&mut self) {
        }
    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;
    }
}
