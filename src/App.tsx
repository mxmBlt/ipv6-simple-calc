import "./App.css";
import { Table } from "./components/Table";

function App() {
  return (
    <div>
      <Table address="211::" netmask={64} showSubnets={65} />
    </div>
  );
}

export default App;
