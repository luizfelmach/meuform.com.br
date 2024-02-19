import { Container } from "./container";
import { Header } from "./header";

interface DashboardLayoutRootProps {
  children?: React.ReactNode;
}

function DashboardLayoutRoot({ children }: DashboardLayoutRootProps) {
  return <Container className="max-w-5xl">{children}</Container>;
}

interface DashboardLayoutContentProps {
  children?: React.ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutContentProps) {
  return <div>{children}</div>;
}

export const DashboardLayout = {
  Root: DashboardLayoutRoot,
  Header: Header.Root,
  Title: Header.Title,
  Description: Header.Description,
  Content: DashboardLayoutContent,
};
