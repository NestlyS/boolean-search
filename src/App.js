import React, { useState } from "react";
import { useBooleanSearch } from "./hooks/useBooleanSearch.js";
import "./App.css";
import Input from "./components/Input";
import data from "./data/data.json";
import BookList from "./components/BookList";

function App() {
  const [value, setValue] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const search = useBooleanSearch(data);
  return (
    <div className="App">
      <div className="header">
        <Input
          value={value}
          onChange={(value) => setValue(value)}
          onEnter={() => setSearchRes(search(value))}
        />
      </div>
      <BookList data={data} itemsToShow={searchRes} />
    </div>
  );
}

export default App;
