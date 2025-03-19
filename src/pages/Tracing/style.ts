import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => {
  return {
    searchTracePageRow: css`
      display: flex;
      flex-grow: 1;
    `,
    searchTracePageColumn: css`
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 1rem 0.5rem;
      &:first-child {
        padding-left: 1rem;
      }
      :last-child {
        padding-right: 1rem;
      }
    `,
    searchTracePageFind: css`
      background-color: ${token.colorPrimaryBg}
      border: ${token.lineWidth} ${token.lineType} ${token.colorBorder};
      padding: 1rem;
    `,
    searchTracePageLogo: css`
      display: block;
      margin: 13rem auto 0 auto;
    `,
  };
});
