export const tailwindColors = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

export const colorClassMap = tailwindColors.reduce((acc, color) => {
  acc[color] = `bg-${color}-300`;
  return acc;
}, {} as Record<string, string>);
