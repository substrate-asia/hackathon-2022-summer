import styled from 'styled-components';

const IconAddStyled = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  z-index: 2;
`;
const IconAdd = () => {
  return (
    <IconAddStyled>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <g transform="translate(2 2)" fill="none" fillRule="evenodd">
          <rect stroke="#25234C" strokeWidth="2" fill="#201F43" x="-1" y="-1" width="30" height="30" rx="8" />
          <path
            d="M14.5,7 C15.3284271,7 16,7.67157288 16,8.5 L16,13 L20.5,13 C21.3284271,13 22,13.6715729 22,14.5 C22,15.3284271 21.3284271,16 20.5,16 L16,16 L16,20.5 C16,21.3284271 15.3284271,22 14.5,22 C13.6715729,22 13,21.3284271 13,20.5 L13,16 L8.5,16 C7.67157288,16 7,15.3284271 7,14.5 C7,13.6715729 7.67157288,13 8.5,13 L13,13 L13,8.5 C13,7.67157288 13.6715729,7 14.5,7 Z"
            fill="#FFF"
          />
        </g>
      </svg>
    </IconAddStyled>
  );
};
export default IconAdd;
