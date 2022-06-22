
from substrateinterface import SubstrateInterface
from web3 import Web3
import json

EVM_CONTRACT = "0x0000000000000000000000000000000000000800"

class Base:

    def __init__(self, env, provider, which=None):
        if env == 'evm':
            self.name = 'evm'
            try:
                self.api = Web3(Web3.HTTPProvider(provider))
            except Exception as e:
                print("Error connecting socket. Message: {error}".format(error=e))

            if which == 'staking': 
                file = open("Utils/moonbeam_abi.json")
                MOONBEAM_STAKING_ABI = json.load(file)
                self.contract = self.api.eth.contract(
                    address=EVM_CONTRACT, 
                    abi=MOONBEAM_STAKING_ABI
                )

        elif env == 'substrate':
            self.name = 'substrate'
            try:
                self.api = SubstrateInterface(url=provider)

            except Exception as e:
                print("Error connecting local node. Message: {error}".format(error=e))