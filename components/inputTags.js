import { use, useEffect, useState } from "react";

const TextBoxComponent = ({ onMandatoriesChange }) => {
  const [text, setText] = useState("");
  const [textList, setTextList] = useState([]);

  // Function to handle adding a new item when Enter is pressed
  const handleKeyPress = async (e) => {
    if (e.key === "Enter" && text.trim()) {
      e.preventDefault(); // Prevent default Enter action
      setTextList([...textList, text]);
      setText(""); // Clear the input
    }
  };

  useEffect(() => {
    onMandatoriesChange(textList);
  }, [textList]);

  // Function to handle removing an item from the list
  const handleRemoveItem = (indexToRemove) => {
    setTextList((prevList) => prevList.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="container p-0">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Write and press enter..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <div className="mt-3">
        {textList.map((item, index) => (
          <div
            key={index}
            className="alert alert-light d-inline-flex align-items-center p-2 me-2"
            style={{ whiteSpace: "nowrap", position: "relative" }}
          >
            {item}
            <button
              type="button"
              className="btn-close ms-2"
              aria-label="Close"
              style={{
                fontSize: "0.7rem",
              }}
              onClick={() => handleRemoveItem(index)}
            ></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextBoxComponent;