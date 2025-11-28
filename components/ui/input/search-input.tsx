"use client";

import { forwardRef } from "react";
import Input, { InputProps } from "./index";
import { Search } from "lucide-react";

const SearchInput = forwardRef<HTMLInputElement, Omit<InputProps, "leftIcon">>(
  (props, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder="Search"
        leftIcon={<Search className="w-5 h-5" />}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
