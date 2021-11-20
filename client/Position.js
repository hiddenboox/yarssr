import styled from '@emotion/styled';

export const Position = styled.div`
  position: ${({ type }) => type};
  top: ${({ top }) => top ? `${top}px` : null};
  left: ${({ left }) => left ? `${left}px` : null};
  right: ${({ right }) => right ? `${right}px` : null};
`
  
export const Fixed = ({ children, ...props }) => {
    return <Position type="fixed" {...props}>{children}</Position>
}