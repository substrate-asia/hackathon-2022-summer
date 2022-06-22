use ink_env::AccountId;
use ink_prelude::vec::Vec;
use payload::message_define::{
    ISentMessage,
    ISQoS,
    IContext,
    ISession,
    IRequestMessage,
    IResponseMessage,
};
    
const CROSS_CHAIN_CONTRACT_ADDRESS: &str = "0x9b33e9dbcc468833b9cec8e0642e4932487931ea092d789ffe51ee41fea4de7a";
const SEND_MESSAGE_SELECTOR: [u8; 4] = [0x27, 0x26, 0x79, 0x17];
const REGISTER_SQOS_SELECTOR: [u8; 4] = [0x32, 0x80, 0x5c, 0x58];
const GET_CONTEXT_SELECTOR: [u8; 4] = [0xee, 0xe9, 0xc1, 0xb3];
const GET_SQOS_SELECTOR: [u8; 4] = [0x8d, 0xe9, 0x09, 0xd7];
const SET_SQOS_SELECTOR: [u8; 4] = [0xc1, 0xe9, 0xbc, 0xda];

/// Converts hex string of address into [u8; 32]
fn convert_address(s: &str) -> AccountId {
    let mut begin = 0;
    if &s[0..2] == "0x" {
        begin = 2;
    }

    let mut v: [u8; 32] = [0; 32];
    let mut index = 0;
    for i in begin/2..s.len()/2 {
        v[index] = u8::from_str_radix(&s[i * 2..i * 2 + 2], 16).unwrap();
        index = index + 1;
    }
    
    AccountId::try_from(v).unwrap()
}

/// If you want to use functionalities of the SDK, this trait must be implemented.
pub trait CrossChainBase {
    /// Returns the cross-chain contract address.
    fn get_cross_chain_contract_address(& self) -> AccountId {
        let default_address = convert_address(CROSS_CHAIN_CONTRACT_ADDRESS);
        default_address
    }
}

/// Registers sqos
pub fn register_sqos<T: CrossChainBase>(contract: &T, sqos: Vec<ISQoS>) {
    let cross_chain: AccountId = <T as CrossChainBase>::get_cross_chain_contract_address(&contract);
    
    ink_env::call::build_call::<ink_env::DefaultEnvironment>()
            .call_type(
                ink_env::call::Call::new()
                    .callee(cross_chain)
                    .gas_limit(0)
                    .transferred_value(0))
            .exec_input(
                ink_env::call::ExecutionInput::new(ink_env::call::Selector::new(REGISTER_SQOS_SELECTOR))
                .push_arg(sqos)
            )
            .returns::<()>()
            .fire()
            .unwrap();
}

/// Sends a cross-chain message.
fn send_message<T: CrossChainBase>(contract: &mut T, message: ISentMessage) -> u128 {
    let cross_chain: AccountId = <T as CrossChainBase>::get_cross_chain_contract_address(&contract);
    
    let id: u128 = ink_env::call::build_call::<ink_env::DefaultEnvironment>()
            .call_type(
                ink_env::call::Call::new()
                    .callee(cross_chain)
                    .gas_limit(0)
                    .transferred_value(0))
            .exec_input(
                ink_env::call::ExecutionInput::new(ink_env::call::Selector::new(SEND_MESSAGE_SELECTOR))
                .push_arg(message)
            )
            .returns::<u128>()
            .fire()
            .unwrap();
    id
}

/// Sends a cross-chain message, and returns the message id.
pub fn cross_chain_send_message<T: CrossChainBase>(contract: &mut T, request: IRequestMessage) -> u128 {
    let session = ISession::new(0, 0);
    let message = ISentMessage::new(request.to_chain, request.sqos, request.content, session);

    send_message(contract, message)
}

/// Sends a cross-chain message, and returns the message id.
/// Latar a callback will be called.
pub fn cross_chain_call<T: CrossChainBase>(contract: &mut T, request: IRequestMessage) -> u128 {
    let session = ISession::new(1, 0);
    let message = ISentMessage::new(request.to_chain, request.sqos, request.content, session);

    send_message(contract, message)
}

/// Responds a cross-chain message, and returns the message id.
pub fn cross_chain_respond<T: CrossChainBase>(contract: &mut T, response: IResponseMessage) -> u128 {
    let context = get_context(contract).unwrap();
    let session = ISession::new(2, context.id);
    let message = ISentMessage::new(context.from_chain, response.sqos, response.content, session);
    
    send_message(contract, message)
}

/// Returns context of Cross Chain
pub fn get_context<T: CrossChainBase>(contract: &T) -> Option<IContext> {
    let cross_chain: AccountId = <T as CrossChainBase>::get_cross_chain_contract_address(&contract);
    
    ink_env::call::build_call::<ink_env::DefaultEnvironment>()
            .call_type(
                ink_env::call::Call::new()
                    .callee(cross_chain)
                    .gas_limit(0)
                    .transferred_value(0))
            .exec_input(
                ink_env::call::ExecutionInput::new(ink_env::call::Selector::new(GET_CONTEXT_SELECTOR))
            )
            .returns::<Option<IContext>>()
            .fire()
            .unwrap()
}

/// Returns SQoS registered in Cross Chain
pub fn get_sqos<T: CrossChainBase>(contract: &T) -> Vec<ISQoS> {
    let cross_chain: AccountId = <T as CrossChainBase>::get_cross_chain_contract_address(&contract);
    
    ink_env::call::build_call::<ink_env::DefaultEnvironment>()
            .call_type(
                ink_env::call::Call::new()
                    .callee(cross_chain)
                    .gas_limit(0)
                    .transferred_value(0))
            .exec_input(
                ink_env::call::ExecutionInput::new(ink_env::call::Selector::new(GET_SQOS_SELECTOR))
            )
            .returns::<Vec<ISQoS>>()
            .fire()
            .unwrap()
}

/// Sets SQoS registered in Cross Chain
pub fn set_sqos<T: CrossChainBase>(contract: &T, sqos: Vec<ISQoS>) {
    let cross_chain: AccountId = <T as CrossChainBase>::get_cross_chain_contract_address(&contract);
    
    ink_env::call::build_call::<ink_env::DefaultEnvironment>()
            .call_type(
                ink_env::call::Call::new()
                    .callee(cross_chain)
                    .gas_limit(0)
                    .transferred_value(0))
            .exec_input(
                ink_env::call::ExecutionInput::new(ink_env::call::Selector::new(SET_SQOS_SELECTOR))
                .push_arg(sqos)
            )
            .returns::<()>()
            .fire()
            .unwrap();
}