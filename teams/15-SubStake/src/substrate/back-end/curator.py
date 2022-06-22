
from base import Base
from Utils.chain_info import (
    SUBSTRATE_DECIMALS,
    OVER_SUBSCRIBED,
    COMMISSION_THRESHOLD
)

class Curator(Base):
    
    def __init__(self, env, provider):
       super().__init__(env=env, provider=provider)

    def get_active_validators(self, is_request=False):
        self.active_validators = self.api.query('Session', 'Validators').value
        self.era = self.api.query('Staking', 'ActiveEra').value['index'] - 1
        if is_request:
            eras_points = self.api.query('Staking', 'ErasRewardPoints', params=[self.era]).value
            validators = eras_points['individual']
            request = []
            for (validator, points) in validators:
                query = self.api.query(
                    'Staking',
                    'ErasStakers',
                    params=[self.era, validator]
                ).value
                identity = self.api.query(
                    module='Identity',
                    storage_function='IdentityOf',
                    params=[validator]
                )
                if identity == None:
                    display_name = "No value"
                else:
                    identity = identity.value['info']
                    display_name = identity['display']['Raw']
                nominees = len(query['others'])
                request.append({
                    'validator': validator,
                    'display_name': display_name,
                    'points': points,
                    'nominees': nominees
                })

            return request
        print(self.active_validators)
    
    def recommend_validators(self, bond_amount: float):

        self.get_active_validators()
        validators = []
        # eras_reward_points = self.api.query(
        #                     'Staking',
        #                     'ErasRewardPoints',
        #                     params=[self.era]
        #                 ).value
        # total_points = float(eras_reward_points['total'])
        # individual_points = float(eras_reward_points['individual'])
        # eras_reward_dict = {}
        # for (validator, reward) in individual_points:
        #     eras_reward_dict[validator] = int(reward)

        # with open('reward.json', 'w') as f:
        #     json.dump(eras_reward_dict, f, indent=2)

        eras_validators_reward = float(
                                        self.api.query(
                                            'Staking',
                                            'ErasValidatorReward',
                                            params=[self.era]
                                        ).value
                                ) / 10**SUBSTRATE_DECIMALS
        eras_reward_per_validators = eras_validators_reward / len(self.active_validators)
        
        print("Indexing validators...")
        for i in range(len(self.active_validators)):

            '''
            validator_info = {
                'commission':
                'blocked':
            }

            temp = {
                'total':
                'owned':
                'others':
            }
            '''
            active_validator = self.active_validators[i]
            validator_info = self.api.query(
                                                module='Staking', 
                                                storage_function='Validators', 
                                                params=[active_validator]
                                            ).value
            commission = float(validator_info['commission']) / 10**7
            blocked = validator_info['blocked']
            
            if blocked: 
                continue

            if commission > COMMISSION_THRESHOLD:
                continue

            commission = 0 if commission < 1 else commission
            eras_reward_per_validators = (1 - commission / 10**2) * eras_reward_per_validators
            
            temp = self.api.query(
                        module='Staking', 
                        storage_function='ErasStakers', 
                        params=[self.era, active_validator]
                      ).value 
    
            total = float(temp['total']) / 10**SUBSTRATE_DECIMALS 
            own = float(temp['own']) / 10**SUBSTRATE_DECIMALS
            nominators = temp['others']

            if len(nominators) > OVER_SUBSCRIBED:
                continue

            identity = self.api.query(
                module='Identity',
                storage_function='IdentityOf',
                params=[active_validator]
            ).value['info']
            display_name = identity['display']['Raw']

            share_ratio = bond_amount / (total + bond_amount)
            print('share_ratio: {share}'.format(share=share_ratio))
            user_reward = eras_reward_per_validators * share_ratio
            print('user_reward: {reward}'.format(reward=user_reward))
            user_return = user_reward / bond_amount * 100        

            validators.append({ 
                            'public_key': self.active_validators[i],
                            'total': total, 
                            'own': own, 
                            'display_name': display_name,
                            'user_return': user_return, 
                        })
        print("Done..!")
        return validators

    def get_nomination_pools(self):

        nomination_pools = []
        last_pool_id = self.api.query(
            module='NominationPools',
            storage_function='LastPoolId'
        ).value
        
        print("Start indexing nomination pools..")
        for index in range(last_pool_id):
            bonded_pools = self.api.query(
                                module='NominationPools',
                                storage_function='BondedPools',
                                params=[index+1]
                            ).value

            if bonded_pools == None:
                continue

            if bonded_pools['state'] == 'Destroying':
                continue

            display_name = self.api.query(
                                    module='NominationPools',
                                    storage_function='Metadata',
                                    params=[index+1]
                                ).value

            points = float(bonded_pools['points']) / 10**SUBSTRATE_DECIMALS
            member_counts = bonded_pools['member_counter']
            nomination_pools.append({
                        'display_name': display_name,
                        'index': index+1,
                        'points': points,
                        'member_counts': member_counts,
                    })  
        print("Done..!")
        print(nomination_pools)
        return nomination_pools
        
        


if __name__ == '__main__':
    
    curator = Curator(env='substrate', provider='wss://ws-api.substake.app')
    curator.get_active_validators(is_request=True)

        
    