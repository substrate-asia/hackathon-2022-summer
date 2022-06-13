include!("message_protocol.rs");

use ink_prelude::{
    vec::Vec,
    string::String,
};

use scale::{
    Encode,
    Decode,
};

/// Errors for cross-chain contract
#[derive(Encode, Decode, Debug, PartialEq, Eq, Copy, Clone)]
// #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum IError {
    NotOwner,
    IdNotMatch,
    ChainMessageNotFound,
    IdOutOfBound,
    AlreadyExecuted,
    InterfaceNotFound,
    DecodeDataFailed,
    CrossContractCallFailed,
}

impl scale_info::TypeInfo for IError {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("IError", module_path!()))
                        .variant(
                            ::scale_info::build::Variants::new()
                                .variant("NotOwner", |v| v.index(0))
                                .variant("IdNotMatch", |v| v.index(1))
                                .variant("ChainMessageNotFound", |v| v.index(2))
                                .variant("IdOutOfBound", |v| v.index(3))
                                .variant("AlreadyExecuted", |v| v.index(4))
                                .variant("InterfaceNotFound", |v| v.index(5))
                        )
    }
}

/// Content structure
#[derive(Decode, Encode, Clone)]
// #[cfg_attr(feature = "std", derive(Debug, scale_info::TypeInfo))]
pub struct IContent {
    pub contract: String,
    pub action: String,
    pub data: ink_prelude::vec::Vec<u8>,
}

impl IContent {
    pub fn new(contract: String, action: String, data: ink_prelude::vec::Vec<u8>) -> Self {
        Self {
            contract: contract,
            action: action,
            data: data,
        }
    }
}

impl scale_info::TypeInfo for IContent {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("IContent", module_path!()))
                        .composite(::scale_info::build::Fields::named()
                        .field(|f| f.ty::<String>().name("contract").type_name("String"))
                        .field(|f| f.ty::<String>().name("action").type_name("String"))
                        .field(|f| f.ty::<ink_prelude::vec::Vec<u8>>().name("data").type_name("ink_prelude::vec::Vec<u8>"))
                    )
    }
}

/// SQOS structure
#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode, Clone)]
// #[cfg_attr(feature = "std", derive(::scale_info::TypeInfo))]
pub enum ISQoSType{
    Reveal,
    Challenge,
    Threshold,
    Priority,
    ExceptionRollback,
    Anonymous,
    Identity,
    Isolation,
    CrossVerify,
}

impl ::scale_info::TypeInfo for ISQoSType {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("SQoSType", module_path!()))
                        .variant(
                            ::scale_info::build::Variants::new()
                                .variant("Reveal", |v| v.index(0))
                                .variant("Challenge", |v| v.index(1))
                                .variant("Threshold", |v| v.index(2))
                                .variant("Priority", |v| v.index(3))
                                .variant("ExceptionRollback", |v| v.index(4))
                                .variant("Anonymous", |v| v.index(5))
                                .variant("Identity", |v| v.index(6))
                                .variant("Isolation", |v| v.index(7))
                                .variant("CrossVerify", |v| v.index(8))
                        )
    }
}

#[derive(Debug, Clone, Decode, Encode)]
// #[cfg_attr(feature = "std", derive(Debug, scale_info::TypeInfo))]
pub struct ISQoS {
    pub t: ISQoSType,
    pub v: Option<String>,
}

impl scale_info::TypeInfo for ISQoS {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("ISQoS", module_path!()))
                        .composite(::scale_info::build::Fields::named()
                        .field(|f| f.ty::<ISQoSType>().name("t").type_name("ISQoSType"))
                        .field(|f| f.ty::<Option<String>>().name("v").type_name("Option<String>"))
                    )
    }
}

impl ISQoS {
    pub fn new(t: ISQoSType, v: Option<String>) -> Self {
        Self {
            t,
            v,
        }
    }
}

/// Session Structure
#[derive(Debug, Clone, Decode, Encode)]
// #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct ISession {
    pub msg_type: u8,
    pub id: u128,
}

impl ISession {
    pub fn new(msg_type: u8, id: u128) -> Self {
        Self {
            msg_type,
            id,
        }
    }
}

impl scale_info::TypeInfo for ISession {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("ISession", module_path!()))
                        .composite(::scale_info::build::Fields::named()
                        .field(|f| f.ty::<u8>().name("msg_type").type_name("u8"))
                        .field(|f| f.ty::<u128>().name("id").type_name("u128"))
                    )
    }
}

/// Received message structure
#[derive(Debug, Decode, Encode, Clone)]
// #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct IReceivedMessage {
    pub id: u128,
    pub from_chain: String,
    pub sender: String,
    pub signer: String,
    pub sqos: ink_prelude::vec::Vec<ISQoS>,
    pub contract: [u8;32],
    pub action: [u8;4],
    pub data: ink_prelude::vec::Vec<u8>,
    pub session: ISession,
}

impl scale_info::TypeInfo for IReceivedMessage {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("IReceivedMessage", module_path!()))
                        .composite(::scale_info::build::Fields::named()
                        .field(|f| f.ty::<u128>().name("id").type_name("u128"))
                        .field(|f| f.ty::<String>().name("from_chain").type_name("String"))
                        .field(|f| f.ty::<String>().name("sender").type_name("String"))
                        .field(|f| f.ty::<String>().name("signer").type_name("String"))
                        .field(|f| f.ty::<ink_prelude::vec::Vec<ISQoS>>().name("sqos").type_name("ink_prelude::vec::Vec<ISQoS>"))
                        .field(|f| f.ty::<[u8;32]>().name("contract").type_name("[u8;32]"))
                        .field(|f| f.ty::<[u8;4]>().name("action").type_name("[u8;4]"))
                        .field(|f| f.ty::<ink_prelude::vec::Vec<u8>>().name("data").type_name("ink_prelude::vec::Vec<u8>"))
                        .field(|f| f.ty::<ISession>().name("session").type_name("ISession"))
                    )
    }
}

impl IReceivedMessage {
    pub fn new(id: u128, from_chain: String, sender: String, signer: String, sqos: ink_prelude::vec::Vec<ISQoS>,
        contract: [u8;32], action: [u8;4], data: ink_prelude::vec::Vec<u8>, session: ISession) -> Self {
        Self {
            id,
            from_chain,
            sender,
            signer,
            sqos,
            contract,
            action,
            data,
            session,
        }
    }
}

/// Sent message structure
#[derive(Decode, Encode, Clone)]
// #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct ISentMessage {
    pub to_chain: String,
    pub sqos: ink_prelude::vec::Vec<ISQoS>,
    pub content: IContent,
    pub session: ISession,
}

impl scale_info::TypeInfo for ISentMessage {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("ISentMessage", module_path!()))
                        .composite(::scale_info::build::Fields::named()
                        .field(|f| f.ty::<String>().name("to_chain").type_name("String"))
                        .field(|f| f.ty::<ink_prelude::vec::Vec<ISQoS>>().name("sqos").type_name("ink_prelude::vec::Vec<ISQoS>"))
                        .field(|f| f.ty::<IContent>().name("content").type_name("IContent"))
                        .field(|f| f.ty::<ISession>().name("session").type_name("ISession"))
                    )
    }
}

impl ISentMessage {
    pub fn new(to_chain: String, sqos: ink_prelude::vec::Vec<ISQoS>, content: IContent, session: ISession) -> Self {
        Self {
            to_chain,
            sqos,
            content,
            session,
        }
    }
}

/// Context structure
#[derive(Debug, Clone, Decode, Encode)]
// #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct IContext {
    pub id: u128,
    pub from_chain: String,
    pub sender: [u8;32],
    pub signer: [u8;32],
    pub sqos: ink_prelude::vec::Vec<ISQoS>,
    pub contract: [u8;32],
    pub action: [u8;4],
}

impl scale_info::TypeInfo for IContext {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("IReceivedMessage", module_path!()))
                        .composite(::scale_info::build::Fields::named()
                        .field(|f| f.ty::<u128>().name("id").type_name("u128"))
                        .field(|f| f.ty::<String>().name("from_chain").type_name("String"))
                        .field(|f| f.ty::<[u8;32]>().name("sender").type_name("[u8;32]"))
                        .field(|f| f.ty::<[u8;32]>().name("signer").type_name("[u8;32]"))
                        .field(|f| f.ty::<ink_prelude::vec::Vec<ISQoS>>().name("sqos").type_name("ink_prelude::vec::Vec<ISQoS>"))
                        .field(|f| f.ty::<[u8;32]>().name("contract").type_name("[u8;32]"))
                        .field(|f| f.ty::<[u8;4]>().name("action").type_name("[u8;4]"))
                    )
    }
}

impl IContext {
    pub fn new(id: u128, from_chain: String, sender: [u8;32], signer: [u8;32], sqos: ink_prelude::vec::Vec<ISQoS>, contract: [u8;32], action: [u8;4]) -> Self {
        Self {
            id,
            from_chain,
            sender,
            signer,
            sqos,
            contract,
            action,
        }
    }
}
