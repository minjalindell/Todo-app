import React from "react";
 
export default function Row({ item, deleteTask }) {
  console.log("Row item:", item);
 
  return (
    <li>
      {item.description}
      <button
        className="delete-button"
        onClick={() => deleteTask(item.id)}
      >
        Delete
      </button>
    </li>
  );
}