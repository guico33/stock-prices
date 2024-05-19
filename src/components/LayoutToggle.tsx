import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';

import { Layout } from '../types/ui';

type LayoutToggleProps = {
  layout: Layout;
  setLayout: (layout: Layout) => void;
} & ToggleButtonGroupProps;

const LayoutToggle = ({ layout, setLayout, ...buttonGroupProps }: LayoutToggleProps) => {
  const handleChangeLayout = (_: React.MouseEvent<HTMLElement>, newLayout: Layout) => {
    setLayout(newLayout);
  };

  return (
    <ToggleButtonGroup
      value={layout}
      exclusive
      onChange={handleChangeLayout}
      aria-label="layout toggle"
      {...buttonGroupProps}
    >
      <ToggleButton value="compact" aria-label="compact layout" disabled={layout === 'compact'}>
        <HorizontalSplitIcon />
      </ToggleButton>
      <ToggleButton value="full" aria-label="full layout" disabled={layout === 'full'}>
        <SpaceDashboardIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LayoutToggle;
