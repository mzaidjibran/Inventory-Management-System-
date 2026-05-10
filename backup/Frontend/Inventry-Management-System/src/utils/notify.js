class Notify {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.init();
  }

  init() {
    // Create container for notifications if it doesn't exist
    let container = document.getElementById("notify-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "notify-container";
      container.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 500px;
      `;
      document.body.appendChild(container);
    }
    this.container = container;
  }

  show(message, type = "info") {
    const notification = document.createElement("div");
    const colors = {
      success: "#4caf50",
      error: "#f44336",
      warning: "#ff9800",
      info: "#2196f3",
    };

    notification.style.cssText = `
      background-color: ${colors[type] || colors.info};
      color: white;
      padding: 16px 24px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
      font-size: 14px;
      animation: slideDown 0.3s ease-out;
      text-align: center;
    `;

    notification.textContent = message;

    // Add animation
    if (!document.querySelector("style[data-notify-styles]")) {
      const style = document.createElement("style");
      style.setAttribute("data-notify-styles", "true");
      style.textContent = `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    this.container.appendChild(notification);

    // Auto remove after 2500ms
    setTimeout(() => {
      notification.style.animation = "slideUp 0.3s ease-out";
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  }

  success(message) {
    this.show(message, "success");
  }

  error(message) {
    this.show(message, "error");
  }

  warning(message) {
    this.show(message, "warning");
  }

  info(message) {
    this.show(message, "info");
  }

  dismiss(id) {
    // For compatibility with react-toastify
    if (id) {
      const notification = document.querySelector(`[data-toast-id="${id}"]`);
      if (notification) {
        notification.style.animation = "slideUp 0.3s ease-out";
        setTimeout(() => notification.remove(), 300);
      }
    }
  }
}

export const notify = new Notify();
