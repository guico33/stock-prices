import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
};

type SelectFieldProps<FormValues extends FieldValues> = {
  control: Control<FormValues>;
  name: Path<FormValues>;
  label: string;
  options: Option[];
  disabled?: boolean;
};

const SelectField = <FormValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  disabled,
  options,
}: SelectFieldProps<FormValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl sx={{ width: 300 }} disabled={disabled}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select labelId={`${name}-label`} id={name} label={label} {...field}>
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default SelectField;
