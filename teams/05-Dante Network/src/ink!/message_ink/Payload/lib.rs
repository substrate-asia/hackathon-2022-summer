#![cfg_attr(not(feature = "std"), no_std)]

pub mod message_protocol;
pub mod message_define;

pub use self::Payload::{
    Payload as Other,
    PayloadRef,
};

use ink_lang as ink;
use ink_prelude;
use ink_storage;


/// This is an example that shows how can user-defined struct be used for other contracts as parameter in `message` interface
#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode, Clone)]
// #[cfg_attr(feature = "std", derive(::scale_info::TypeInfo))]
pub struct TestData{
    pub n: u128,
    pub s: ink_prelude::string::String,
}

impl ::scale_info::TypeInfo for TestData{
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
            .path(::scale_info::Path::new("TestData", module_path!()))
            .composite(::scale_info::build::Fields::named()
                .field(|f| f.ty::<u128>().name("n").type_name("u128"))
                .field(|f| f.ty::<ink_prelude::string::String>().name("s").type_name("ink_prelude::string::String"))
            )
    }
}

#[ink::contract]
mod Payload {

    use ink_storage::traits::{SpreadAllocate};

    /// for test
    #[derive(Debug, PartialEq, Clone, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(::scale_info::TypeInfo))]
    pub struct MessageDetail{
        name: ink_prelude::string::String,
        age: u32,
        phones: ink_prelude::vec::Vec<ink_prelude::string::String>,
    }

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    #[derive(SpreadAllocate, ::scale_info::TypeInfo)]
    pub struct Payload {
        /// Stores a single `bool` value on the storage.
        value: bool,
        info: Option<ink_prelude::string::String>,
        // items: ink_storage::Mapping<ink_prelude::string::String, MessagePayload>,
        // mp: ink_storage::Mapping<u8, MessagePayload>,
        // msg: MessageDetail,
    }

    impl Payload {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(init_value: bool) -> Self {
            ink_lang::utils::initialize_contract(|contract: &mut Self| {
                contract.value = init_value;
                contract.info = None;
            })
        }

        /// Constructor that initializes the `bool` value to `false`.
        ///
        /// Constructors can delegate to other constructors.
        #[ink(constructor)]
        pub fn default() -> Self {
            ink_lang::utils::initialize_contract(|_| {})
            // Self::new(Default::default())
        }

        /// A message that can be called on instantiated contracts.
        /// This one flips the value of the stored `bool` from `true`
        /// to `false` and vice versa.
        #[ink(message)]
        pub fn flip(&mut self) {
            self.value = !self.value;
        }

        /// Simply returns the current value of our `bool`.
        #[ink(message)]
        pub fn get(&self) -> bool {
            self.value
        }

        /// Test the message Type.
        #[ink(message)]
        pub fn getMessage(&self, msg: super::message_protocol::MessagePayload) -> super::message_protocol::MessagePayload {
            msg
        }

        #[ink(message)]
        pub fn getRecvMessage(&self, msg: super::message_define::IReceivedMessage) -> super::message_define::IReceivedMessage {
            msg
        }

        /// User defined behaviors when messages or invocations are received from other chains
        #[ink(message)]
        pub fn test_callee_received(&self, m_payload: super::message_protocol::MessagePayload) ->ink_prelude::string::String{
            let mut s = ink_prelude::string::String::new();

            // `1` is user defined `MessageItem` id
            // In this example, we use user defined data struct `MessageDetail`
            if let Some(item) = m_payload.get_item(ink_prelude::string::String::from("1")) {
                let mut ss = item.v.as_slice();
                let msg_data: MessageDetail = scale::Decode::decode(&mut ss).unwrap();
                s = s + &ink_prelude::format!("{:?}", msg_data);
                s = s + "\n";
            }

            if let Some(item) = m_payload.get_item(ink_prelude::string::String::from("11")) {
                let msg_data = item.in_to::<ink_prelude::vec::Vec<MessageDetail>>();
                for ele in msg_data.iter() {
                    s = s + &ink_prelude::format!("{:?}", ele);
                    s = s + "\n";
                }
            }

            s
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

        /// We test if the default constructor does its job.
        #[ink::test]
        fn default_works() {
            let Payload = Payload::default();
            assert_eq!(Payload.get(), false);
        }

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            let mut m_hm: ink_prelude::vec::Vec<(u32, u32)> = ink_prelude::vec::Vec::new();
            m_hm.push((1, 1));
            m_hm.push((2, 2));

            let mut m_hash_map: ink_prelude::collections::HashMap<u32, u32> = ink_prelude::collections::HashMap::from_iter(m_hm.clone());

            assert_eq!(*m_hm, [(1, 1), (2, 2)]);

        }

        /// test encode and decode
        #[ink::test]
        fn test_encode_decode() {
            let msg = MessageDetail{
                name: "Nika".into(),
                age: 37,
                phones: ink_prelude::vec!["123".into(), "456".into()],
            };

            let mut v: ink_prelude::vec::Vec::<u8> = ink_prelude::vec::Vec::<u8>::new();
            scale::Encode::encode_to(&msg, &mut v);
            let mut vv = v.as_slice();
            let vout: MessageDetail = scale::Decode::decode(&mut vv).unwrap();
            println!("{:?}", vout);
            assert_eq!(Some(msg), Some(vout));
        }

        /// test encode and decode of user defined contract interface
        #[ink::test]
        fn test_contract_en_de() {
            let msg = MessageDetail{
                name: "Nika".into(),
                age: 37,
                phones: ink_prelude::vec!["123".into(), "456".into()],
            };

            let rst_s = ink_prelude::format!("{:?}", msg) + "\n" + &ink_prelude::format!("{:?}", msg) + "\n" + &ink_prelude::format!("{:?}", msg) + "\n";

            let mut v: ink_prelude::vec::Vec::<u8> = ink_prelude::vec::Vec::<u8>::new();
            scale::Encode::encode_to(&msg, &mut v);

            let mut msg_payload = super::super::message_protocol::MessagePayload::new();
            let msg_item = super::super::message_protocol::MessageItem{
                n: ink_prelude::string::String::from("1"),
                t: super::super::message_protocol::MsgType::UserData,
                v: v.clone(),
            };

            let msg_item2 = super::super::message_protocol::MessageItem::from(ink_prelude::string::String::from("1"), 
                                                                                super::super::message_protocol::MsgType::UserData, 
                                                                                msg.clone());

            assert_eq!(msg_item, msg_item2);

            assert_eq!(msg_payload.push_item(ink_prelude::string::String::from("1"), 
                                                super::super::message_protocol::MsgType::UserData, 
                                                msg.clone()), 
                                                true);

            let mut vec_eles: ink_prelude::vec::Vec<MessageDetail> = ink_prelude::vec::Vec::new();
            vec_eles.push(msg.clone());
            vec_eles.push(msg.clone());

            let msg_item_vec = super::super::message_protocol::MessageItem::from(ink_prelude::string::String::from("11"), 
                                                                                    super::super::message_protocol::MsgType::UserData, 
                                                                                    vec_eles.clone());

            assert_eq!(msg_payload.push_item(ink_prelude::string::String::from("11"), 
                                                super::super::message_protocol::MsgType::UserData, 
                                                vec_eles.clone()), 
                                                true);
            
            // simulate encode `MessagePayload` from routers(off-chain js)
            let mut pl_code: ink_prelude::vec::Vec::<u8> = ink_prelude::vec::Vec::<u8>::new();
            scale::Encode::encode_to(&msg_payload, &mut pl_code);

            // simulate decode `MessagePayload` implemented underlying
            let mut vv = pl_code.as_slice();
            let vout: super::super::message_protocol::MessagePayload = scale::Decode::decode(&mut vv).unwrap();

            // simulate contract call
            let payload = Payload::default();
            let return_s = payload.test_callee_received(vout);

            assert_eq!(return_s, rst_s);
        }

        /// test vec compare
        #[ink::test]
        fn test_vec_compare() {
            let v1: ink_prelude::vec::Vec<u8> = ink_prelude::vec![1, 2, 3];
            let v2: ink_prelude::vec::Vec<u8> = ink_prelude::vec![1, 2, 3];

            assert_eq!(v1, v2);
        }
    }
}
