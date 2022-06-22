from substrateinterface import SubstrateInterface

substrate = SubstrateInterface(
    url="wss://ws-api.substake.app"
)   


result = substrate.compose_call(
    call_module='Balances',
    call_function='setBalance',
    call_params={}
)

