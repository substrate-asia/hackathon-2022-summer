
from curses.ascii import SUB
from base import Base
from Utils.chain_info import SUBSTRATE_DECIMALS

class Asset_Manager(Base):

    def __init__(self, env, provider):
        super().__init__(env=env, provider=provider)

    def get_user_balance_status(self, user_address):
        
        ledger = self.api.query(
                                    module='Staking',
                                    storage_function='Ledger',
                                    params=[user_address]
                                )
        asset_status = [] 
        if ledger == None:
            print("User is not bonding!")
            asset_status.append({'is_bonding': "False"})
        else:
            print("User is bonding!")
            ledger = ledger.value
            total = float(ledger['total']) / 10**SUBSTRATE_DECIMALS
            if len(ledger['unlocking']) == 0: 
                unlocking = []
            else:
                unlocking_status = ledger['unlocking'][0]
                value = float(unlocking_status['value']) / 10**SUBSTRATE_DECIMALS
                era = unlocking_status['era']
                unlocking = [{
                    'value': value,
                    'era': era
                }]
            asset_status.append({
                'is_bonding': "True",
                'total': total,
                'unlock': unlocking
            })

        return asset_status


if __name__ == '__main__': 

    asset_manager = Asset_Manager(
                                    env='substrate', 
                                    provider='wss://ws-api.substake.app'
                                 )
    account_1 = '5F9jBNMWCRh48XVzgGZC4BBWaHLHt128yK53kddyYd6x4P3W'
    account_2 = '5Fqc8dQkr3zALLGvgc3sDYzzd8Vp6zRWNT7S5xd1gs2UUMDo'
    account_3 = '5GeGNPSck3uML62Xq8SSHSDgxS9WXMJ3ukNfajvrcYQ2HUe9'
    asset_manager.get_user_balance_status(user_address=account_3)
