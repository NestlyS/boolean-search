import React from "react";
import "./styles.css";

export default function Input({ value, onChange, onEnter }) {
  return (
    <div className="root">
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.code === "Enter" && onEnter()}
      />
      <button className="button" onClick={() => onEnter()}>
        Поиск
      </button>
    </div>
  );
}
