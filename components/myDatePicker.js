import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // You can override this CSS for custom styles
import styles from "../styles/myDatePicker.module.css"; // Import your custom styles

function myDatePicker() {
  const [formData, setFormData] = useState({
    startDate: null,
  });

  const styles = {
    select: {
      // Your custom styles for the input field
    },
  };

  return (
    <DatePicker
      selected={formData.startDate}
      onChange={(date) => setFormData({ ...formData, startDate: date })}
      dateFormat="dd/MM/yyyy"
      placeholderText="Selecione a data de início"
      className={styles.custom-datepicker} // Add your custom class here
      popperClassName={styles.custom-popper} // Class for customizing the calendar pop-up
    />
  );
}

export default myDatePicker;
