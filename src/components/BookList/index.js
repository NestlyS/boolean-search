import React from "react";
import BookView from "../BookView";

import "./styles.css";

export default function BookList({ data, itemsToShow = [] }) {
  const items = data.filter((_, index) => itemsToShow.includes(index));
  return (
    <div className="bookList">
      {items.length > 0 ? (
        items.map((item, index) => <BookView {...item} key={index} />)
      ) : (
        <div>Ничего не найдено!</div>
      )}
    </div>
  );
}
