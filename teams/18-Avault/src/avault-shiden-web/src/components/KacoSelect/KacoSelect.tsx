import React, { useState, useRef, useEffect } from 'react';
import styled, { css, CSSProperties } from 'styled-components';
import { ArrowDropDownIcon, Text } from '@my/ui';

const DropDownHeader = styled.div`
  width: 100%;
  height: 48px;
  padding: 0px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: ${({ theme }) => theme.colors.cardBackground};
  border: 2px solid #1476ff;
  border-radius: 12px;
`;

const DropDownListContainer = styled.div`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  top: 64px;
  background: ${({ theme }) => theme.colors.secondary};
  border: 2px solid #1476ff;
  box-shadow: 0px 8px 13px 3px rgba(9, 2, 18, 0.2);
  border-radius: 12px;
`;

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: ${({ width }) => width}px;
  position: relative;
  border-radius: 16px;
  height: 48px;
  min-width: 136px;
  user-select: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const DropDownList = styled.ul`
  padding: 16px 4px;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  flex: 1;
`;

const ListItem = styled.li`
  list-style: none;
  > div {
    font-size: 14px;
    color: #9da6a6;
  }
  padding: 12px 16px;
  &:hover {
    > div {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export interface SelectProps {
  style?: CSSProperties;
  options: OptionProps[];
  onChange?: (option: OptionProps) => void;
}

export interface OptionProps {
  label: string;
  value: any;
}

const AvaultSelect: React.FunctionComponent<SelectProps> = ({ options, onChange, style }) => {
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen);
    event.stopPropagation();
  };

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex);
    setIsOpen(false);

    if (onChange) {
      onChange(options[selectedIndex]);
    }
  };

  useEffect(() => {
    setContainerSize({
      width: dropdownRef.current.offsetWidth, // Consider border
      height: dropdownRef.current.offsetHeight,
    });

    const handleClickOutside = () => {
      setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <DropDownContainer style={style} isOpen={isOpen} ref={containerRef} {...containerSize}>
      {containerSize.width !== 0 && (
        <DropDownHeader onClick={toggling}>
          <Text fontSize="14px" color="primary">
            {options[selectedOptionIndex].label}
          </Text>
          <ArrowDropDownIcon style={{ position: 'static', transform: 'none' }} color="text" onClick={toggling} />
        </DropDownHeader>
      )}
      <DropDownListContainer>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                <Text>{option.label}</Text>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  );
};

export default AvaultSelect;
