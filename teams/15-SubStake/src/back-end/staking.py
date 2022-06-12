
from substrateinterface import SubstrateInterface, Keypair
from web3 import Web3
from helper import Helper
import json

KEY_PAIR = None
MOONBEAM_STAKING_CONTRACT = "0x0000000000000000000000000000000000000800"
MOONBEAM_STAKING_DECIMALS = 18
PRIVATE_KEY = ""

class Staking:

    '''
    Class
    - Staking class contains EVM/Substrate class
    '''

    def __init__(self, env, provider):
        
        if env == 'evm':
            self.evm = EVM(provider=provider)
            self.name = 'evm'
        elif env == 'substrate':
            self.substrate = Substrate(provider=provider)
            self.name = 'substrate'

    def stake(
        self, 
        user_address=None, 
        collator_address=None, 
        amount=None, 
        payee='Staked',
        is_nominate=False,
    ):

        '''
        Method
        - EVM: delegate
        - Substrate: bond
        '''
        
        if self.name == 'evm':
            self.evm.delegate(
                user_address=user_address, 
                collator_address=collator_address, 
                delegate_amount=amount
            )
        elif self.name == 'substrate':
            if is_nominate: # To-Do: Bond and Nominate
                pass
            else:
                self.substrate.bond(
                    user_address=user_address,
                    amount=amount,
                    payee=payee
                )
    
    def stake_more(self, user_address, more, collator_address=None):

        '''
        Method
        - Send stake-more-asset transaction
        
        Params
        - user_address: Whose asset
        - more: additional asset
        - collator_address: Only needed in EVM
        '''

        if self.name == 'evm':
            self.evm.bond_more(
                user_address=user_address,
                collator_address=collator_address,
                more=more
            )
        elif self.name == 'substrate':
            self.substrate.bond_extra(
                user_address=user_address,
                additional=more
            )

    def stake_less(self, user_address, less, collator_address=None):
        if self.name == 'evm':
            self.evm.bond_less(
                user_address=user_address,
                collator_address=collator_address,
                less=less
            )
        elif self.name == 'substrate':
            self.substrate.unbond(
                user_address=user_address,
                amount=less,
            )

    def stop_stake(self, user_address, collator_address=None):

        '''
        Method
        - Pull all staked asset

        Params 
        - user_address: Whose asset
        - collator_address: Only needed in EVM(Moonbeam)
        '''

        if self.name == 'evm':
            self.evm.revoke(
                user_address=user_address, 
                collator_address=collator_address
            )
        elif self.name == 'substrate':
            self.substrate.chill(user_address=user_address)


class EVM:

    def __init__(self, provider):
        try:
            self.web3 = Web3(Web3.HTTPProvider(provider))
        except Exception as e:
            print("Error connecting socket. Message: {error}".format(error=e))
            return 0

        file = open("Utils/moonbeam_abi.json")
        MOONBEAM_STAKING_ABI = json.load(file)
        self.contract = self.web3.eth.contract(
            address=MOONBEAM_STAKING_CONTRACT, 
            abi=MOONBEAM_STAKING_ABI
        )
        
    def delegate(
        self, 
        user_address,
        collator_address, 
        amount, 
    ):

        '''
        Method
        - Send delegate tranasction

        Params 
        - collator_address: Whom to delegate
        - user_address: Who is delegating
        - delegate_amount: amount of delegate
        '''

        nonce = self.web3.eth.get_transaction_count(user_address)
        candidate_delgation_count = self.contract.functions.candidate_delegation_count(collator_address).call()
        delegator_delegation_count = self.contract.functions.delegator_delegation_count(user_address).call()
        tx_dict = self.contract.functions.delegate(
            collator_address,
            amount,
            candidate_delgation_count,
            delegator_delegation_count
        ).buildTransaction()
        tx_dict['nonce'] = nonce
        tx_dict['from'] = user_address

        Helper.eth_sign_transaction(
            web3=self.web3, 
            tx_dict=tx_dict, 
            user_address=user_address
        )

    def bond_more(self, user_address, collator_address, more):

        '''
        Method
        - Send delegator-bond-more transaction.

        Params 
        - collator_address: Whom to delegate
        - user_address: Who is delegating
        - more: amount of more staking 
        '''

        nonce = self.web3.eth.get_transaction_count(user_address)
        tx_dict = self.contract.functions.delegator_bond_more(
            collator_address,
            more,
        ).buildTransaction()
        tx_dict['nonce'] = nonce
        tx_dict['from'] = user_address

        Helper.eth_sign_transaction(
            web3=self.web3,
            tx_dict=tx_dict,
            user_address=user_address
        )

    def bond_less(self, user_address, collator_address, less):
        
        '''
        Method
        - Send schedule-bond-less transaction

        Params 
        - user_address: user's public address
        - collator_address: Whom to bond less
        - less: amount of bond less
        '''
        nonce = self.web3.eth.get_transaction_count(user_address)
        tx_dict = self.contract.functions.schedule_delegator_bond_less(
            collator_address,
            less,
        ).buildTransaction()
        tx_dict['nonce'] = nonce
        tx_dict['from'] = user_address

        Helper.eth_sign_transaction(
            web3=self.web3,
            tx_dict=tx_dict,
            user_address=user_address
        )

    def revoke(self, user_address, collator_address):
        
        '''
        Method
        - Send scheduled-revoke-delegation transaction

        Params
        - user_address: User's public address
        - collator_address: Whom to revoke
        '''
        nonce = self.web3.eth.get_transaction_count(user_address)
        tx_dict = self.contract.functions.schedule_revoke_delegation(
            collator_address,
        ).buildTransaction()
        tx_dict['nonce'] = nonce
        tx_dict['from'] = user_address

        Helper.eth_sign_transaction(
            web3=self.web3,
            tx_dict=tx_dict,
            user_address=user_address
        )
        

class Substrate:

    def __init__(self, provider):
        try:
            self.api = SubstrateInterface(url=provider)
        except Exception as e:
            print("Error connecting local node. Message: {error}".format(error=e))
            return 0

    def bond(self, user_address, amount, payee):

        '''
        Method
        - Send bond extrinsic 
        
        Params
        - user_account(controller): user's public address 
        - amount: bond amount
        - payee: Staked(auto-compound) / Stash(Reward goes to stash account)
        '''

        generic_call = Helper.get_generic_call(
            api=self.api,
            module="Staking",
            function="bond",
            params={
                'controller': user_address.ss58_address,
                'value': amount,
                'payee': payee
            }
        )
        Helper.send_extrinsic(
            api=self.api,
            generic_call=generic_call,
            user_address=user_address    
        )

    def nominate(self, user_address, validators):

        '''
        Method
        - Send Nominate extrinsic 

        Params
        - user_account: User's public address
        - validators: [address of Validators]
        '''

        generic_call = Helper.get_generic_call(
            api=self.api,
            module="Staking",
            function="nominate",
            params={
                'targets': validators
            }
        )
        Helper.send_extrinsic(
            api=self.api,
            generic_call=generic_call,
            user_address=user_address    
        )

    def bond_extra(self, user_address, additional): 
        
        '''
        Method
        - Send bond extra extrinsic using user's key pair
        - Call "putInFrontof" extrinsic to adjust user's bag position
        
        Params
        - additional: bond extra amount. 'Int'
        '''
        generic_call = Helper.get_generic_call(
            api=self.api,
            module="Staking",
            function="bondExtra",
            params={
                'max_additional': additional
            }
        )
        Helper.send_extrinsic(
            api=self.api,
            generic_call=generic_call,
            user_address=user_address    
        )
        self._put_in_front_of(substrate_account="") # TO-DO 

    def unbond(self, user_address, amount):
        
        '''
        Method
        - Send unbond extrinsic using user's key pair

        Params
        - amount: unbond amount. 'Int'
        '''
        generic_call = Helper.get_generic_call(
            api=self.api,
            module="Staking",
            function="unbond",
            params={
                'value': amount
            }
        )
        Helper.send_extrinsic(
            api=self.api,
            generic_call=generic_call,
            user_address=user_address    
        )

    def rebond(self, user_address, amount):
        
        '''
        Method
        - Send rebond extrinsic using user's key pair

        Params
        - amount: unbond amount. 'Int'
        '''

        generic_call = Helper.get_generic_call(
            api=self.api,
            module="Staking",
            function="rebond",
            params={
                'value': amount
            }
        )
        Helper.send_extrinsic(
            api=self.api,
            generic_call=generic_call,
            user_address=user_address    
        )

    def chill(self, user_address):

        '''
        Method
        - Send chill extrinsic 
        - Stop being as nominator/validator

        Params
        - user_addrss: User's public addrss
        '''

        generic_call = Helper.get_generic_call(
            api=self.api,
            module="Staking",
            function="chill",
            params={}
        )
        Helper.send_extrinsic(
            api=self.api,
            generic_call=generic_call,
            user_address=user_address    
        )

    def _put_in_front_of(self, user_address):
        
        '''
        Method
        - Dispath call of "Bag-list" Pallet.

        Params
        - lighter: address of whose point is lighter than user's
        '''

        (user_score, list_head) = self._get_list_head(substrate_account=user_address)
        curr_node = list_head;
        score = self._get_score(node=curr_node);

        if user_score > score: 
            print("Put user node in front of {curr_node}".format(curr_node=curr_node))
            return curr_node
        
        while True :
            if user_score > score:
                print("Put user node in front of {curr_node}".format(curr_node=curr_node))
                break

            curr_node = self._get_next(curr_node)
            score = self._get_score(curr_node)

        generic_call = Helper.get_generic_call(
            api=self.api,
            module="VoterList",
            function="putInFrontOf",
            params={
                'lighter': curr_node
            }
        )
        Helper.send_extrinsic(
            api=self.api,
            generic_call=generic_call,
            user_address=user_address    
        )

    def _get_list_head(self, substrate_account):
        
        '''
        Method
        - Internal method
        - Get head of the bag-list

        Params
        - substrate_account: User's substrate account

        Returns
        - Tuple
        - user_score: Score of user. Int 
        - list_head: address of head. String
        '''
        
        list_node = self.api.query('VoterList', 'ListNodes', params=[substrate_account]).value
        user_score = list_node['score']
        user_bag_upper = list_node['bag_upper']
        list_bags = self.api.query('VoterList', 'ListBags', params=[user_bag_upper]).value
        list_head = list_bags['head']
        
        return (user_score, list_head)

    def _get_score(self, node):
        
        '''
        Method
        - Internal method

        Params
        - node: current node
        
        Returns
        - Int
        - score of node
        '''

        return self.api.query('VoterList', 'ListNodes', params=[node]).value['score']

    def _get_next(self, node):
        
        '''
        Method
        - Internal method

        Params
        - node: current node

        Returns
        - String
        - Next node
        '''

        return self.api.query('VoterList', 'ListNodes', params=[node]).value['next']


if __name__ == "__main__":

    # substrate = Substrate(provider="wss://ws-api.substake.app")
    # This account is only for test
    # No worry for hacking
    # mnemonic = "seminar outside rack viable away limit tunnel marble category witness parrot eager"
    # key_pair = Keypair.create_from_mnemonic(mnemonic=mnemonic)
    # substrate.rebond(
    #     user_address=key_pair,
    #     amount=1000000000000,
    # )

    staking1 = Staking(env='evm', provider='https://rpc.api.moonbase.moonbeam.network')
    staking2 = Staking(env='substrate', provider='wss://ws-api.substake.app')

    print(staking1.name)
    print(staking2.name)


    
