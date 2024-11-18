import{j as e,a as x}from"./app-B0VGsQib.js";import{T as c,a as i,b as r,c as a,d as n,e as l}from"./table-CbIQjzd_.js";import{B as h}from"./button-BNOx9ZVN.js";import{f as b}from"./format-cwXK75ha.js";import"./utils-BM_CldAA.js";import"./index-Bgvl_AAK.js";const u=({transactions:d,links:t})=>{const m=()=>{window.location.href=route("export.transactions")};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"relative flex flex-col sm:flex-row items-center justify-between pt-4 pb-2",children:[e.jsx("div",{className:"sm:w-1/4 mb-4 sm:mb-0"}),e.jsx("h1",{className:"text-xl sm:text-2xl font-bold text-gray-800 text-center whitespace-nowrap",children:"All Recorded Transactions"}),e.jsx("div",{className:"sm:w-1/4 flex justify-end mt-4 sm:mt-0",children:e.jsx(h,{onClick:m,children:"Export to Excel"})})]}),!d||d.length===0?e.jsx("div",{className:"rounded-lg overflow-hidden shadow-lg border border-gray-200",children:e.jsxs(c,{children:[e.jsx(i,{children:e.jsxs(r,{className:"bg-black hover:bg-black",children:[e.jsx(a,{className:"w-[30%] font-semibold text-white",children:"Reference No."}),e.jsx(a,{className:"w-[25%] font-semibold text-white",children:"Date"}),e.jsx(a,{className:"w-[15%] font-semibold text-white",children:"Amount (RM)"}),e.jsx(a,{className:"w-[15%] font-semibold text-white",children:"Transaction Type"})]})}),e.jsxs(n,{children:[e.jsx(r,{}),e.jsx(l,{children:"No transactions found."})]})]})}):e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"rounded-lg overflow-hidden shadow-lg border border-gray-200",children:e.jsxs(c,{children:[e.jsx(i,{children:e.jsxs(r,{className:"bg-black hover:bg-black",children:[e.jsx(a,{className:"w-[15%] font-semibold text-white",children:"Transaction Type"}),e.jsx(a,{className:"w-[30%] font-semibold text-white",children:"Reference No."}),e.jsx(a,{className:"w-[25%] font-semibold text-white",children:"Date"}),e.jsx(a,{className:"w-[15%] font-semibold text-white text-center",children:"Amount (RM)"})]})}),e.jsx(n,{children:d.map(s=>e.jsxs(r,{className:"hover:bg-gray-50 transition-colors duration-200",children:[e.jsx(l,{className:"font-semibold ",children:s.transaction_type}),e.jsx(l,{className:"font-medium text-blue-600",children:s.reference_id}),e.jsx(l,{children:s.date?b(new Date(s.date),"PPP"):"N/A"}),e.jsx(l,{className:"font-semibold text-center",children:s.amount})]},s.id))})]})}),t&&t.length>0&&e.jsx("div",{className:"flex justify-center mt-6",children:e.jsx("nav",{"aria-label":"Page navigation",children:e.jsx("ul",{className:"inline-flex rounded-md shadow-sm",children:t.map((s,o)=>e.jsx("li",{children:e.jsx(x,{href:s.url,className:`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border ${o===0?"rounded-l-md":""} ${o===t.length-1?"rounded-r-md":""} ${s.active?"bg-black text-white border-gray-500 hover:bg-black hover:text-white":"bg-white text-gray-700 border-gray-300 hover:bg-gray-200"} ${s.url?"hover:text-gray-700":"opacity-50 cursor-not-allowed"}`,dangerouslySetInnerHTML:{__html:s.label}})},o))})})})]})]})};export{u as default};
