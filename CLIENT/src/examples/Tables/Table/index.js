import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// @mui material components
import { Table as MuiTable } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Icon from '@mui/material/Icon';

// Soft UI Dashboard React components
import SoftBox from '../../../components/Dashboard/SoftBox';
import SoftAvatar from '../../../components/Dashboard/SoftAvatar';
import SoftTypography from '../../../components/Dashboard/SoftTypography';

// Soft UI Dashboard React base styles
import colors from '../../../media/theme/base/colors';
import typography from '../../../media/theme/base/typography';
import borders from '../../../media/theme/base/borders';
import { styled } from '@mui/material/styles';

// Componente estilizado para células
const StyledTableCell = styled(SoftBox)(
  ({ theme, align, isheader, isfirst, islast }) => ({
    component: isheader ? 'th' : 'td',
    padding: isheader ? '16px 24px' : '14px 24px',
    textAlign: align,
    borderBottom: isheader
      ? 'none'
      : `1px solid ${
          theme.palette.mode === 'light'
            ? 'rgba(0, 0, 0, 0.05)'
            : 'rgba(255, 255, 255, 0.05)'
        }`,
    transition: 'all 0.3s ease',
    pl: align === 'left' ? (isfirst ? '24px' : '16px') : '16px',
    pr: align === 'right' ? (islast ? '24px' : '16px') : '16px',
    ...(isheader && {
      backgroundColor:
        theme.palette.mode === 'light'
          ? 'rgba(93, 80, 158, 0.03)'
          : 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(4px)',
      position: 'sticky',
      top: 0,
      zIndex: 2,
    }),
  }),
);

// Componente estilizado para linhas
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'rgba(93, 80, 158, 0.02)'
        : 'rgba(255, 255, 255, 0.02)',
  },
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'rgba(93, 80, 158, 0.05)'
        : 'rgba(255, 255, 255, 0.05)',
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[1],
    '& td': {
      fontWeight: '600 !important',
      color: `${theme.palette.secondary.main} !important`,
    },
  },
  transition: 'all 0.3s ease',
}));

// Ícones para tipos de dados
const DataTypeIcon = ({ type, value }) => {
  const icons = {
    string: (
      <Icon sx={{ fontSize: '1rem', mr: 1, opacity: 0.7 }}>short_text</Icon>
    ),
    number: <Icon sx={{ fontSize: '1rem', mr: 1, opacity: 0.7 }}>numbers</Icon>,
    date: <Icon sx={{ fontSize: '1rem', mr: 1, opacity: 0.7 }}>event</Icon>,
    boolean: (
      <Icon sx={{ fontSize: '1rem', mr: 1, opacity: 0.7 }}>
        {value ? 'check' : 'close'}
      </Icon>
    ),
    default: (
      <Icon sx={{ fontSize: '1rem', mr: 1, opacity: 0.7 }}>data_object</Icon>
    ),
  };

  return icons[type] || icons.default;
};

function Table({ columns = [], rows = [] }) {
  const { size, fontWeightBold, fontWeightRegular } = typography;

  const detectDataType = (value) => {
    if (value === null || value === undefined) return 'default';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (!isNaN(value) && value !== '') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Date.parse(value)) return 'date';
    return 'string';
  };

  const renderColumns = useMemo(
    () =>
      columns.map(({ name, align, width, icon }, key) => {
        const isFirst = key === 0;
        const isLast = key === columns.length - 1;

        return (
          <StyledTableCell
            key={`col-${name}-${key}`}
            align={align}
            width={width || 'auto'}
            isheader="true"
            isfirst={isFirst}
            islast={isLast}
          >
            <SoftBox display="flex" alignItems="center">
              {icon && (
                <Icon sx={{ fontSize: '1rem', mr: 1, opacity: 0.8 }}>
                  {icon}
                </Icon>
              )}
              <SoftTypography
                variant="caption"
                fontWeight={fontWeightBold}
                color="secondary"
                sx={{
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: size.xxs,
                }}
              >
                {name}
              </SoftTypography>
            </SoftBox>
          </StyledTableCell>
        );
      }),
    [columns, size.xxs, fontWeightBold],
  );

  const renderRows = useMemo(
    () =>
      rows.map((row, rowIndex) => {
        const rowKey = row.id || `row-${rowIndex}`;

        return (
          <StyledTableRow key={rowKey}>
            {columns.map(({ name, align }) => {
              const cellValue = row[name];
              const cellKey = `${rowKey}-${name}`;
              const dataType = detectDataType(cellValue);

              if (Array.isArray(cellValue)) {
                return (
                  <StyledTableCell key={cellKey} align={align} component="td">
                    <SoftBox display="flex" alignItems="center">
                      {cellValue[0] && (
                        <SoftBox mr={2}>
                          <SoftAvatar
                            src={cellValue[0]}
                            name={cellValue[1] || ''}
                            variant="rounded"
                            size="sm"
                            sx={{
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              border: '1px solid rgba(0,0,0,0.05)',
                            }}
                          />
                        </SoftBox>
                      )}
                      <SoftTypography
                        variant="button"
                        fontWeight="medium"
                        sx={{ width: 'max-content' }}
                      >
                        {cellValue[1] || ''}
                      </SoftTypography>
                    </SoftBox>
                  </StyledTableCell>
                );
              }

              if (typeof cellValue === 'object' && cellValue !== null) {
                return (
                  <StyledTableCell key={cellKey} align={align} component="td">
                    <SoftBox display="flex" alignItems="center">
                      {cellValue.icon && (
                        <Icon
                          sx={{
                            fontSize: '1rem',
                            mr: 1,
                            color: cellValue.color || 'inherit',
                            opacity: 0.8,
                          }}
                        >
                          {cellValue.icon}
                        </Icon>
                      )}
                      <SoftTypography
                        variant="button"
                        fontWeight={cellValue.fontWeight || 'regular'}
                        color={cellValue.color || 'secondary'}
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          width: 'max-content',
                          ...cellValue.sx,
                        }}
                      >
                        {cellValue.value || ''}
                      </SoftTypography>
                    </SoftBox>
                  </StyledTableCell>
                );
              }

              return (
                <StyledTableCell key={cellKey} align={align} component="td">
                  <SoftBox display="flex" alignItems="center">
                    <DataTypeIcon type={dataType} value={cellValue} />
                    <SoftTypography
                      variant="button"
                      fontWeight={fontWeightRegular}
                      color="secondary"
                      sx={{
                        display: 'inline-block',
                        width: 'max-content',
                        fontFamily:
                          dataType === 'number'
                            ? '"Roboto Mono", monospace'
                            : 'inherit',
                      }}
                    >
                      {cellValue != null ? String(cellValue) : '-'}
                    </SoftTypography>
                  </SoftBox>
                </StyledTableCell>
              );
            })}
          </StyledTableRow>
        );
      }),
    [rows, columns, fontWeightRegular],
  );

  return (
    <TableContainer
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0 8px 32px rgba(93, 80, 158, 0.05)',
        maxHeight: 'calc(100vh - 200px)',
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(93, 80, 158, 0.2)',
          borderRadius: '3px',
        },
      }}
    >
      <MuiTable stickyHeader sx={{ minWidth: '100%' }}>
        <SoftBox component="thead" sx={{ display: 'table-header-group' }}>
          <TableRow>{renderColumns}</TableRow>
        </SoftBox>
        <TableBody>{renderRows}</TableBody>
      </MuiTable>
    </TableContainer>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.string,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      hasBorder: PropTypes.bool,
    }),
  ).isRequired,
};

export default Table;
