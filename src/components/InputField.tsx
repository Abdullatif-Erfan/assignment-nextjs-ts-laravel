import React, { InputHTMLAttributes } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export const InputField: React.FC<InputFieldProps> = ({ label, name }) => {
  return (
    <FormControl>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input id={name} placeholder="" />
    </FormControl>
  );
};
