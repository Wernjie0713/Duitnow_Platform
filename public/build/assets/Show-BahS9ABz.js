import{q as u,W as b,j as e,Y as j}from"./app-Bq-oySIi.js";import{B as c}from"./button-BqFC5x7i.js";import{A as f}from"./AuthenticatedLayout-MKoxOJv9.js";import"./index-BN1pkIhT.js";import"./utils-BM_CldAA.js";import"./ApplicationLogo-DR5a5-oe.js";import"./transition-Bu4g1pAD.js";function D({isAdmin:l}){const{auth:r,reference_id:a,date:t,amount:n,transaction_type:s,image_url:o}=u().props;r.user;const{post:m,processing:d}=b({reference_id:a,date:t,amount:n,transaction_type:s,image_url:o}),x=h=>{h.preventDefault(),m(route("transactions.confirm"),{onSuccess:()=>{alert("Transaction confirmed and saved successfully!"),window.location.href="/transactions"},onError:i=>{console.error("Failed to save transaction:",i);const p=Object.values(i).flat().join(`
`);alert(`Failed to save transaction:
${p}`),window.location.href="/transactions"}})};return e.jsxs(f,{isAdmin:l,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Extracted Transaction Data"}),children:[e.jsx(j,{title:"Extracted Transaction Data"}),e.jsx("div",{className:"container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl",children:e.jsxs("div",{className:"bg-white p-4 sm:p-6 rounded-lg shadow-md",children:[e.jsxs("form",{onSubmit:x,children:[s&&e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"font-semibold block",children:"Transaction Type:"}),e.jsx("p",{className:"text-sm sm:text-base",children:s}),e.jsx("input",{type:"hidden",name:"image_url",value:"{{ image_url }}"})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"font-semibold block",children:"Reference ID:"}),e.jsx("p",{className:"text-sm sm:text-base",children:a})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"font-semibold block",children:"Date:"}),e.jsx("p",{className:"text-sm sm:text-base",children:t})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"font-semibold block",children:"Amount:"}),e.jsx("p",{className:"text-sm sm:text-base",children:n})]}),e.jsx("div",{className:"flex space-x-4",children:e.jsx(c,{className:"text-white py-2 px-4 rounded",disabled:d,children:"Confirm and Save"})})]}),e.jsx(c,{variant:"destructive",className:"text-white py-2 px-4 rounded mt-2",children:e.jsx("a",{href:"/transactions",className:"text-white block text-center",children:"Cancel and Back to Transactions"})})]})})]})}export{D as default};