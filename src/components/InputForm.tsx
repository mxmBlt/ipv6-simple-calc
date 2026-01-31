import { useState } from "react";
import type { IPv6Input } from "../utils/ipv6";

interface InputFormProps {
  onInputChange: (input: IPv6Input) => void;
}

export function InputForm({ onInputChange }: InputFormProps) {
  const [input, setInput] = useState<IPv6Input>({
    address: "2001:db8::",
    prefix: 64,
    subnetsPrefix: 65,
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInput = { ...input, address: e.target.value };
    setInput(updatedInput);
    onInputChange(updatedInput);
  };

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prefixValue = parseInt(e.target.value) || 0;
    const updatedInput = { ...input, prefix: prefixValue };
    setInput(updatedInput);
    onInputChange(updatedInput);
  };

  const handleSubnetsPrefixChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    const updatedInput = {
      ...input,
      subnetsPrefix: value ? parseInt(value) : undefined,
    };
    setInput(updatedInput);
    onInputChange(updatedInput);
  };

  return (
    <div className="input-form-container">
      <h2 className="input-form-title">IPv6 Calculator Input</h2>
      <div className="input-form-group">
        <label className="input-form-label">
          IPv6 Address:
          <input
            type="text"
            className="input-form-input"
            value={input.address}
            onChange={handleAddressChange}
            placeholder="e.g., 2001:db8::"
          />
        </label>
      </div>
      <div className="input-form-group">
        <label className="input-form-label">
          Prefix:
          <input
            type="number"
            className="input-form-input"
            value={input.prefix}
            onChange={handlePrefixChange}
            min="0"
            max="128"
          />
        </label>
      </div>
      <div className="input-form-group">
        <label className="input-form-label">
          Subnets Prefix (optional):
          <input
            type="number"
            className="input-form-input"
            value={input.subnetsPrefix || ""}
            onChange={handleSubnetsPrefixChange}
            min="0"
            max="128"
            placeholder="Leave empty for no subnets"
          />
        </label>
      </div>
    </div>
  );
}
