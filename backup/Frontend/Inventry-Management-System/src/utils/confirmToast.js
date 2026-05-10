import toast from "react-hot-toast";
import React from "react";

/**
 * Show a confirmation dialog using toast
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Callback when user confirms
 * @param {Function} onCancel - Callback when user cancels (optional)
 */
export const confirmToast = (message, onConfirm, onCancel) => {
  toast.custom((t) =>
    React.createElement(
      "div",
      { className: "alert alert-warning", role: "alert" },
      React.createElement("div", { className: "mb-2" }, message),
      React.createElement(
        "div",
        { className: "d-flex gap-2" },
        React.createElement(
          "button",
          {
            className: "btn btn-sm btn-danger",
            onClick: () => {
              toast.dismiss(t.id);
              onConfirm && onConfirm();
            },
          },
          "Delete",
        ),
        React.createElement(
          "button",
          {
            className: "btn btn-sm btn-outline-secondary",
            onClick: () => {
              toast.dismiss(t.id);
              onCancel && onCancel();
            },
          },
          "Cancel",
        ),
      ),
    ),
  );
};

export default confirmToast;
