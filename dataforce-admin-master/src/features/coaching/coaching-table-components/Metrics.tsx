import { Chip, Typography } from '@mui/material';
import { Tier } from 'src/models/Performance';
import { hexToRgb, rgbToRgbaString } from 'src/utils/hexToRgb';

export const metricColors = {
  [Tier[Tier.Fantastic]]: '#0b5394',
  [Tier[Tier['Fantastic Plus']]]: '#0b5394',
  [Tier[Tier.Great]]: '#6aa84f',
  [Tier[Tier.Fair]]: '#f1c232',
  [Tier[Tier.Poor]]: '#cc0000',
};

type MetricType =
  | 'ad'
  | 'cc'
  | 'cc_ops'
  | 'cdf'
  | 'ced'
  | 'dcr'
  | 'dnr'
  | 'fico_score'
  | 'dsb'
  | 'pod'
  | 'seatbelt_off_rate'
  | 'speeding_event_ratio'
  | 'distraction_rate'
  | 'following_distance_rate'
  | 'signal_violations_rate'
  | 'dsb_dnr'
  | 'swc_ad'
  | 'cc_o';

export const getMetricLevel = (type: MetricType, value: string | null | number) => {
  if (value === 'Coming Soon') {
    return 'Coming Soon';
  }
  if (value === null) {
    return undefined;
  }
  if (typeof value === 'string') {
    value = parseFloat(value.replace('%', ''));
  }
  if (type === 'ad') {
    return value === 0 ? Tier[Tier.Poor] : Tier[Tier.Fantastic];
  }
  if (type === 'cc') {
    if (value >= 99.5) {
      return Tier[Tier.Fantastic];
    }
    if (value > 97) {
      return Tier[Tier.Great];
    }
    if (value > 93) {
      return Tier[Tier.Fair];
    }
    return Tier[Tier.Poor];
  }
  if (type === 'cc_ops') {
    return value < 100 ? Tier[Tier.Poor] : Tier[Tier.Fantastic];
  }
  if (type === 'cdf') {
    if (value > 96) {
      return Tier[Tier.Fantastic];
    }
    if (value > 93) {
      return Tier[Tier.Great];
    }
    if (value > 90) {
      return Tier[Tier.Fair];
    }
    return Tier[Tier.Poor];
  }
  if (type === 'ced') {
    return value === 0 ? Tier[Tier.Poor] : Tier[Tier.Fantastic];
  }
  if (type === 'dcr') {
    if (value >= 99.4) {
      return Tier[Tier.Fantastic];
    }
    if (value >= 99) {
      return Tier[Tier.Great];
    }
    if (value > 98.4) {
      return Tier[Tier.Fair];
    }
    return Tier[Tier.Poor];
  }
  if (type === 'dnr' || type === 'dsb_dnr') {
    return value >= 1 ? Tier[Tier.Poor] : Tier[Tier.Fantastic];
  }
  if (type === 'fico_score') {
    if (value > 800) {
      return Tier[Tier.Fantastic];
    }
    if (value > 740) {
      return Tier[Tier.Great];
    }
    if (value > 700) {
      return Tier[Tier.Fair];
    }
    return Tier[Tier.Poor];
  }
  if (type === 'dsb') {
    if (value <= 200) {
      return Tier[Tier.Fantastic];
    }
    if (value <= 500) {
      return Tier[Tier.Great];
    }
    if (value <= 800) {
      return Tier[Tier.Fair];
    }
    return Tier[Tier.Poor];
  }
  if (type === 'pod') {
    if (value > 98) {
      return Tier[Tier.Fantastic];
    }
    if (value >= 97) {
      return Tier[Tier.Great];
    }
    if (value > 96) {
      return Tier[Tier.Fair];
    }
    return Tier[Tier.Poor];
  }

  if (
    type === 'seatbelt_off_rate' ||
    type === 'speeding_event_ratio' ||
    type === 'distraction_rate' ||
    type === 'following_distance_rate' ||
    type === 'signal_violations_rate'
  ) {
    if (value <= 0.49) {
      return Tier.Fantastic;
    }

    if (value <= 0.99) {
      return Tier.Great;
    }
    if (value <= 1.4) {
      return Tier.Fair;
    }
    return Tier.Poor;
  }

  return undefined;
};

const parse = (value: string | null | number) => {
  if (value === 'Coming Soon') {
    return 'Coming Soon';
  }
  if (typeof value === 'string') {
    return parseFloat(value.replace('%', ''));
  }
  return value;
};

const getColor = (value: string | null | number, cb: (value: number) => string) => {
  const parsed = parse(value);
  if (parsed === 'Coming Soon' || parsed === null) {
    return undefined;
  }
  return cb(parsed);
};

type MetricProps = { value: string | null | number };

export const AdMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) =>
    x >= 1 ? metricColors[Tier.Poor] : metricColors[Tier.Fantastic]
  );

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const CcMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) => {
    if (x >= 99.5) {
      return metricColors[Tier.Fantastic];
    }
    if (x > 97) {
      return metricColors[Tier.Great];
    }
    if (x > 93) {
      return metricColors[Tier.Fair];
    }
    return metricColors[Tier.Poor];
  });

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const CcOpsMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) => 'black');

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const CdfMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) => {
    if (x > 96) {
      return metricColors[Tier.Fantastic];
    }
    if (x > 93) {
      return metricColors[Tier.Great];
    }
    if (x > 90) {
      return metricColors[Tier.Fair];
    }
    return metricColors[Tier.Poor];
  });

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const CedMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) =>
    x >= 1 ? metricColors[Tier.Poor] : metricColors[Tier.Fantastic]
  );

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const DcrMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) => {
    if (x >= 99.4) {
      return metricColors[Tier.Fantastic];
    }
    if (x >= 99) {
      return metricColors[Tier.Great];
    }
    if (x > 98.4) {
      return metricColors[Tier.Fair];
    }
    return metricColors[Tier.Poor];
  });

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const DnrMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) =>
    x >= 1 ? metricColors[Tier.Poor] : metricColors[Tier.Fantastic]
  );

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const FicoScoreMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) => {
    if (x > 800) {
      return metricColors[Tier.Fantastic];
    }
    if (x > 740) {
      return metricColors[Tier.Great];
    }
    if (x > 700) {
      return metricColors[Tier.Fair];
    }
    return metricColors[Tier.Poor];
  });

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const DSBMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) => {
    if (x <= 200) {
      return metricColors[Tier.Fantastic];
    }
    if (x <= 500) {
      return metricColors[Tier.Great];
    }
    if (x <= 800) {
      return metricColors[Tier.Fair];
    }
    return metricColors[Tier.Poor];
  });

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const PodMetric = ({ value }: MetricProps) => {
  let color = getColor(value, (x) => {
    if (x > 98) {
      return metricColors[Tier.Fantastic];
    }
    if (x >= 97) {
      return metricColors[Tier.Great];
    }
    if (x > 96) {
      return metricColors[Tier.Fair];
    }
    return metricColors[Tier.Poor];
  });

  return (
    <Typography variant="body2" color={color}>
      {value}
    </Typography>
  );
};

export const TierMetric = ({ value }: { value: Tier }) => {
  const color = metricColors[value] ? metricColors[value] : 'black';
  return (
    <Chip
      sx={{
        backgroundColor: rgbToRgbaString(hexToRgb(color), 0.2),
        color,
        fontWeight: 'bold',
        borderRadius: '6px',
      }}
      label={value}
    />
  );
};
