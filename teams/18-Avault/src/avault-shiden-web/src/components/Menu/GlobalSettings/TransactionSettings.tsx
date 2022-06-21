import React, { useState } from 'react';
import { Text, Button, Input, Flex, Box } from '@my/ui';
import { useTranslation } from 'contexts/Localization';
import { useUserSlippageTolerance, useUserTransactionTTL } from 'state/user/hooks';
import QuestionHelper from '../../QuestionHelper';
import styled from 'styled-components';
import useTheme from 'hooks/useTheme';
enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const StyledInput = styled(Input)`
  &::placeholder {
    text-align: left;
  }
`;

const SlippageTabs = () => {
  const { theme } = useTheme();
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance();
  const [ttl, setTtl] = useUserTransactionTTL();
  const [slippageInput, setSlippageInput] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');

  const { t } = useTranslation();

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2);
  const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput;

  let slippageError: SlippageError | undefined;
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput;
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow;
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh;
  } else {
    slippageError = undefined;
  }

  let deadlineError: DeadlineError | undefined;
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput;
  } else {
    deadlineError = undefined;
  }

  const parseCustomSlippage = (value: string) => {
    setSlippageInput(value);

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString());
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setUserslippageTolerance(valueAsIntFromRoundedFloat);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value);

    try {
      const valueAsInt: number = Number.parseInt(value) * 60;
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setTtl(valueAsInt);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column" mb="24px">
        <Flex alignItems="center" mb="12px">
          <Text fontSize="12px">{t('Slippage Tolerance')}</Text>
          <QuestionHelper
            text={t(
              'Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.',
            )}
            ml="4px"
          />
        </Flex>
        <Flex flexWrap="wrap">
          <Button
            style={{
              height: '36px',
              fontSize: '14px',
              color: userSlippageTolerance === 10 ? theme.colors.btnTextColor : theme.colors.textSubSubtle,
              background: userSlippageTolerance === 10 ? theme.colors.primary : theme.colors.btnBgSecondaryColor,
              fontWeight: 600,
            }}
            mr="12px"
            scale="sm"
            onClick={() => {
              setSlippageInput('');
              setUserslippageTolerance(10);
            }}
          >
            0.1%
          </Button>
          <Button
            style={{
              height: '36px',
              fontSize: '14px',
              color: userSlippageTolerance === 50 ? theme.colors.btnTextColor : theme.colors.textSubSubtle,
              background: userSlippageTolerance === 50 ? theme.colors.primary : theme.colors.btnBgSecondaryColor,
              fontWeight: 600,
            }}
            mr="12px"
            scale="sm"
            onClick={() => {
              setSlippageInput('');
              setUserslippageTolerance(50);
            }}
          >
            0.5%
          </Button>
          <Button
            style={{
              height: '36px',
              background: userSlippageTolerance === 100 ? theme.colors.primary : theme.colors.btnBgSecondaryColor,
              color: userSlippageTolerance === 100 ? theme.colors.btnTextColor : theme.colors.textSubSubtle,
              fontSize: '14px',
              fontWeight: 600,
            }}
            mr="12px"
            scale="sm"
            onClick={() => {
              setSlippageInput('');
              setUserslippageTolerance(100);
            }}
          >
            1.0%
          </Button>
          <Flex
            flex="1"
            alignItems="center"
            width="76px"
            style={{
              padding: '0px 16px',
              background: theme.colors.cardBackground,
              border: '1px solid #272E32',
              borderRadius: '12px',
            }}
          >
            <Input
              style={{
                borderRadius: '0px',
                margin: '0px',
                padding: '0px',
                color: theme.colors.btnTextColor,
                background: 'rgba(0,0,0,0)',
                border: '0',
                fontSize: '14px',
              }}
              scale="sm"
              placeholder={(userSlippageTolerance / 100).toFixed(2)}
              value={slippageInput}
              onBlur={() => {
                parseCustomSlippage((userSlippageTolerance / 100).toFixed(2));
              }}
              onChange={(e) => parseCustomSlippage(e.target.value)}
              isWarning={!slippageInputIsValid}
              isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
            />
            <Text small color="#00DBDE" bold ml="2px">
              %
            </Text>
          </Flex>
        </Flex>
        {!!slippageError && (
          <Text fontSize="14px" color={slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'} mt="8px">
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
              ? t('Your transaction may fail')
              : t('Your transaction may be frontrun')}
          </Text>
        )}
      </Flex>
      <Flex alignItems="center" mb="12px">
        <Text fontSize="12px">{t('Tx deadline (mins)')}</Text>
        <QuestionHelper
          text={t('Your transaction will revert if it is left confirming for longer than this time.')}
          ml="4px"
        />
      </Flex>
      <Box
        style={{
          background: theme.colors.cardBackground,
          border: '1px solid #272E32',
          padding: '0px 16px',
          width: '50%',
          borderRadius: '12px',
        }}
      >
        <StyledInput
          style={{
            background: 'none',
            border: 'none',
            padding: '0px',
            fontSize: '14px',
            fontWeight: 600,
            color: theme.colors.btnTextColor,
            textAlign: 'right',
            borderRadius: '0px',
          }}
          scale="sm"
          color={deadlineError ? 'red' : undefined}
          onBlur={() => {
            parseCustomDeadline((ttl / 60).toString());
          }}
          placeholder="Minutes"
          value={deadlineInput}
          onChange={(e) => parseCustomDeadline(e.target.value)}
        />
      </Box>
    </Flex>
  );
};

export default SlippageTabs;
