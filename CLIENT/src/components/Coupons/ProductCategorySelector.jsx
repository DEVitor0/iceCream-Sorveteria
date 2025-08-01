import { useState } from 'react';
import { Box, Typography, Chip, Autocomplete, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const ProductCategorySelector = ({
  type = 'products',
  allItems = [],
  selectedItems = [],
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event, newValue) => {
    if (typeof onChange === 'function') {
      onChange(newValue || []);
    }
  };

  const getOptionLabel = (option) => {
    if (!option) return '';
    return (
      option.name || option.title || option.label || String(option.id || '')
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {type === 'products' ? 'Produtos aplicáveis' : 'Categorias aplicáveis'}
      </Typography>

      <Autocomplete
        multiple
        options={Array.isArray(allItems) ? allItems : []}
        getOptionLabel={getOptionLabel}
        value={Array.isArray(selectedItems) ? selectedItems : []}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              type === 'products'
                ? 'Selecione produtos'
                : 'Selecione categorias'
            }
            placeholder={
              type === 'products'
                ? 'Digite para buscar produtos'
                : 'Digite para buscar categorias'
            }
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={getOptionLabel(option)}
              {...getTagProps({ index })}
              key={option?.id || index}
            />
          ))
        }
        isOptionEqualToValue={(option, value) =>
          option?.id === value?.id || option === value
        }
      />
    </Box>
  );
};

ProductCategorySelector.propTypes = {
  type: PropTypes.oneOf(['products', 'categories']),
  allItems: PropTypes.array,
  selectedItems: PropTypes.array,
  onChange: PropTypes.func,
};

export default ProductCategorySelector;
