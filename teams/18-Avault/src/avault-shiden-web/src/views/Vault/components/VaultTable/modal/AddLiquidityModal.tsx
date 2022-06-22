import React, { useCallback, useEffect, useState } from 'react';
import vaultConfig from 'config/constants/vault';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { Currency, ETHER, TokenAmount } from '@my/sdk';
import { Button, Flex, useMatchBreakpoints, Modal, Input, Heading, AutoRenewIcon } from '@my/ui';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { RowBetween } from 'components/Layout/Row';
import { ROUTER_ADDRESS } from 'config/constants';
import { useCurrency } from 'hooks/Tokens';
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback';
import useTransactionDeadline from 'hooks/useTransactionDeadline';
import { Field } from 'state/mint/actions';
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks';
import { useTransactionAdder } from 'state/transactions/hooks';
import { useUserSlippageTolerance } from 'state/user/hooks';
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils';
import { maxAmountSpend } from 'utils/maxAmountSpend';
import { wrappedCurrency } from 'utils/wrappedCurrency';
import JSBI from 'jsbi';
import { chainKey } from 'config';
import tokens, { chainId } from 'config/constants/tokens';
import { IVault, IVaultConfigItem } from 'state/vault/types';
import styled from 'styled-components';
import { MaxButton } from 'style/SmallBorderPageLayout';
import { tokenIndex } from 'views/Zap/constants/data';
import ZapCurrencyLogo from 'views/Zap/components/ZapCurrencyLogo';
import ZapBalance from 'views/Zap/components/ZapBalance';
import IconAdd from 'components/svg/IconAdd';

interface AddLiquidityModalProps {
  vault: IVault;
  account: string;
  onDismiss?: () => void;
}
const AddLiquidityModal: React.FC<AddLiquidityModalProps> = ({ vault, account, onDismiss }) => {
  const { isMd, isXl, isLg } = useMatchBreakpoints();
  const isMobile = !(isMd || isXl || isLg);
  const index = vaultConfig.map((v: IVaultConfigItem) => v.lpDetail.symbol).indexOf(vault.lpDetail.symbol);

  const token = tokenIndex[index][0];

  const fromCurrency = tokens[chainKey][token[0]];
  const toCurrency = tokens[chainKey][token[1]];

  const currencyIdA = fromCurrency.address[chainId];
  const currencyIdB = toCurrency.address[chainId];

  const { library } = useActiveWeb3React();

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const { dependentField, currencies, currencyBalances, parsedAmounts, noLiquidity, error } = useDerivedMintInfo(
    currencyA,
    currencyB,
  );

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity);

  const isValid = !error;

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  // txn values
  const deadline = useTransactionDeadline(); // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance(); // custom from users

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      };
    },
    {},
  );
  useEffect(() => {
    return () => {
      onFieldAInput('');
      onFieldBInput('');
    };
    // eslint-disable-next-line
  }, []);
  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[chainId]);
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[chainId]);

  const addTransaction = useTransactionAdder();

  async function onAdd() {
    if (!chainId || !library || !account) return;
    const router = getRouterContract(chainId, library, account);

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts;
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    };

    let estimate;
    let method: (...args: any) => Promise<TransactionResponse>;
    let args: Array<string | string[] | number>;
    let value: BigNumber | null;
    if (currencyA === ETHER[chainId] || currencyB === ETHER[chainId]) {
      const tokenBIsETH = currencyB === ETHER[chainId];
      estimate = router.estimateGas.addLiquidityETH;
      method = router.addLiquidityETH;

      const commonToken: Currency = tokenBIsETH ? currencyA : currencyB;
      const rawAmountA = (tokenBIsETH ? parsedAmountA : parsedAmountB).raw;
      let amountPrecion = JSBI.BigInt(1);
      if (commonToken.decimals >= 18) {
        amountPrecion = JSBI.BigInt(1000000000000);
      }
      const concatAmountA = JSBI.multiply(JSBI.divide(rawAmountA, amountPrecion), amountPrecion);

      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        concatAmountA.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ];
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString());
    } else {
      estimate = router.estimateGas.addLiquidity;
      method = router.addLiquidity;
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ];
      value = null;
    }

    if (value) {
    }

    setAttemptingTxn(true);
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        }).then(async (response) => {
          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          });
          const { hash } = response;
          if (hash) {
            const receipt = await response.wait();
            if (receipt.status) {
              setAttemptingTxn(false);
              onFieldAInput('');
              onFieldBInput('');
              onDismiss();
            }
          }
        }),
      )
      .catch((err) => {
        setAttemptingTxn(false);
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err);
        }
      });
  }

  const handleChangeA = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      try {
        if (e.currentTarget.validity.valid) {
          const value = e.currentTarget.value.replace(/,/g, '.');
          onFieldAInput(value);
        }
      } catch (e) {
        onFieldAInput('');
      }
    },
    [onFieldAInput],
  );

  const handleChangeB = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      try {
        if (e.currentTarget.validity.valid) {
          const value = e.currentTarget.value.replace(/,/g, '.');
          onFieldBInput(value);
        }
      } catch (e) {
        onFieldBInput('');
      }
    },
    [onFieldBInput],
  );
  return (
    <Modal
      title={`Add Liquidity`}
      minWidth={isMobile ? '343px' : '480px'}
      headerPadding={isMobile ? '20px 16px' : '20px 30px 6px'}
      bodyPadding={isMobile ? '0 16px 30px' : '0 30px 30px'}
      onDismiss={onDismiss}
    >
      <TitleStyled>
        {fromCurrency.symbol}+{toCurrency.symbol} {' > '}
        {vault.lpDetail.symbol}
      </TitleStyled>
      <InnerStyled>
        <PaddingStyled>
          <FlexCol>
            <FlexCol>
              <ZapCurrencyLogo currency={fromCurrency} />
              <TokenStyled>{fromCurrency.symbol}</TokenStyled>
            </FlexCol>
            <Flex alignItems="end" justifyContent="center" flexDirection="column">
              <Flex alignItems="center" justifyContent="center" paddingTop="4px">
                <ZapBalance account={account} currency={fromCurrency} />
                <MaxButtonStyled
                  variant="text"
                  onClick={() => {
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '');
                  }}
                >
                  Max
                </MaxButtonStyled>
              </Flex>
              <StyledInput
                pattern={`^[0-9]*[.,]?[0-9]{0,8}$`}
                inputMode="decimal"
                step="any"
                min="0"
                placeholder="0.00"
                value={formattedAmounts[Field.CURRENCY_A]}
                onChange={handleChangeA}
              />
            </Flex>
          </FlexCol>
        </PaddingStyled>
        <PaddingStyled>
          <FlexCol>
            <FlexCol>
              <ZapCurrencyLogo currency={toCurrency} />
              <TokenStyled>{toCurrency.symbol}</TokenStyled>
            </FlexCol>
            <Flex alignItems="end" justifyContent="center" flexDirection="column">
              <Flex alignItems="center" justifyContent="center" paddingTop="4px">
                <ZapBalance account={account} currency={toCurrency} />
                <MaxButtonStyled
                  variant="text"
                  onClick={() => {
                    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '');
                  }}
                >
                  Max
                </MaxButtonStyled>
              </Flex>
              <StyledInput
                pattern={`^[0-9]*[.,]?[0-9]{0,8}$`}
                inputMode="decimal"
                step="any"
                min="0"
                placeholder="0.00"
                value={formattedAmounts[Field.CURRENCY_B]}
                onChange={handleChangeB}
              />
            </Flex>
          </FlexCol>
        </PaddingStyled>
        <IconAdd />
      </InnerStyled>
      <RowBetween>
        <SubtleBtnStyled
          variant="subtle"
          endIcon={approvalA === ApprovalState.PENDING ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={approvalA === ApprovalState.PENDING}
          onClick={approveACallback}
          disabled={
            approvalA === ApprovalState.UNKNOWN ||
            approvalA === ApprovalState.PENDING ||
            approvalA === ApprovalState.APPROVED
          }
          width="48%"
        >
          {approvalA === ApprovalState.APPROVED ? 'Approved' : 'Approve'} {currencies[Field.CURRENCY_A]?.symbol}
        </SubtleBtnStyled>
        <SubtleBtnStyled
          variant="subtle"
          isLoading={approvalB === ApprovalState.PENDING}
          onClick={approveBCallback}
          endIcon={approvalB === ApprovalState.PENDING ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={
            approvalB === ApprovalState.UNKNOWN ||
            approvalB === ApprovalState.PENDING ||
            approvalB === ApprovalState.APPROVED
          }
          width="48%"
        >
          {approvalB === ApprovalState.APPROVED ? 'Approved' : 'Approve'} {currencies[Field.CURRENCY_B]?.symbol}
        </SubtleBtnStyled>
      </RowBetween>
      <Button
        isLoading={attemptingTxn}
        marginTop="16px"
        variant={
          !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'danger' : 'primary'
        }
        endIcon={attemptingTxn ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={onAdd}
        disabled={
          attemptingTxn || !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED
        }
      >
        Add Liquidity
      </Button>
    </Modal>
  );
};
const SubtleBtnStyled = styled(Button)`
  width: 48%;
  font-weight: 600;
  padding: 0;
  white-space: nowrap;
  font-size: 13px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
  }
`;
const StyledInput = styled(Input)`
  box-shadow: none;
  padding: 0;
  border-width: 0px;
  background-color: rgba(0, 0, 0, 0);
  width: 100%;
  text-align: right;
  font-size: 18px;
`;
const PaddingStyled = styled.div`
  padding: 10px 20px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBackground};
  &:last-child {
    border-bottom: none;
  }
`;

const MaxButtonStyled = styled(MaxButton)`
  font-size: 12px;
  height: 30px;
`;
const FlexCol = styled(Flex)`
  align-items: center;
  justify-content: space-between;
`;
const TokenStyled = styled(Heading)`
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
`;
const InnerStyled = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  margin-bottom: 30px;
  position: relative;
  margin: 20px 0 30px;
`;
const TitleStyled = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-weight: 600;
`;
export default AddLiquidityModal;
