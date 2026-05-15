// import { useState } from "react";
// import createClient from "../../Api/client.js";
// import toast from "react-hot-toast";

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

//   .cf-overlay {
//     position: fixed; inset: 0;
//     background: rgba(10, 10, 20, 0.55);
//     backdrop-filter: blur(6px);
//     display: flex; align-items: center; justify-content: center;
//     z-index: 1050;
//     padding: 1rem;
//     animation: cfFadeIn 0.2s ease;
//   }
//   @keyframes cfFadeIn { from { opacity: 0 } to { opacity: 1 } }

//   .cf-card {
//     background: #fffdf9;
//     border: 1px solid #e8dcc8;
//     border-radius: 18px;
//     width: 100%; max-width: 700px;
//     box-shadow: 0 12px 40px rgba(139,101,50,0.14);
//     font-family: 'Nunito', sans-serif;
//     overflow: hidden;
//     animation: cfSlideUp 0.25s cubic-bezier(.22,.68,0,1.2);
//   }
//   @keyframes cfSlideUp {
//     from { transform: translateY(28px); opacity: 0 }
//     to   { transform: translateY(0);    opacity: 1 }
//   }

//   .cf-header {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 16px 22px;
//     background: linear-gradient(135deg, #fffdf9, #fef6ea);
//     border-bottom: 1px solid #f0e4d0;
//   }
//   .cf-header-left { display: flex; align-items: center; gap: 12px; }
//   .cf-icon {
//     width: 38px; height: 38px; border-radius: 11px;
//     background: linear-gradient(135deg, #c8965a, #a0733a);
//     display: flex; align-items: center; justify-content: center;
//     color: #fff; font-size: 1rem;
//     flex-shrink: 0;
//   }
//   .cf-title {
//     font-size: 15px; font-weight: 800;
//     color: #3d2a10; margin: 0;
//   }
//   .cf-subtitle {
//     font-size: 11px; color: #b89060;
//     font-weight: 600; margin: 0;
//   }

//   .cf-close {
//     width: 30px; height: 30px; border-radius: 8px;
//     background: #fdecea; color: #c62828;
//     border: none; display: flex; align-items: center; justify-content: center;
//     cursor: pointer; font-size: 15px; transition: opacity 0.15s;
//   }
//   .cf-close:hover { opacity: 0.8; }

//   .cf-body {
//     padding: 22px 22px 10px;
//     max-height: 62vh; overflow-y: auto;
//     background: #fffdf9;
//     scrollbar-width: thin; scrollbar-color: #e8dcc8 transparent;
//   }

//   .cf-section-label {
//     font-size: 10px; font-weight: 800; letter-spacing: 1.2px;
//     text-transform: uppercase; color: #c8a87a;
//     margin: 0 0 14px; padding: 0;
//     display: flex; align-items: center; gap: 8px;
//   }
//   .cf-section-label::after {
//     content: ''; flex: 1; height: 1px;
//     background: linear-gradient(90deg, #e8dcc8, transparent);
//   }

//   .cf-grid {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 1rem 1.25rem;
//     margin-bottom: 1.5rem;
//   }

//   .cf-field {
//     display: flex; flex-direction: column; gap: 0.35rem;
//     margin-bottom: 4px;
//   }
//   .cf-field.full { grid-column: span 2; }

//   .cf-label {
//     font-size: 11.5px; font-weight: 700; color: #7a5c38;
//     display: block;
//     font-family: 'Nunito', sans-serif;
//   }

//   .cf-input {
//     padding: 9px 12px;
//     border: 1px solid #e8dcc8;
//     border-radius: 10px;
//     font-family: 'Nunito', sans-serif;
//     font-size: 13px; font-weight: 600;
//     color: #3d2a10;
//     background: #fffdf9;
//     transition: border-color 0.18s, box-shadow 0.18s;
//     outline: none;
//   }
//   .cf-input:focus {
//     border-color: #c8965a;
//     box-shadow: 0 0 0 3px rgba(200,150,90,0.12);
//     background: #fffdf9;
//   }
//   .cf-input::placeholder {
//     color: #d4b896; font-weight: 500;
//   }

//   .cf-hint {
//     font-size: 10.5px; color: #c8a87a;
//     font-weight: 600; margin-top: 4px;
//     font-family: 'Nunito', sans-serif;
//   }

//   .cf-footer {
//     display: flex; align-items: center; justify-content: flex-end;
//     gap: 0.75rem;
//     padding: 14px 22px;
//     border-top: 1px solid #f0e4d0;
//     background: linear-gradient(135deg, #fffdf9, #fef6ea);
//   }

//   .cf-btn {
//     padding: 9px 22px;
//     border-radius: 10px; border: none;
//     font-family: 'Nunito', sans-serif;
//     font-size: 13px; font-weight: 700;
//     cursor: pointer; transition: opacity 0.18s, transform 0.15s;
//     display: flex; align-items: center; gap: 7px;
//   }
//   .cf-btn-primary {
//     background: linear-gradient(135deg, #c8965a, #a0733a);
//     color: #fff;
//   }
//   .cf-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
//   .cf-btn-primary:active { transform: translateY(0); }
//   .cf-btn-ghost {
//     background: #fdecea; color: #c62828;
//   }
//   .cf-btn-ghost:hover { opacity: 0.8; }

//   @media (max-width: 560px) {
//     .cf-grid { grid-template-columns: 1fr; }
//     .cf-field.full { grid-column: span 1; }
//   }
// `;

// const FIELDS = [
//   { label: "Name", field: "name", type: "text", hint: "Enter client name" },
//   {
//     label: "Email",
//     field: "email",
//     type: "email",
//     hint: "Enter email address",
//   },
//   {
//     label: "Contact",
//     field: "contact",
//     type: "text",
//     hint: "Enter contact number",
//   },
//   {
//     label: "Address",
//     field: "address",
//     type: "text",
//     hint: "Enter street address",
//     full: true,
//   },
// ];

// const ClientForm = ({ onSaved, editData, onClearEdit, isOpen, onClose }) => {
//   const empty = { name: "", email: "", contact: "", address: "" };

//   const [value, updateValue] = useState(() => ({
//     name: editData?.name || "",
//     email: editData?.email || "",
//     contact: editData?.contact || "",
//     address:
//       typeof editData?.address === "string"
//         ? editData.address
//         : editData?.address?.street || "",
//   }));

//   function handleChange(field) {
//     return (e) => updateValue((prev) => ({ ...prev, [field]: e.target.value }));
//   }

//   async function SaveSupplier(e) {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...value,
//         address: {
//           street: value.address,
//           city: "",
//           state: "",
//           country: "",
//           zipCode: "",
//         },
//       };

//       if (editData) {
//         const { updateClient } = await import("../../Api/client.js");
//         await updateClient(editData._id, payload);
//         toast.success("Customer updated successfully");
//       } else {
//         await createClient(payload);
//         toast.success("Customer added successfully");
//       }
//       updateValue(empty);
//       onSaved?.();
//       onClearEdit?.();
//       onClose?.();
//     } catch (err) {
//       toast.error("Error: " + err.message);
//     }
//   }

//   function handleReset() {
//     updateValue(empty);
//     onClearEdit?.();
//   }

//   function handleClose() {
//     handleReset();
//     onClose?.();
//   }

//   if (!isOpen) return null;

//   return (
//     <>
//       <style>{styles}</style>
//       <div
//         className="cf-overlay"
//         onClick={(e) => e.target === e.currentTarget && handleClose()}
//       >
//         <div
//           className="cf-card"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="cf-title"
//         >
//           {/* Header */}
//           <div className="cf-header">
//             <div className="cf-header-left">
//               <div className="cf-icon">{editData ? "✏️" : "👤"}</div>
//               <div>
//                 <p className="cf-title" id="cf-title">
//                   {editData ? "Edit Client" : "Add New Client"}
//                 </p>
//                 <p className="cf-subtitle">
//                   {editData
//                     ? "Update the client details below"
//                     : "Fill in the details to add a client"}
//                 </p>
//               </div>
//             </div>
//             <button
//               className="cf-close"
//               onClick={handleClose}
//               aria-label="Close"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Body */}
//           <form onSubmit={SaveSupplier}>
//             <div className="cf-body">
//               <p className="cf-section-label">Client Information</p>
//               <div className="cf-grid">
//                 {FIELDS.map(({ label, field, type, hint, full }) => (
//                   <div className={`cf-field${full ? " full" : ""}`} key={field}>
//                     <label className="cf-label" htmlFor={`cf-${field}`}>
//                       {label}
//                     </label>
//                     <input
//                       id={`cf-${field}`}
//                       className="cf-input"
//                       type={type}
//                       placeholder={hint}
//                       value={value[field]}
//                       onChange={handleChange(field)}
//                     />
//                     <span className="cf-hint">{hint}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="cf-footer">
//               <button
//                 type="button"
//                 className="cf-btn cf-btn-ghost"
//                 onClick={handleReset}
//               >
//                 Reset
//               </button>
//               <button type="submit" className="cf-btn cf-btn-primary">
//                 {editData ? "Update Client" : "Add Client"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ClientForm;
