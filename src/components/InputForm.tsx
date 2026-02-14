import { useState } from "react";
import type { IPv6Input } from "../utils/ipv6";
import { getIPv6ErrorMessage, normalizeIPv6 } from "../utils/ipv6";

interface InputFormProps {
  onInputChange: (input: IPv6Input) => void;
}

export function InputForm({ onInputChange }: InputFormProps) {
  const [input, setInput] = useState<IPv6Input>({
    address: "2001:db8::",
    prefix: 64,
    subnetsPrefix: 65,
  });
  const [addressError, setAddressError] = useState<string | null>(null);
  const validateAddress = (value: string) => {
    const error = getIPv6ErrorMessage(value);
    setAddressError(error);
    return error;
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    validateAddress(newAddress);
    setInput((prev) => ({ ...prev, address: newAddress }));
  };
  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prefixValue = parseInt(e.target.value) || 0;
    setInput((prev) => ({ ...prev, prefix: prefixValue }));
  };
  const handleSubnetsPrefixChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setInput((prev) => ({
      ...prev,
      subnetsPrefix: value ? parseInt(value) : undefined,
    }));
  };
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateAddress(input.address);
    if (error) return;
    const canonical = normalizeIPv6(input.address);
    onCalculate({ ...input, address: canonical });
  };
  const isCalculateDisabled = Boolean(addressError) || !input.address.trim();

  return (
    <div className="input-form-container">
      <h2 className="input-form-title">IPv6 Calculator Input</h2>
      <div className="input-form-group">
        <label className="input-form-label">
          IPv6 Address:
          <input
            type="text"
            className={`input-form-input ${addressError ? "input-form-input-error" : ""}`}
            value={input.address}
            onChange={handleAddressChange}
            placeholder="e.g., 2001:db8:: or 2001:0db8:0000:0000:0000:0000:0000:0001"
          />
        </label>
        {addressError && (
          <div className="input-form-error-message">{addressError}</div>
        )}
        {!addressError && input.address && (
          <div className="input-form-success-message">
            ✓ Format valide (format comprimé ou complet accepté)
          </div>
        )}
        <div className="input-form-help-text">
          Format accepté: Hexadécimal (0-9, a-f) • 8 groupes séparés par : •
          Utiliser :: pour compresser les zéros
        </div>
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
