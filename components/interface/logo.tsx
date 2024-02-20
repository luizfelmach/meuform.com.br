import { HTMLAttributes } from "react";
import { useNavigate } from "@remix-run/react";

interface LogoFullProps
  extends Omit<HTMLAttributes<HTMLImageElement>, "alt" | "src"> {
  size?: number;
  href?: string;
}

export function LogoFull({ size = 70, href, ...props }: LogoFullProps) {
  const navigate = useNavigate();
  return (
    <img
      {...props}
      alt="Meu Form Logo"
      width={size}
      height={size}
      src={"/logo-brand.svg"}
      className="cursor-pointer"
      onClick={() => href && navigate(href)}
    />
  );
}

interface LogoProps
  extends Omit<HTMLAttributes<HTMLImageElement>, "alt" | "src"> {
  size?: number;
  href?: string;
}

export function Logo({ size = 70, href, ...props }: LogoProps) {
  const navigate = useNavigate();
  return (
    <img
      {...props}
      alt="Meu Form Logo"
      width={size}
      height={size}
      src={"/logo.svg"}
      className="cursor-pointer"
      onClick={() => href && navigate(href)}
    />
  );
}
