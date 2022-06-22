import logging
import json
import Utils.Config as db_con
from substrateinterface import SubstrateInterface

substrate = SubstrateInterface(
    url="wss://moonbeam-alpha.api.onfinality.io/public-ws"
)   

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)



def get_recommended_collators(bond_amount:int) -> list:
    try:
        conn = db_con.get_connection()
        collator_list = [] 
        with conn.cursor() as cur: 
            total_acrive_collator = 80 #change to get data from on-chain
            limit_collator_number = total_acrive_collator*(2/3)
            avg_bpr = 7.5 #80(active collators)/600(blocks per round)
            
            query_string = f"SELECT * from dev_collator_list " \
                        f"WHERE active_status = True " \
                        f"AND minimun_bond < {bond_amount} " \
                        f"AND average_bpr_week > {avg_bpr} " \
                        f"ORDER BY average_bpr_week DESC, bonded_total DESC " \
                        f"LIMIT {limit_collator_number}" 
                        
            print(query_string)
            cur.execute(query_string)
            collator_set = cur.fetchall()
            
            for row in collator_set:
                account_address = row[0]
                account_displayname = row[1]
                average_bpr_week = '{:.3f}'.format(float(row[8]))
                bonded_total = row[5]
                simulated_share = (bond_amount/bonded_total) * 100
                simulated_share = '{:.3f}'.format(float(simulated_share))
                
                collators = {
                                'address' : account_address,                #콜래터 지갑 주소 
                                'display_name' : account_displayname,       #콜래터 이름
                                'average_bpr' : average_bpr_week,           #20pts per block  
                                'simulated_share' : simulated_share
                                
                            }
                collator_list.append((collators))  
        return collator_list 
    except Exception as e:
        e.with_traceback()
    finally:
        conn.close()

## for test
def main():
    return_str = json.dumps(get_recommended_collators(30))
    print(return_str)

    
if __name__ == "__main__":
    main()