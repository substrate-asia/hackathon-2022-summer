import logging
from substrateinterface import SubstrateInterface

substrate = SubstrateInterface(
    url="wss://moonbeam-alpha.api.onfinality.io/public-ws"
)   

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

def get_recommended_collators() -> list:
    
    return

## for test
def main():
    get_recommended_collators()
    
if __name__ == "__main__":
    main()