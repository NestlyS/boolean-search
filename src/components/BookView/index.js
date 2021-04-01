import React, { useState } from "react";
import "./styles.css";

export default function BookView({
  title,
  description,
  date,
  creator,
  publisher,
  subject,
  format,
  type,
  source,
  language,
  rights,
}) {
  const [isFocused, setFocused] = useState(false);
  return (
    <fieldset
      className={`bookView ${isFocused ? "focused" : ""}`}
      tabIndex="0"
      onClick={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="title">Заголовок: </div>
      <div>{title}</div>
      <div className="title">Автор: </div>
      <div>{creator}</div>
      <div className="title">Дата: </div>
      <div>{date}</div>
      <div className="title">Издатель: </div>
      <div>{publisher}</div>
      <div className={`extraBlock ${!isFocused ? "hidden" : ""}`}>
        <div className="title">Описание: </div>
        <div>{description}</div>
        <div className="title">Права: </div>
        <div>{rights}</div>
        <div className="title">Язык: </div>
        <div>{language}</div>
        <div className="title">Формат: </div>
        <div>{format}</div>
        <div className="title">Тема: </div>
        <div>{subject}</div>
        <div className="title">Источник: </div>
        <div>{source}</div>
        <div className="title">Тип: </div>
        <div>{type}</div>
      </div>
    </fieldset>
  );
}
