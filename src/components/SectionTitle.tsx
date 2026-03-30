interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => (
  <div className="text-center mb-12">
    <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider text-foreground text-glow-blue">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
    )}
    <div className="neon-line mt-6 max-w-xs mx-auto" />
  </div>
);

export default SectionTitle;
