interface AsideEditorRootProps {
  children?: React.ReactNode;
}

function AsideEditorRoot({ children }: AsideEditorRootProps) {
  return <div className="my-4 flex flex-col gap-8">{children}</div>;
}

interface AsideEditorSectionProps {
  children?: React.ReactNode;
}

function AsideEditorSection({ children }: AsideEditorSectionProps) {
  return <div className="space-y-2">{children}</div>;
}

interface AsideEditorHeaderProps {
  children?: React.ReactNode;
}

function AsideEditorHeader({ children }: AsideEditorHeaderProps) {
  return (
    <header className="flex justify-between items-center">{children}</header>
  );
}

interface AsideEditorTitleProps {
  children?: React.ReactNode;
}

function AsideEditorTitle({ children }: AsideEditorTitleProps) {
  return (
    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h1>
  );
}

interface AsideEditorContentProps {
  children?: React.ReactNode;
}

function AsideEditorContent({ children }: AsideEditorContentProps) {
  return <div className="space-y-2">{children}</div>;
}

export const AsideEditor = {
  Root: AsideEditorRoot,
  Section: AsideEditorSection,
  Header: AsideEditorHeader,
  Title: AsideEditorTitle,
  Content: AsideEditorContent,
};
