import { Box, BoxProps } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type RadioButtonGroupProps<FormValues extends FieldValues> = {
  control: Control<FormValues>;
  name: Path<FormValues>;
  label: string;
  options: Option[];
  defaultValue?: PathValue<FormValues, Path<FormValues>>;
  disabled?: boolean;
} & BoxProps;

const RadioButtonGroup = <FormValues extends FieldValues = FieldValues>({
  name,
  label,
  options,
  control,
  defaultValue,
  disabled,
  ...boxProps
}: RadioButtonGroupProps<FormValues>) => {
  return (
    <Box {...boxProps}>
      <FormControl disabled={disabled}>
        <FormLabel id={`${name}-label`}>{label}</FormLabel>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <RadioGroup row aria-labelledby={`${name}-label`} {...field}>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))}
            </RadioGroup>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default RadioButtonGroup;
