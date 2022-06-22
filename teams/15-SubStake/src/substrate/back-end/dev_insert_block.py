
import time as time
import requests, json
import logging
import Config as db_con
from substrateinterface import SubstrateInterface

substrate = SubstrateInterface(
    url="wss://moonbeam-alpha.api.onfinality.io/public-ws"
)   

#to-do : api key info - move to env
header = {
            'X-API-Key': '9374064d28d4f4d52a8a7dda4ce7d826', #feridot
            'Content-Type': 'application/json',
        }
# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

#Moonbase-Aphal blocks per round
blocks_per_round = 600

def get_avg_block_from_db(collator_addr, round_count):
    
#    final_block = get_max_block()

    conn = db_con.get_connection()
    with conn:
        cur = conn.cursor()
        cur.execute(f"SELECT MAX(blocknum) FROM dev_block_collator")
        final_block = cur.fetchone()[0]

    remain_block = final_block % blocks_per_round
    last_end_block = final_block - remain_block    
    last_start_block = last_end_block - (blocks_per_round * round_count)
        


   
    with conn:
        cur = conn.cursor()
        cur.execute(f"SELECT count(*) FROM dev_block_collator WHERE blocknum >= {last_start_block} AND blocknum < {last_end_block} AND collator_addr = '{collator_addr}'")

    block_count = cur.fetchone()[0]


    return block_count / round_count

def insert_top_nominator_status():
    try:
        conn = db_con.get_connection()
        cur = conn.cursor()
        
        cur.execute(f"SELECT collator_address, display_name, active_status, bonded_total FROM dev_collator_list ORDER BY bonded_total DESC;")
        
        collator_list= cur.fetchall()

        cur.execute(f"DELETE FROM dev_nominator_list;")
        for collator in collator_list:
            collator_address = collator[0]
            result = substrate.query(
                module='ParachainStaking',
                storage_function='TopDelegations',
                params=[collator_address]
            )

            rank = 0
            
            for bottom_delegator in result['delegations']:
                user_address = bottom_delegator['owner']
                amount = bottom_delegator['amount'].value
                rank += 1
                logging.info(f"insert_top_nominator_status::collator:{collator_address}:user:{user_address}:bond:{amount}:rank:{rank}")
                query_string = f'INSERT INTO dev_nominator_list ' \
                            f'(collator_address, nominator_address, rank_nominator, bonded, is_top) ' \
                            f'VALUES(\'{collator_address}\', \'{user_address}\', {rank}, {amount}, True);'
                cur.execute(query_string)
                
        conn.commit()
    except Exception as e:
        conn.rollback()
        e.with_traceback()
        
    finally:
        conn.close()
 
def insert_bottom_nominator_status():
    try:
        conn = conn = db_con.get_connection()
        cur = conn.cursor()
        
        cur.execute(f"SELECT collator_address, display_name, active_status, bonded_total FROM dev_collator_list ORDER BY bonded_total DESC;")
        
        collator_list= cur.fetchall()

        for collator in collator_list:
            collator_address = collator[0]
            result = substrate.query(
                module='ParachainStaking',
                storage_function='BottomDelegations',
                params=[collator_address]
            )
            query_str = f"SELECT MAX(rank_nominator) FROM dev_nominator_list WHERE collator_address='{collator_address}'"
            cur.execute(query_str)
            rank = cur.fetchone()[0]
            
            for bottom_delegator in result['delegations']:
                user_address = bottom_delegator['owner']
                amount = bottom_delegator['amount'].value
                rank += 1
                logging.info(f"insert_bottom_nominator_status::collator:{collator_address}:user:{user_address}:bond:{amount}:rank:{rank}")
                query_string = f'INSERT INTO dev_nominator_list ' \
                            f'(collator_address, nominator_address, rank_nominator, bonded, is_top) ' \
                            f'VALUES(\'{collator_address}\', \'{user_address}\', {rank}, {amount}, False);'
                cur.execute(query_string)
                
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(e)
        
    finally:
        conn.close()
        
def insert_collator_list():
    try:

        result = substrate.query(
            module='ParachainStaking',
            storage_function='SelectedCandidates'
        )
        active_collator_list = result.value
        
        result = substrate.query(
            module='ParachainStaking',
            storage_function='CandidatePool'
        )
        conn = db_con.get_connection()
        cur = conn.cursor()
        cur.execute(f"DELETE from dev_collator_list;")
            
        for collator in result:
            collator_address = collator['owner']
            total_amount = collator['amount'] / 10**18
            identity = substrate.query(
                module='Identity',
                storage_function='IdentityOf',
                params=[collator_address]
            )
            if not identity == None:
                display_name = identity['info']['display']['Raw'].replace("'","''")
            else:
                display_name = collator_address[:8] + "..." + collator_address[len(collator_address)-6:]
                
            collator_info = substrate.query(
                module = 'ParachainStaking',
                storage_function='CandidateInfo',
                params=[collator_address]
            )
            #print(collator_info)
            total_bonded = collator_info['total_counted'].value / 10**18
            
            minimun_bond = collator_info['highest_bottom_delegation_amount'].value / 10**18
            count_nominstors = collator_info['delegation_count']
            bonded_owner = collator_info['bond'].value / 10**18
            bonded_nominators = total_bonded - bonded_owner
            average_bpr_week = get_avg_block_from_db(collator_address, 12 * 7)
            if collator_address in active_collator_list:
                active_status = True
            else:
                active_status = False

            query_string = f'INSERT INTO dev_collator_list ' \
                f'(collator_address, display_name, count_nominstors, bonded_nominators, bonded_owner, bonded_total, active_status, minimun_bond, average_bpr_week ) ' \
                f'VALUES(\'{collator_address}\', \'{display_name}\', {count_nominstors}, {bonded_nominators}, {bonded_owner}, {total_bonded}, {active_status}, {minimun_bond}, {average_bpr_week})'
            logging.info(query_string)
            cur.execute(query_string) 
             
        conn.commit()
    except Exception as e:
        e.with_traceback()
        conn.rollback()
    finally:
        conn.close()
 
def insert_dev_block_data(max_page:int):
    logging.info("get_dev_block_data()")
    try:
        conn = db_con.get_connection()
        cur = conn.cursor()
            

        page = 0
        while page < max_page:
            logging.info("page :: " + str(page))
            data_row = {'row': 100, 'page': page}

            response = requests.post("https://moonbase.api.subscan.io/api/scan/blocks", headers=header, data=json.dumps(data_row))
            jsonObject = response.json()
            jsonArray = jsonObject.get("data").get("blocks")

            for list in jsonArray:
                block_num = list.get("block_num")
                
                #cur.execute(f"select count(*) from dev_block_collator WHERE blocknum = {block_num}")
                #count = cur.fetchone()[0]
                validator = list.get("validator")
                auth_name = list.get("validator_name")
                #logging.info(count)
                #if count == 0 and block_num > 212355: ## author info after #212355 block height on Subscan
                logging.info(str(block_num) + ":::" + list.get("validator")+":::"+auth_name)
                auth_name = auth_name.replace("'","''")
                cur.execute(f"INSERT INTO dev_block_collator (blocknum, collator_addr, auth_name)" \
                    f"VALUES({block_num}, '{validator}', '{auth_name}' ) ON " \
                    f"CONFLICT (blocknum) DO NOTHING")

            page = page + 1
            conn.commit()
            time.sleep(0.2)
    except Exception as e:
        conn.rollback()
    finally:
        conn.close()

def main():
    max_page = 3
    insert_dev_block_data(max_page)
    insert_collator_list()
    insert_top_nominator_status()
    insert_bottom_nominator_status()

    
if __name__ == "__main__":
    main()