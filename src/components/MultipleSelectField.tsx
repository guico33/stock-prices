import Box, { BoxProps } from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';

type Option = {
  label: string;
  value: string | number;
  color?: string;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type MultipleSelectFieldProps<FormValues extends FieldValues> = {
  control: Control<FormValues>;
  name: Path<FormValues>;
  label: string;
  options: Option[];
  defaultValue?: PathValue<FormValues, Path<FormValues>>;
  disabled?: boolean;
} & BoxProps;

const MultipleSelectField = <FormValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  options,
  defaultValue,
  disabled,
  ...boxProps
}: MultipleSelectFieldProps<FormValues>) => {
  const theme = useTheme();

  const colorsMap = options.reduce((acc, option) => {
    acc[option.value] = option.color;
    return acc;
  }, {} as Record<string, string | undefined>);

  return (
    <Box {...boxProps}>
      <FormControl sx={{ width: 300 }} disabled={disabled}>
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Controller
          name={name}
          defaultValue={defaultValue}
          control={control}
          render={({ field }) => (
            <Select
              labelId={`${name}-label`}
              id={`${name}-select`}
              multiple
              value={field.value}
              disabled={disabled}
              onChange={(event) => {
                if ((event.target.value as string[]).length > 0) {
                  field.onChange(event);
                }
              }}
              input={<OutlinedInput id={`${name}-chip`} label={label} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      sx={{
                        background: colorsMap[value],
                        color: colorsMap[value] ? 'white' : undefined,
                      }}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  disabled={field.value.length >= 3 && !field.value.includes(option.value)}
                  style={{
                    fontWeight:
                      field.value.indexOf(option.value) === -1
                        ? theme.typography.fontWeightRegular
                        : theme.typography.fontWeightMedium,
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default MultipleSelectField;
