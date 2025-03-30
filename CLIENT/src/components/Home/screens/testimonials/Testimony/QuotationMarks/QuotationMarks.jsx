import React from 'react';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import Styles from './QuotationMarks.module.scss';

interface QuotationMarksProps {
  flipped?: boolean;
}

const QuotationMarks: React.FC<QuotationMarksProps> = ({ flipped = false }) => {
  return (
    <div
      className={`${Styles.quotationMarks} ${
        flipped ? Styles.quotationMarks__flipped : ''
      }`}
    >
      <FormatQuoteIcon />
    </div>
  );
};

export default QuotationMarks;
