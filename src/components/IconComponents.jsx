import React from 'react';

export const IconComponents = {
 MessageCircle: (props) => (
 <svg className="h-6 w-6 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
 </svg>
 ),
 System: (props) => (
 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
 </svg>
 ),
 Send: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
 </svg>
 ),
 User: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
 <circle cx="12" cy="7" r="4" />
 </svg>
 ),
 Loader2: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 12a9 9 0 1 1-6.219-8.56" />
 </svg>
 ),
 Globe: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="12" cy="12" r="10" />
 <line x1="2" y1="12" x2="22" y2="12" />
 <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
 </svg>
 ),
 ChevronRight: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M9 18l6-6-6-6" />
 </svg>
 ),
 Tools: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M3 7 L12 3 L21 7 L12 11 Z" fill="none" />
 <path d="M3 7 L3 17 L12 21 L12 11 Z" fill="none" />
 <path d="M21 7 L21 17 L12 21 L12 11 Z" fill="none" />
 <circle cx="7" cy="14" r="1.5" />
 <circle cx="12" cy="16" r="1.5" />
 <circle cx="17" cy="14" r="1.5" />
 <line x1="12" y1="11" x2="12" y2="21" stroke="currentColor" opacity="0.3" />
 <line x1="3" y1="7" x2="12" y2="11" stroke="currentColor" opacity="0.3" />
 <line x1="21" y1="7" x2="12" y2="11" stroke="currentColor" opacity="0.3" />
 </svg>
 ),
 Wikipedia: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="currentColor">
 <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564. 031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252 1.758-3.504c.293-.64.233-.801.111-.947-.07-.084-.305-.22-.812-.24l-.201-.021c-.052 0-.098-.015-.145-.051-.045-.031-.067-.076-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178-.646.03-1.023.095-1.023.439-.12.186-.375.589-.646 1.039l-2.301 4.273-.065.135 2.792 5.712.17.048 4.396-10.438c.154-.422.129-.722-.064-.895-.197-.174-.346-.277-.857-.277l-.423-.015c-.061 0-.105-.014-.152-.045-.043-.029-.072-.075-.072-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18-.648.30-1.127.18-1.443.421-.314.255-.557.616-.736 1.067 0 0-4.043 9.258-5.426 12.339-.525 1.007-1.053.917-1.503-.031-.571-1.171-1.773-3.786-2.646-5.71l.053-.036z" />
 </svg>
 ),
 Google: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="currentColor">
 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10S17 .52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8c1.93 0 3.68.68 5.07 1.81L14.1 9.9c-.56-.56-1.32-.9-2.1-.9-1.66 0-3 1.34-3 3s1.34 3 3 3c1.38 0 2.54-.93 2.87-2.18H12v-2.82h5.64c.09.5.14 1.01.14 1.54 0 4.41-3.59 8-8 8z" />
 </svg>
 ),
 Facebook: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="currentColor">
 <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z" />
 </svg>
 ),
 Default: (props) => (
 <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
 </svg>
 )
};