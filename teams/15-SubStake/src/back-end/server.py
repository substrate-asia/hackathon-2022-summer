from operator import is_
from unicodedata import is_normalized
import requests
import json
import dev_substrate_interface as dev
from Helper import Helper
from Staking import Staking
from asset_manager import Asset_Manager
from Utils.chain_info import NETWORK_PROVIDER
from curator import Curator
import requests
import json
import dev_substrate_interface as dev
import user_info
from flask import Flask, request, make_response, jsonify
app = Flask (__name__) 
 
@app.route('/api/request/dev/set-key', methods=['POST'])
def set_user_key():
    if request.method == 'POST':
        '''
            request = {
                'public_key' : 'public_key'
                'private_key': 'private_key'
                'env' : 'evm' / 'substrate'
            }
        '''
        _request = request.get_json()
        print('Data Received: {request}'.format(request=_request))
        public_key = _request.get('public_key')
        private_key = _request.get('private_key')
        env = _request.get('env')
        
        if user_info.set_user_info(public_key, private_key, env):
            response = make_response("Success", 200)
        else :
            response = make_response("Failed", 200)
        #print(return_str)
        return response

@app.route('/api/request/dev/asset', methods=['POST'])
def request_asset_status():
    if request.method == 'POST':

        _request = request.get_json()
        print('Data Received: {request}'.format(request=_request))
        user_address = _request.get('of')
        asset_manager = Asset_Manager(env='substrate', provider='ws://127.0.0.1:9954')
        result = Helper.request_asset_status(
                user_address=user_address, 
                asset_manager=asset_manager
            )
        asset = json.dumps(result)
        response = make_response(asset, 200)

        return response
    else:
        return make_response("Not supported method", 400)


@app.route('/api/request/dev/curate', methods=['POST'])
def request_curation():
    if request.method == 'POST':
        
        _request = request.get_json()
        print('Data Received: {request}'.format(request=_request))
        which = _request.get('which')
        curator = Curator(env='substrate', provider='ws://127.0.0.1:9954')
        result = Helper.request_curation(
            which=which,
            request=_request,
            curator=curator
        )
        curating_result = json.dumps(result)
        response = make_response(curating_result, 200)
        
        return response
    else:
        return make_response("Not supported method", 400)


@app.route('/api/request/dev/stake', methods=['POST'])
def request_staking_transaction():

    if request.method == 'POST':
        
        '''
        request = {
            'env' : 'evm' / 'substrate'
            'provider': 'moonbase' / 'westend'
            'method': 'stake' / 'stakeMore' / 'stakeLess' / 'reStake' / 'stopStake'
        }
        '''
        
        _request = request.get_json()
        print('Data Received: {request}'.format(request=_request))

        env = _request.get('env')
        provider = NETWORK_PROVIDER[_request.get('provider')]
        method = _request.get('method')
        staking = Staking(env=env, provider=provider)

        result = Helper.request_staking_transaction(
                    request=_request, 
                    method=method, 
                    env=env,
                    staking=staking
                )
        print(result)     
        return_tx_status = json.dumps(result)
        response = make_response(return_tx_status, 200)

        return response
    else:
        return make_response('Not supported method', 400)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)