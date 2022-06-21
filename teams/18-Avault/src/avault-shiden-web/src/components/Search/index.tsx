import React, { KeyboardEvent, FC, useState } from 'react';
import styled from 'styled-components';
import { Input } from '@my/ui';
import SearchSvg from '../svg/search.svg';

const Wrapper = styled.div<{ focused: boolean }>`
  width: 100%;
  height: 52px;
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 16px;
  padding: 0px 18px;
  display: flex;
  align-items: center;
  > input {
    flex: 1;
    background: ${({ theme }) => theme.colors.cardBackground};
    border-width: 0px;
    font-weight: 500;
  }
`;

const Search: FC<{
  className?: string;
  value: string;
  onChange: (now: string) => void;
  onBlur?: (value: boolean) => void;
  onFocus?: (value: boolean) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSearch?: (now?: string) => void;
  placeholder?: string;
}> = ({ className, value, onChange, onBlur, onFocus, placeholder, onSearch, onKeyDown }) => {
  const [focused, setFocused] = useState(false);

  return (
    <Wrapper tabIndex={1} className={className} focused={focused}>
      <img src={SearchSvg} alt="" onClick={() => onSearch(value)} />
      <Input
        placeholder={placeholder}
        onFocus={() => {
          setFocused(true);
          if (onFocus) {
            onFocus(true);
          }
        }}
        onBlur={() => {
          setFocused(false);
          if (onBlur) {
            onBlur(false);
          }
        }}
        onKeyDown={onKeyDown}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Wrapper>
  );
};

export default Search;
