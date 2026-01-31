import "./App.css";
import { useState } from "react";
import { Table } from "./components/Table";
import type { IPv6Input } from "./utils/ipv6";

function App() {
  const [input, setInput] = useState<IPv6Input>({
    address: "211::",
    prefix: 64,
    subnetsPrefix: 65,
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, address: e.target.value });
  };

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, prefix: parseInt(e.target.value) || 0 });
  };

  const handleSubnetsPrefixChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setInput({ ...input, subnetsPrefix: value ? parseInt(value) : undefined });
  };

  return (
    <div>
      <div
        style={{ margin: "20px", padding: "20px", border: "1px solid #ccc" }}
      >
        <h2>IPv6 Calculator Input</h2>
        <div style={{ marginBottom: "10px" }}>
          <label>
            IPv6 Address:
            <input
              type="text"
              value={input.address}
              onChange={handleAddressChange}
              placeholder="e.g., 211::"
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Prefix:
            <input
              type="number"
              value={input.prefix}
              onChange={handlePrefixChange}
              min="0"
              max="128"
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Subnets Prefix (optional):
            <input
              type="number"
              value={input.subnetsPrefix || ""}
              onChange={handleSubnetsPrefixChange}
              min="0"
              max="128"
              placeholder="Leave empty for no subnets"
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>
      </div>
      <Table input={input} />
    </div>
  );
}

export default App;
