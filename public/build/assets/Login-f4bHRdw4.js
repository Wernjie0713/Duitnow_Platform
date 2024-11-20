import{j as e,W as f,Y as h,a as g}from"./app-Bq-oySIi.js";import{G as j}from"./GuestLayout-Dj-CfPV7.js";import{I as i}from"./InputError-hOsUcspQ.js";import{I as l}from"./InputLabel-BqYIxUx4.js";import{P as n}from"./PrimaryButton-ahfeif6q.js";import{T as d}from"./TextInput-F0dgxDC9.js";import"./ApplicationLogo-DR5a5-oe.js";function b({className:r="",...a}){return e.jsx("input",{...a,type:"checkbox",className:"rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 "+r})}function I({status:r,canResetPassword:a}){const{data:t,setData:m,post:c,processing:u,errors:o,reset:x}=f({email:"",password:"",remember:!1}),p=s=>{s.preventDefault(),c(route("login"),{onFinish:()=>x("password")})};return e.jsxs(j,{children:[e.jsx(h,{title:"Log in"}),r&&e.jsx("div",{className:"mb-4 font-medium text-sm text-green-600",children:r}),e.jsxs("form",{onSubmit:p,children:[e.jsxs("div",{children:[e.jsx(l,{htmlFor:"email",value:"Email"}),e.jsx(d,{id:"email",type:"email",name:"email",value:t.email,className:"mt-1 block w-full",autoComplete:"username",isFocused:!0,onChange:s=>m("email",s.target.value)}),e.jsx(i,{message:o.email,className:"mt-2"})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(l,{htmlFor:"password",value:"Password"}),e.jsx(d,{id:"password",type:"password",name:"password",value:t.password,className:"mt-1 block w-full",autoComplete:"current-password",onChange:s=>m("password",s.target.value)}),e.jsx(i,{message:o.password,className:"mt-2"})]}),e.jsx("div",{className:"block mt-4",children:e.jsxs("label",{className:"flex items-center",children:[e.jsx(b,{name:"remember",checked:t.remember,onChange:s=>m("remember",s.target.checked)}),e.jsx("span",{className:"ms-2 text-sm text-gray-600",children:"Remember me"})]})}),e.jsxs("div",{className:"flex items-center justify-end mt-4",children:[a&&e.jsx(g,{href:route("password.request"),className:"underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",children:"Forgot your password?"}),e.jsx(n,{className:"ms-4",disabled:u,children:"Log in"})]})]}),e.jsx("hr",{className:"mt-4 mb-4"}),e.jsx("div",{className:"flex flex-row justify-center",children:e.jsx(n,{children:e.jsx("a",{href:route("register"),children:"Sign up"})})})]})}export{I as default};