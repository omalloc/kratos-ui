import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => {
  return {
    serviceRow: css`
      .ant-table-wrapper
        .ant-table.ant-table-small
        .ant-table-tbody
        .ant-table-wrapper:only-child
        .ant-table {
        margin-inline: 0;
      }
      .ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody > tr > td {
        padding: 8px 0;
      }
      .ant-table-wrapper .ant-table-expanded-row:hover > td {
        background: ${token.colorPrimaryBgHover};
      }
      .ant-table-expanded-row .ant-table-cell {
        background: ${token.colorPrimaryBg};

        .ant-table {
          background: ${token.colorPrimaryBg};

          .ant-table-cell.ant-table-cell-row-hover {
            background: ${token.colorPrimaryBgHover};
          }
        }
      }
    `,
  };
});
