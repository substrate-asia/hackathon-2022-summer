/// Message element type define
/// U64, I64, U128, I128 will be decoded as `InkString`
#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode, Clone)]
// #[cfg_attr(feature = "std", derive())]
pub enum MsgType{
    InkString,
    InkU8,
    InkU16,
    InkU32,
    InkU64,
    InkU128,
    InkI8,
    InkI16,
    InkI32,
    InkI64,
    InkI128,
    InkStringArray,
    InkU8Array,
    InkU16Array,
    InkU32Array,
    InkU64Array,
    InkU128Array,
    InkI8Array,
    InkI16Array,
    InkI32Array,
    InkI64Array,
    InkI128Array,
    UserData,
}

impl ::scale_info::TypeInfo for MsgType {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("MsgType", module_path!()))
                        .variant(
                            ::scale_info::build::Variants::new()
                                .variant("InkString", |v| v.index(0))
                                .variant("InkU8", |v| v.index(1))
                                .variant("InkU16", |v| v.index(2))
                                .variant("InkU32", |v| v.index(3))
                                .variant("InkU64", |v| v.index(4))
                                .variant("InkU128", |v| v.index(5))
                                .variant("InkI8", |v| v.index(6))
                                .variant("InkI16", |v| v.index(7))
                                .variant("InkI32", |v| v.index(8))
                                .variant("InkI64", |v| v.index(9))
                                .variant("InkI128", |v| v.index(10))
                                .variant("InkStringArray", |v| v.index(11))
                                .variant("InkU8Array", |v| v.index(12))
                                .variant("InkU16Array", |v| v.index(13))
                                .variant("InkU32Array", |v| v.index(14))
                                .variant("InkU64Array", |v| v.index(15))
                                .variant("InkU128Array", |v| v.index(16))
                                .variant("InkI8Array", |v| v.index(17))
                                .variant("InkI16Array", |v| v.index(18))
                                .variant("InkI32Array", |v| v.index(19))
                                .variant("InkI64Array", |v| v.index(20))
                                .variant("InkI128Array", |v| v.index(21))
                                .variant("UserData", |v| v.index(22))
                        )
    }
}

/// Message Item, used for describing the information composed with a single element
/// @member `n`: item unique ID, which is used for user applications to communicate user-defined informations
/// @member `t`: item type
/// @member `v`: the information data, encoded by `scale::Encode::encode_to`
#[derive(Debug, Eq, scale::Encode, scale::Decode, Clone)]
// #[cfg_attr(feature = "std", derive())]
pub struct MessageItem{
    pub n: ink_prelude::string::String,
    pub t: MsgType,
    pub v: ink_prelude::vec::Vec<u8>,
}

impl PartialEq for MessageItem {
    fn eq(&self, other: &MessageItem) -> bool{
        return self.n == other.n;
    }
}

impl ::scale_info::TypeInfo for MessageItem {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("MessageItem", module_path!()))
                        .composite(::scale_info::build::Fields::named()
                        .field(|f| f.ty::<ink_prelude::string::String>().name("n").type_name("ink_prelude::string::String"))
                        .field(|f| f.ty::<MsgType>().name("t").type_name("MsgType"))
                        .field(|f| f.ty::<ink_prelude::vec::Vec<u8>>().name("v").type_name("ink_prelude::vec::Vec<u8>"))
                    )
    }
}

impl MessageItem {
    pub fn from<T: scale::Encode>(n: ink_prelude::string::String, t: MsgType, vs: T) -> Self {
        let mut v = ink_prelude::vec::Vec::new();
        scale::Encode::encode_to(&vs, &mut v);
        Self {
            n, 
            t,
            v,
        }
    }

    pub fn in_to<T: scale::Decode>(&self) -> T{
        let mut v_ref = self.v.as_slice();
        scale::Decode::decode(&mut v_ref).unwrap()
    }
}

/// Message Payload
/// @member items: a vector of `MessageItem`
/// @member vecs: a vector of `MessageVec`
#[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
// #[cfg_attr(feature = "std", derive())]
pub struct MessagePayload{
    pub items: Option<ink_prelude::vec::Vec<MessageItem>>,
}

impl ::scale_info::TypeInfo for MessagePayload {
    type Identity = Self;

    fn type_info() -> ::scale_info::Type {
        ::scale_info::Type::builder()
                        .path(::scale_info::Path::new("MessagePayload", module_path!()))
                        .composite(::scale_info::build::Fields::named()
                        .field(|f| f.ty::<Option<ink_prelude::vec::Vec<MessageItem>>>().name("items").type_name("Option<ink_prelude::vec::Vec<MessageItem>>"))
                    )
    }
}

impl MessagePayload{
    pub fn new() -> MessagePayload{
        MessagePayload {
            items: None,
        }
    }

    /// for `item`
    pub fn push_item<T: scale::Encode>(&mut self, n: ink_prelude::string::String, t: MsgType, vs: T) -> bool {
        let msg_item = MessageItem::from(n, t, vs);
        if let Some(item) = &mut self.items {
            if item.contains(&msg_item){
                return false;
            }

            item.push(msg_item);
            true
        } else{
            let mut item_vec = ink_prelude::vec::Vec::new();
            item_vec.push(msg_item);
            self.items = Some(item_vec);
            true
        }
    }

    pub fn get_item(&self, msg_n: ink_prelude::string::String) -> Option<&MessageItem>{
        if let Some(item) = &self.items {
            for it in item.iter() {
                if it.n == msg_n {
                    return Some(it);
                }
            }
        }

        None
    }

    pub fn to_bytes(&self) -> ink_prelude::vec::Vec<u8> {
        let mut pl_code: ink_prelude::vec::Vec<u8> = ink_prelude::vec::Vec::<u8>::new();
        scale::Encode::encode_to(self, &mut pl_code);
        pl_code
    }
}


#[cfg(test)]
mod test {
    
}