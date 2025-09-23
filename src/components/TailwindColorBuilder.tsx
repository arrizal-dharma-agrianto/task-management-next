const tailwindColors = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose'
];
const steps = [100, 200, 300];

export default function TailwindColorBuilder() {
  return (
    <div className="hidden">
      {tailwindColors.flatMap(color =>
        steps.map(step => (
          <div key={`${color}-${step}`} className={`bg-${color}-${step} text-${color}-${step} border-${color}-${step}`}></div>
        ))
      )}
    </div>
  );
}
