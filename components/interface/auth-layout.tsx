import { useFormContext } from "react-hook-form";
import { Header } from "./header";
import { LogoFull } from "./logo";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useNavigation } from "@remix-run/react";

interface AuthLayoutRootProps {
  children?: React.ReactNode;
}

function AuthLayoutRoot({ children }: AuthLayoutRootProps) {
  return (
    <div className="h-screen items-center w-screen grid md:grid-cols-2">
      {children}
    </div>
  );
}

interface AuthLayoutAsideProps {
  children?: React.ReactNode;
}

function AuthLayoutAside({ children }: AuthLayoutAsideProps) {
  return (
    <aside className="bg-primary m-2 rounded-xl overflow-hidden hidden md:block h-[calc(100vh_-_1rem)]">
      {children}
    </aside>
  );
}

interface AuthLayoutMainProps {
  children?: React.ReactNode;
}

function AuthLayoutMain({ children }: AuthLayoutMainProps) {
  return (
    <div className="flex justify-center mx-4">
      <aside className="h-[calc(100vh_-_1rem)] m-2 w-full max-w-md flex flex-col items-center justify-center">
        {children}
      </aside>
    </div>
  );
}

function AuthLayoutBanner() {
  return (
    <div className="flex flex-col items-center h-full justify-center">
      <Header.Root className="m-16 text-primary-foreground">
        <Header.Title>Crie formulários para conhecer seu público!</Header.Title>
      </Header.Root>
      <img
        alt="Preview de um formulário gerado no Meu Form."
        src={"/auth-banner.svg"}
        width={700}
        height={200}
        className="mx-auto hover:-translate-y-3 transition duration-300"
      />
    </div>
  );
}

function AuthLayoutLogoFull() {
  return (
    <div>
      <LogoFull size={150} />
    </div>
  );
}

interface AuthLayoutInputTextProps {
  type?: string;
  placeholder: string;
  name: string;
}

function AuthLayoutInputText({
  type = "text",
  placeholder,
  name,
}: AuthLayoutInputTextProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className="bg-accent border-none h-12"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface AuthLayoutSendButton {
  isSubmitting?: boolean;
  label: string;
}

function AuthLayoutSendButton({ label }: AuthLayoutSendButton) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Button
      type="submit"
      className="w-full h-10 font-bold "
      disabled={isSubmitting}
      variant={"default"}
    >
      {label}
      {isSubmitting && <Loader className="animate-spin" />}
    </Button>
  );
}

export const AuthLayout = {
  Root: AuthLayoutRoot,
  Aside: AuthLayoutAside,
  Main: AuthLayoutMain,
  Banner: AuthLayoutBanner,
  LogoFull: AuthLayoutLogoFull,
  Header: Header.Root,
  Title: Header.Title,
  Description: Header.Description,
  InputText: AuthLayoutInputText,
  SendButton: AuthLayoutSendButton,
};
