#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod os_computing {
    use ink_sdk::{
        CrossChainSQoS,
        MultiDestContracts,
        cross_chain_helper,
    };
    use ink_prelude::string::String;
    use ink_prelude::vec::Vec;
    use payload::message_define::{
        IRequestMessage,
        IResponseMessage,
        ISession,
        ISQoS,
        ISQoSType,
        IContent,
        IContext,
    };
    use payload::message_protocol::{
        MsgType,
        MessagePayload,
    };
    use ink_storage::{
        Mapping,
        traits::SpreadAllocate,
    };
    
    #[derive(::scale::Encode, ::scale::Decode, Debug, PartialEq, Eq, Copy, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        MethodNotRegisterd,
    }

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct OSComputing {
        cross_chain_contract: Option<AccountId>,
        ret: Option<String>,
        dest_contract_map: Mapping<(String, String), (String, String)>,
    }

    /// We use `CrossChainBase` here, to be able to use the sdk functionalities.
    impl cross_chain_helper::CrossChainBase for OSComputing {
        fn get_cross_chain_contract_address(& self) -> AccountId {
            self.cross_chain_contract.unwrap()
        }
    }

    /// We use `MultiDestContracts` of SDK here, to be able to send messages to multi chains.
    impl MultiDestContracts for OSComputing {      
        #[ink(message)]  
        fn get_dest_contract_info(& self, chain_name: String, action: String) -> Option<(String, String)> {
            self.dest_contract_map.get((chain_name, action))
        }

        #[ink(message)]
        fn register_dest_contract(&mut self, chain_name: String, action: String, contract: String, dest_action: String) {
            self.dest_contract_map.insert((chain_name, action), &(contract, dest_action));
        }
    }

    impl OSComputing {
        #[ink(constructor)]
        pub fn new() -> Self {
            ink_lang::utils::initialize_contract(|_| {
            })
        }

        /// Sets cross-chain contract address
        #[ink(message)]
        pub fn set_cross_chain_contract(&mut self, contract: AccountId) {
            self.cross_chain_contract = Some(contract);
        }

        /// Sends computing task to another chain
        #[ink(message)]
        pub fn send_computing_task(&mut self, chain_name: String, nums: Vec<u32>) -> Result<(), Error> {
            let dest = self.get_dest_contract_info(chain_name.clone(), String::try_from("receive_computing_task").unwrap()).ok_or(Error::MethodNotRegisterd)?;
            let contract = dest.0;
            let action = dest.1;

            let mut msg_payload = MessagePayload::new();
            msg_payload.push_item(String::try_from("nums").unwrap(), MsgType::InkU32Array, nums);
            let data = msg_payload.to_bytes();

            let sqos = Vec::<ISQoS>::new();
            let content = IContent::new(contract, action, data);
            let message = IRequestMessage::new(chain_name, sqos, content);

            cross_chain_helper::cross_chain_call(self, message);

            Ok(())
        }

        /// Receives computing task from another chain 
        #[ink(message)]
        pub fn receive_computing_task(&mut self, payload: MessagePayload) -> String {
            let item = payload.get_item(String::try_from("nums").unwrap()).unwrap();
            // let nums: Vec<u32> = scale::Decode::decode(&mut item.v.as_slice()).unwrap();
            let nums: Vec<u32> = item.in_to();

            let mut result = 0;
            for i in nums {
                result = result + i;
            }

            let context = cross_chain_helper::get_context(self).unwrap();
            let mut msg_payload = MessagePayload::new();
            msg_payload.push_item(String::try_from("result").unwrap(), MsgType::InkU32, result);
            let data = msg_payload.to_bytes();

            let dest_op = self.get_dest_contract_info(context.from_chain.clone(), String::try_from("receive_computing_task_callback").unwrap());
            if dest_op.is_none() {
                return String::try_from("Error").unwrap()
            }
            let dest = dest_op.unwrap();
            let contract = dest.0;
            let action = dest.1;

            let sqos = Vec::<ISQoS>::new();
            let content = IContent::new(contract, action, data);
            let message = IResponseMessage::new(sqos, content);
            cross_chain_helper::cross_chain_respond(self, message);

            String::try_from("Ok").unwrap()
        }

        /// Receives computing task from another chain 
        #[ink(message)]
        pub fn receive_computing_task_callback(&mut self, payload: MessagePayload) -> String {
            let item = payload.get_item(String::try_from("result").unwrap()).unwrap();
            // let param: u32 = scale::Decode::decode(&mut item.v.as_slice()).unwrap();
            let param: u32 = item.in_to();
            // let payload
            let mut s = String::new();
            s = s + &ink_prelude::format!("{:?}", param);
            self.ret = Some(s.clone());
            s
        }

        /// Receives message from another chain 
        #[ink(message)]
        pub fn get_ret(& self) -> String {
            self.ret.clone().unwrap()
        }
    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// Imports `ink_lang` so we can use `#[ink::test]`.
        use ink_lang as ink;
        use payload::message_define::{
            ISentMessage,
            ISession,
            ISQoS,
            IContent,
        };

        /// We test if the new constructor does its job.
        #[ink::test]
        fn new_works() {
            let locker = OSComputing::new();
        }

        /// We test if set_cross_chain_contract works.
        #[ink::test]
        fn set_cross_chain_contract_works() {
            let mut locker = OSComputing::new();
            let contract_id = ink_env::test::callee::<ink_env::DefaultEnvironment>();
            locker.set_cross_chain_contract(contract_id);
        }
    }
}
