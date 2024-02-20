interface ContainerProps {
  children?: React.ReactNode;
}

export function ContainerDashboard({ children }: ContainerProps) {
  return <div className="max-w-5xl mx-auto">{children}</div>;
}
