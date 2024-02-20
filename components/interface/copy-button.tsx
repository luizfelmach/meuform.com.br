import CopyToClipboard from "react-copy-to-clipboard";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface CopyButtonProps {
  children?: React.ReactNode;
  link: string;
}

export function CopyButton({ children, link }: CopyButtonProps) {
  return (
    <CopyToClipboard text={link}>
      <Button
        type="submit"
        variant={"ghost"}
        size={"icon"}
        onClick={() => toast.info("Link copiado para a área de transferência.")}
      >
        {children}
      </Button>
    </CopyToClipboard>
  );
}
