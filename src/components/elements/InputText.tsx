import { TextField } from "@mui/material";

type InputTextProps = {
  label: string;
  input: any;
  messageError: string;
  type?: "text" | "number" | "password";
};

export function InputText({
  label,
  input,
  messageError,
  type = "text",
}: InputTextProps) {
  return (
    <TextField
      error={!!messageError}
      label={label}
      variant="standard"
      helperText={messageError}
      type={type}
      {...input}
    />
  );
}
