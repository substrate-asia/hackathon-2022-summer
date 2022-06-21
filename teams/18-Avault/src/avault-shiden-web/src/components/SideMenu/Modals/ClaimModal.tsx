import React, { useState, useEffect } from 'react';
import { Button, Flex, Text, IconButton, CloseIcon } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import Modal from 'components/Modal/Modal';
import Claim_KAC_Token_PNG from './Claim_KAC_Token_PNG.png';
import Balance from 'components/Balance';
import styled from 'styled-components';
import { useMerkleDistributorContract } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import { useWeb3React } from '@web3-react/core';
import merkle from 'config/constants/merkle.json';

import { getBalanceAmount } from 'utils/formatBalance';
const HeaderStyled = styled(Flex)`
  img {
    width: 60px;
    height: 60px;
    margin-right: 14px;
  }
`;
// const BorderDiv = styled.div`
//   padding: 15px 5%;
//   background:  ${({ theme }) => theme.colors.cardBackground};
//   border: 1px solid ${({ theme }) => theme.colors.background02};
//   border-radius: 12px;
//   margin-bottom: 30px;
// `;
// const BorderInput = styled(Input)`
//   background:  ${({ theme }) => theme.colors.cardBackground};
//   border: none;
//   padding: 0;
//   font-size: 16px;
// `;
const BgButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 0;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.btnTextColor};
  height: 48px;
  margin-bottom: 20px;
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background02};
  }
`;
interface CollectModalProps {
  onDismiss?: () => void;
}

const getClaimObjectFromAddress = (address: string) => {
  const keys = Object.keys(merkle.claims);
  return merkle.claims[keys.find((key) => key.toLowerCase() === address.toLowerCase())];
};
const CollectModal: React.FC<CollectModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const airdropContract = useMerkleDistributorContract();
  const [claimable, setClaimable] = useState('0');
  const { toastError, toastSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const address = account;
    const claimObject: any = getClaimObjectFromAddress(address);
    setClaimable(getBalanceAmount(claimObject?.amount ?? 0, 18).toString());
  }, [account]);
  const claimAirdrop = async () => {
    try {
      const address = account;
      // is Eligibility
      const claimObject = getClaimObjectFromAddress(address);
      if (!claimObject) {
        toastError('Error', 'Address has no available claim');
        return false;
      }
      // is claimed
      const isClaimed = await airdropContract.isClaimed(claimObject.index);
      if (isClaimed) {
        toastError('Claimed Error', 'you have already claimed your airdrop');
        return false;
      }
      setIsLoading(true);
      const tx = await airdropContract.claim(claimObject.index, address, claimObject.amount, claimObject.proof, {
        from: account,
      });
      toastSuccess('Recoreded', 'Your transaction has been recoreded');
      const receipt = await tx.wait();
      if (receipt.status) {
        toastSuccess('successfully claimed', 'You have successfully claimed your airdrop');
      } else {
        toastError('Transation was not Successful');
      }
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      toastError(e?.data?.message ?? 'Claimed Error');
    }
  };

  return (
    <Modal>
      <Flex justifyContent="space-between" mb="10px">
        <HeaderStyled>
          <img src={Claim_KAC_Token_PNG} alt="Claim_KAC_Token_PNG" />
          <div>
            <Balance fontSize="28px" bold value={+claimable} decimals={2} unit="KAC" />
            <Text bold fontSize="14px">
              Claim KAC Token
            </Text>
          </div>
        </HeaderStyled>

        <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
          <CloseIcon color="#484E4E" width="24" />
        </IconButton>
      </Flex>

      <Text padding="0 4%" mt="20px" mb="30px" bold fontSize="14px" lineHeight="24px" color="#9DA6A6">
        Get your rewards
      </Text>
      {/* <BorderDiv>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        <Text color="#9DA6A6;" fontSize="12px" mb="4px">
          Recipient
        </Text>

        <BorderInput
          id="claimAddress"
          name="address"
          type="text"
          placeholder={t('Wallet Address or ENS name')}
          value={value}
          onChange={handleChange}
          isWarning={error}
          disabled={isLoading}
        />
      </BorderDiv> */}
      <BgButton
        minWidth="150px"
        variant="secondary"
        onClick={claimAirdrop}
        disabled={!account || isLoading}
        ml="8px"
        mr="8px"
      >
        {t('Claim KAC')}
      </BgButton>
    </Modal>
  );
};

export default CollectModal;
