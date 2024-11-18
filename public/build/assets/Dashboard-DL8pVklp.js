import{j as e,Y as x}from"./app-B0VGsQib.js";import{A as h}from"./AuthenticatedLayout-D04TEFwI.js";import n from"./CumulativeLeaderboardTable-DqOmsno-.js";import c from"./MonthlyLeaderboardTable-CE_H_YQV.js";import b from"./WeeklyLeaderboardTable-mK1OFNtv.js";import g from"./DashboardStats-0PUL_kdr.js";import j from"./TermsAndCondition-DjC_FDsp.js";import f from"./AdminDashboard-y50YHodR.js";import"./ApplicationLogo-ozXmxoQk.js";import"./transition-CJJXDGSY.js";import"./table-CbIQjzd_.js";import"./utils-BM_CldAA.js";import"./button-BNOx9ZVN.js";import"./index-Bgvl_AAK.js";import"./dayjs.min-CdZE49Bf.js";import"./dialog-mcZmajyS.js";import"./createLucideIcon-k_81sQX2.js";import"./select-Cn9WOul0.js";import"./InputLabel-BUryseih.js";import"./FacultyRankingTable-D-InMKmU.js";import"./TransactionTable-DnhTtwFr.js";import"./format-cwXK75ha.js";function J({cumulative:r,monthly:a,weekly:o,facultyRanking:l,current_user:t,isAdmin:s,cumulativeAll:d,monthlyAll:i,weeklyAll:m,transactions:p}){return e.jsxs(h,{isAdmin:s,header:s?e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Admin Dashboard"}):e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Dashboard"}),children:[e.jsx(x,{title:"Dashboard"}),s?e.jsx(f,{current_user:t,cumulative:r,facultyRanking:l,weekly:o,monthly:a,isAdmin:s,weeklyAll:m,monthlyAll:i,cumulativeAll:d,transactions:p}):e.jsxs("div",{className:"max-w-7xl mx-auto p-4 sm:p-6 lg:p-8",children:[e.jsx(g,{current_user:t,cumulative:d,weekly:m,monthly:i}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6",children:[e.jsx("div",{className:"flex-1 bg-white rounded-lg shadow p-8",children:e.jsx(b,{users:o.data,links:o.links,current_user:t,isAdmin:s,selectedNumber:10,selectedTime:0,weeklyAll:m})}),e.jsx("div",{className:"flex-1 bg-white rounded-lg shadow p-8",children:e.jsx(c,{users:a.data,links:a.links,current_user:t,isAdmin:s,selectedNumber:10,selectedTime:0,monthlyAll:i})}),e.jsx("div",{className:"flex-1 bg-white rounded-lg shadow p-8 md:col-span-2 lg:col-span-1",children:e.jsx(n,{users:r.data,title:"Cumulative Top 10",duration:"November 10th, 2024 (12:00 a.m) - December 31th, 2024 (11:59 p.m)",current_user:t,isAdmin:s,links:r.links,selectedNumber:10,cumulativeAll:d})})]}),e.jsx("div",{className:"bg-white rounded-lg shadow p-4 sm:p-4 mt-6 text-center",children:e.jsx(j,{})})]})]})}export{J as default};
