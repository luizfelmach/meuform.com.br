import { useFormContext } from "react-hook-form";
import { useEditor } from "../hooks/use-editor";
import { ReplyBox } from "@/components/interface/reply-box";
import { InputInline } from "@/components/interface/input-inline";
import { FormType } from "@/form/types";

export function EditableHeaderForm() {
  const { screenForm } = useEditor();
  const { getValues, setValue } = useFormContext<FormType>();
  const titleForm = (screenForm + ".title") as any;
  const descriptionForm = (screenForm + ".description") as any;

  return (
    <>
      <ReplyBox.Title>
        <InputInline
          preventEnter
          value={getValues(titleForm)}
          className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl border-none focus:border-none resize-none"
          onBlur={(e) => {
            setValue(titleForm, e.currentTarget.innerText);
          }}
        />
      </ReplyBox.Title>
      <ReplyBox.Description>
        <InputInline
          preventEnter
          value={getValues(descriptionForm)}
          className="text-xl font-normal tracking-tight first:mt-0 border-none focus:border-none resize-none overflow-hidden h-auto"
          onBlur={(e) => {
            setValue(descriptionForm, e.currentTarget.innerText);
          }}
        />
      </ReplyBox.Description>
    </>
  );
}
