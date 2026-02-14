import "./App.css";
import { useState } from "react";
import { InputForm } from "./components/InputForm";
import { Table } from "./components/Table";
import { Layout } from "./layout/Layout";
import type { IPv6Input } from "./utils/ipv6";

function App() {
  const [input, setInput] = useState<IPv6Input>({
    address: "2001:db8::",
    prefix: 64,
    subnetsPrefix: 65,
  });

  return (
    <Layout title="IPv6 Calculator">
      <InputForm onCalculate={setInput} />
      <Table input={input} />
    </Layout>
  );
}

export default App;
