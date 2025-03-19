import { createStyles } from 'antd-style';

export const useResultStyles = createStyles(({ token, css }) => {
  return {
    reset: css`
      list-style: none;
      padding-left: 0;
    `,
    mr3: css`
      margin-top: 1rem;
      margin-bottom: 1rem;
    `,
  };
});

export const useStyles = createStyles(({ token, css }) => {
  return {
    resultItem: css`
      border: 1px solid ${token.colorBorderSecondary};
      background: ${token.colorBgContainer};

      &:hover {
        background: ${token.colorBgTextHover};
        border-color: #d8d8d8;
      }
    `,

    p2: css`
      padding: 0.5rem;
    `,
    p3: css`
      padding: 1rem;
    `,

    serviceTag: css`
      border-left-color: ${token.blue};
      border-left-width: 15px;
      align-items: center;
    `,

    errorIcon: css`
      background: #db2828;
      border-radius: 6.5px;
      color: #fff;
      font-size: 0.85em;
      margin-right: 0.25rem;
      padding: 1px;
    `,
  };
});

export const useItemStyles = createStyles(({ css, token }) => ({
  container: css`
    background: ${token.colorBgContainer};
    border-bottom: 1px solid ${token.colorBorderSecondary};
    display: flex;
  `,

  item: css`
    color: inherit;
    padding: 0.5rem;
    position: relative;

    &:first-child {
      border-right: 1px solid ${token.colorBorder};
    }

    &:hover {
      background: ${token.colorInfoBg};
      border-color: ${token.colorBorder};
    }
  `,

  itemFlex: css`
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
  `,

  itemNone: css`
    flex: none;
  `,

  duration: css`
    position: relative;
    float: right;
  `,

  title: css`
    margin: 0;
    position: relative;

    &.is-error {
      color: ${token.colorError};
    }
  `,

  idExcerpt: css`
    color: ${token.colorTextSecondary};
    font-weight: normal;
    padding-left: ${token.padding}px;
  `,

  durationBar: css`
    background: ${token.colorBgLayout};
    bottom: 0;
    left: 0;
    position: absolute;
    top: 0;

    ${'.item'}:hover & {
      background: ${token.colorBgTextActive};
    }
  `,
}));
