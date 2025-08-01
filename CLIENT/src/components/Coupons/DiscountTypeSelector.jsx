import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const DiscountTypeSelector = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Tipo de Desconto</InputLabel>
      <Select
        value={value}
        label="Tipo de Desconto"
        name="discountType"
        onChange={onChange}
        required
      >
        <MenuItem value="percentage">Porcentagem (%)</MenuItem>
        <MenuItem value="fixed">Valor Fixo (R$)</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DiscountTypeSelector;
