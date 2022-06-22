
from Helper import Helper
from Utils.helpful_function import str_to_bool
from Utils.chain_info import SUBSTRATE_DECIMALS, EVM_DECIMALS
from base import Base

class Staking(Base):

    '''
    Class
    - Staking class contains EVM/Substrate class
    '''

    def __init__(self, env=None, provider=None):
        
        assert env is not None, "SUBSTAKE-STAKING: Environment must be provided"
        assert provider is not None, "SUBSTAKE_STAKING: Provider must be provided"

        super().__init__(env=env, provider=provider, which='staking')

    def stake(
        self, 
        user_address=None, 
        collator_address=None, 
        validators=None,
        amount=None, 
        payee=None,
        is_nominate=None,
        is_both=None,
        is_pool=None,
        pool_id=None,
    ):

        '''
        Method
        - EVM: delegate
        - Substrate: bond / nominate / join(nomination pool)

        Params
        - user_address: Public address of user. String
        - collator_address: For EVM, address of collator. String
        - validators: For Substrate, list of address of validators. [String]
        - amount: Staking amount. Int
        - payee: For Substrate, 'Staked' or 'Stash'
        - is_nominate: If neccessary. True / False
        - is_pool: If neccessary. True / False
        - pool_id: If neccessary. Int 

        Returns
        - Dictionary
        - {'Status': "Success" or "Fail", 'Message': Transaction Hash / Error}
        '''

        assert user_address is not None, "SUBSTAKE-STAKING(STAKE): User address must be provided"

        if self.name == 'evm':
            
            assert collator_address is not None, "SUBSTAKE-STAKING(STAKE): Collator address must be provided for EVM"
            assert amount is not None, "SUBSTAKE-STAKING(STAKE): Amount must be provided"
            amount = float(amount)
            amount = amount * 10**EVM_DECIMALS
            nonce = self.api.eth.get_transaction_count(user_address)
            candidate_delgation_count = self.contract.functions.candidate_delegation_count(collator_address).call()
            delegator_delegation_count = self.contract.functions.delegator_delegation_count(user_address).call()
            tx_dict = self.contract.functions.delegate(
                collator_address,
                amount,
                candidate_delgation_count,
                delegator_delegation_count
            ).buildTransaction({'gas': 210000})
            tx_dict['nonce'] = nonce
            tx_dict['from'] = user_address

            (is_success, message) = Helper.eth_sign_transaction(
                                        api=self.api, 
                                        tx_dict=tx_dict, 
                                        user_address=user_address
                                    )

            return {'Status': is_success, 'Message': message}

        elif self.name == 'substrate':
            
            assert is_nominate is not None, "SUBSTAKE-STAKING(STAKE): Is_nominate must be provided"
            assert is_both is not None, "SUBSTAKE-STAKING(STAKE): is_both must be provided"
            is_nominate = str_to_bool(is_nominate)
            is_both = str_to_bool(is_both)
            
            if is_both: 
                
                assert validators is not None, "SUBSTAKE-STAKING(STAKE): Validators must be provided for Substrate"
                assert is_nominate is True, "SUBSTAKE_STAKING(STAKE): is_nominate must be True"
                assert amount is not None, "SUBSTAKE-STAKING(STAKE): Amount must be provided"
                assert payee is not None, "SUBSTAKE-STAKING(STAKE): Payee must be provided"

                amount = float(amount)
                amount = amount * 10**SUBSTRATE_DECIMALS

                calls = []
                generic_call = Helper.get_generic_call(
                                    api=self.api,
                                    module="Staking",
                                    function="bond",
                                    params={'controller': user_address, 'value': amount, 'payee': payee}
                                )
                calls.append(generic_call)
                generic_call = Helper.get_generic_call(
                                    api=self.api,
                                    module="Staking",
                                    function="nominate",
                                    params={
                                        'targets': validators
                                    }
                                )
                calls.append(generic_call)

                generic_call = Helper.get_generic_call(
                    api=self.api,
                    module='Utility',
                    function='batch',
                    params={'calls': calls}
                )

                (is_success, message) = Helper.send_extrinsic(
                                            api=self.api,
                                            generic_call=generic_call,
                                            user_address=user_address    
                                        )

                return {'Status': is_success, 'Message': message}                    

            if is_nominate: 

                assert validators is not None, "SUBSTAKE-STAKING(STAKE): Validators must be provided for Substrate"

                generic_call = Helper.get_generic_call(
                                    api=self.api,
                                    module="Staking",
                                    function="nominate",
                                    params={
                                        'targets': validators
                                    }
                                )
                (is_success, message) = Helper.send_extrinsic(
                                            api=self.api,
                                            generic_call=generic_call,
                                            user_address=user_address    
                                        )
                return {'Status': is_success, 'Message': message}

            else:
                assert is_pool is not None, "SUBSTAKE-STAKING(STAKE): Is_pool must be provided"
                assert amount is not None, "SUBSTAKE-STAKING(STAKE): Amount must be provided"
                amount = float(amount)
                is_pool = str_to_bool(is_pool)
                amount = amount * 10**SUBSTRATE_DECIMALS
                
                if is_pool:
                    assert pool_id is not None, "SUBSTAKE-STAKING(STAKE): Pool id must be provided for Substrate"
                    pool_id = int(pool_id)
                else:
                    assert payee is not None, "SUBSTAKE-STAKING(STAKE): Payee must be provided for Substrate"
                
                pallet = "NominationPools" if is_pool else "Staking"
                dispatch_call = "join" if is_pool else "bond"
                params = {'amount': amount, 'pool_id': pool_id} if is_pool \
                        else {'controller': user_address, 'value': amount, 'payee': payee}
                
                generic_call = Helper.get_generic_call(
                                    api=self.api,
                                    module=pallet,
                                    function=dispatch_call,
                                    params=params
                                )
            
                (is_success, message) = Helper.send_extrinsic(
                                            api=self.api,
                                            generic_call=generic_call,
                                            user_address=user_address   
                                        )   
                return {'Status': is_success, 'Message': message}
    
    def stake_more(
        self, 
        user_address=None, 
        collator_address=None,
        amount=None, 
        is_pool=None
    ):

        '''
        Method
        - Send stake-more transaction
        
        Params
        - user_address: Whose asset
        - amount: additional asset
        - collator_address: Only needed in EVM
        - is_pool: If neccessary. Int

        Returns
        - Dictionary
        - {'Status': "Success" or "Fail", 'Message': Transaction Hash / Error}
        '''

        assert user_address is not None, "SUBSTKAE-STAKING(STAKE MORE): User address must be provided"
        assert amount is not None, "SUBSTAKE-STAKING(STAKE MORE): More should be provided"
        amount = float(amount)

        if self.name == 'evm':

            assert collator_address is not None, "SUBSTAKE-STAKING(STAKE MORE): Collator address must be provided"

            amount = amount * 10**EVM_DECIMALS
            nonce = self.api.eth.get_transaction_count(user_address)
            tx_dict = self.contract.functions.delegator_bond_more(
                collator_address,
                amount,
            ).buildTransaction({'gas': 210000})
            tx_dict['nonce'] = nonce
            tx_dict['from'] = user_address

            (is_success, message) = Helper.eth_sign_transaction(
                                        api=self.api, 
                                        tx_dict=tx_dict, 
                                        user_address=user_address
                                    )

            return {'Status': is_success, 'Message': message}

        elif self.name == 'substrate':
            
            assert is_pool is not None, "SUBSTAKE-STAKING(STAKE MORE): Is_pool must be provided"

            is_pool = str_to_bool(is_pool)
            amount = amount * 10**SUBSTRATE_DECIMALS
            pallet = 'NominationPools' if is_pool else 'Staking'
            dispatch_call = 'bondMore'
            params = {'extra': amount} if is_pool else {'max_additional': amount}
            
            generic_call = Helper.get_generic_call(
                api=self.api,
                module=pallet,
                function=dispatch_call,
                params=params
            )
            (is_success, message) = Helper.send_extrinsic(
                                        api=self.api,
                                        generic_call=generic_call,
                                        user_address=user_address    
                                    )

            if is_success == "Success": 

                lighter_node = Helper.reorder_bag_for(
                                    api=self.api, 
                                    user_address=user_address
                                ) 
                generic_call = Helper.get_generic_call(
                                    api=self.api,
                                    module="VoterList",
                                    function="putInFrontOf",
                                    params={
                                        'lighter': lighter_node
                                    }
                                )
                (is_success, message) = Helper.send_extrinsic(
                                        api=self.api,
                                        generic_call=generic_call,
                                        user_address=user_address    
                                    )
                
            return {'Transaction Status': is_success, 'Message': message}

    def stake_less(
        self, 
        user_address=None, 
        collator_address=None,
        amount=None, 
    ):

        '''
        Method
        - EVM: bond_less
        - SUBSTEATE: unbond

        Returns
        - Dictionary
        - {'Status': "Success" or "Fail", 'Message': Transaction Hash / Error}
        '''

        assert user_address is not None, "SUBSTAKE-STAKING(STAKE LESS): User address must be provided"
        assert amount is not None, "SUBSTAKE-STAKING(STAKE LESS): Less must be provided"
        amount = float(amount)

        if self.name == 'evm':
            
            assert collator_address is not None, "SUBSTAKE-STAKING(STAKE LESS): Collator address must be provided for EVM"

            amount = amount * 10**EVM_DECIMALS
            nonce = self.api.eth.get_transaction_count(user_address)
            tx_dict = self.contract.functions.schedule_delegator_bond_less(
                collator_address,
                amount,
            ).buildTransaction({'gas': 210000})
            tx_dict['nonce'] = nonce
            tx_dict['from'] = user_address
            (is_success, message) = Helper.eth_sign_transaction(
                                        api=self.api, 
                                        tx_dict=tx_dict, 
                                        user_address=user_address
                                    )

            return {'Status': is_success, 'Message': message}

        elif self.name == 'substrate':

            amount = amount * 10**SUBSTRATE_DECIMALS
            generic_call = Helper.get_generic_call(
                                api=self.api,
                                module="Staking",
                                function="unbond",
                                params={
                                    'value': amount
                                }
                            )
            (is_success, message) = Helper.send_extrinsic(
                                        api=self.api,
                                        generic_call=generic_call,
                                        user_address=user_address    
                                    )

            return {'Status': is_success, 'Message': message}

    def restake(
        self, 
        user_address=None, 
        amount=None
    ):
        
        '''
        Method
        - EVM: pass
        - SUBSTRATE: rebond

        Returns
        - Dictionary
        - {'Status': "Success" or "Fail", 'Message': Transaction Hash / Error}
        '''

        assert user_address is not None, "SUBSTAKE-STAKING(RESTAKE): User address should be provided"
        assert amount is not None, "SUBSTAKE-STAKING(RESTAKE): Amount shoud be provided"
        
        amount = float(amount)
        if self.name == 'evm':

            pass
        elif self.name == 'substrate':

            amount = amount * 10**SUBSTRATE_DECIMALS
            generic_call = Helper.get_generic_call(
                                api=self.api,
                                module="Staking",
                                function="rebond",
                                params={
                                    'value': amount
                                }
                            )
            (is_success, message) = Helper.send_extrinsic(
                                        api=self.api,
                                        generic_call=generic_call,
                                        user_address=user_address    
                                    )
            return {'Status': is_success, 'Message': message}

    def stop_stake(
        self, 
        user_address=None, 
        collator_address=None
    ):

        '''
        Method
        - Pull all staked asset
        - EVM: revoke
        - SUBSTRATE: chill

        Params 
        - user_address: Whose asset
        - collator_address: Only needed in EVM(Moonbeam)

        Returns
        - Dictionary
        - {'Status': "Success" or "Fail", 'Message': Transaction Hash / Error}
        '''

        assert user_address is not None, "SUBSTAKE-STAKING(STOP STAKE): User address must be provided"

        if self.name == 'evm':

            assert collator_address is not None, "SUBSTAKE-STAKING(STOP STAKE): Collator address must be provided"

            nonce = self.api.eth.get_transaction_count(user_address)
            tx_dict = self.contract.functions.schedule_revoke_delegation(
                collator_address,
            ).buildTransaction({'gas': 210000})
            tx_dict['nonce'] = nonce
            tx_dict['from'] = user_address

            (is_success, message) = Helper.eth_sign_transaction(
                                        api=self.api, 
                                        tx_dict=tx_dict, 
                                        user_address=user_address
                                    )
            return {'Status': is_success, 'Message': message}

        elif self.name == 'substrate':

            generic_call = Helper.get_generic_call(
                                api=self.api,
                                module="Staking",
                                function="chill",
                                params={}
                            )
            (is_success, message) = Helper.send_extrinsic(
                                        api=self.api,
                                        generic_call=generic_call,
                                        user_address=user_address    
                                    )
            return {'Status': is_success, 'Message': message}

    def get_staking_status(self, user_address):
        
        assert user_address is not None, "SUBSTKAE-STAKING(STAKING STATUS): User address must be provided"

        payee = self.api.query(
            module='Staking',
            storage_function='payee',
            params=[user_address]
        )

        


if __name__ == "__main__":

    staking_substrate = Staking(env='substrate', provider='wss://ws-api.substake.app')
    # mnemonic = "seminar outside rack viable away limit tunnel marble category witness parrot eager"
    staking_substrate.stake_more(
        user_address='5GeGNPSck3uML62Xq8SSHSDgxS9WXMJ3ukNfajvrcYQ2HUe9',
        amount="1",
        is_pool="False",
    )


     
    # staking_evm = Staking(env='evm', provider='https://rpc.api.moonbase.moonbeam.network')
    # staking_evm.stake_less(
    #     user_address="0x24E54d40c79dd99Ec626692C0AB58862A126A67b",
    #     collator_address="0x3937B5F83f8e3DB413bD202bAf4da5A64879690F",
    #     less="1",
    # )
    
