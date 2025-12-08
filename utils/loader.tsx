// import React from 'react';

// const Loader = () => {
//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen bg-white">
//       {/* Skype-style dots loader */}
//       <div className="flex space-x-2 mb-6">
//         {[0, 1, 2, 3, 4, 5].map((index) => (
//           <div
//             key={index}
//             className="w-3 h-3 bg-blue-500 rounded-full"
//             style={{
//               animation: 'skypeBounce 1.4s ease-in-out infinite',
//               animationDelay: `${index * 0.10}s`
//             }}
//           ></div>
//         ))}
//       </div>
      
//       {/* Loading text */}
//       <p className="text-sm text-gray-600">Loading...</p>
      
//       <style>{`
//         @keyframes skypeBounce {
//           0%, 80%, 100% {
//             transform: scale(0.8);
//             opacity: 0.5;
//           }
//           40% {
//             transform: scale(1.2);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Loader;
import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      {/* Skype-style dots loader */}
      <div className="flex space-x-2 mb-6">
        <div 
          className="w-4 h-4 bg-blue-500 rounded-full"
          style={{ 
            animation: 'bounce 0.6s infinite',
            animationDelay: '0s'
          }}
        ></div>
        <div 
          className="w-4 h-4 bg-blue-500 rounded-full"
          style={{ 
            animation: 'bounce 0.6s infinite',
            animationDelay: '0.15s'
          }}
        ></div>
        <div 
          className="w-4 h-4 bg-blue-500 rounded-full"
          style={{ 
            animation: 'bounce 0.6s infinite',
            animationDelay: '0.3s'
          }}
        ></div>
        <div 
          className="w-4 h-4 bg-blue-500 rounded-full"
          style={{ 
            animation: 'bounce 0.6s infinite',
            animationDelay: '0.45s'
          }}
        ></div>
      </div>
      
     
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;


// import React from 'react';

// const Loader = () => {
//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen bg-white">
//       {/* Skype-style dots loader */}
//       <div className="flex space-x-2 mb-6">
//         <div 
//           className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
//           style={{ animationDelay: '0s', animationDuration: '0.6s' }}
//         ></div>
//         <div 
//           className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
//           style={{ animationDelay: '0.2s', animationDuration: '0.6s' }}
//         ></div>
//         <div 
//           className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
//           style={{ animationDelay: '0.4s', animationDuration: '0.6s' }}
//         ></div>
//         <div 
//           className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
//           style={{ animationDelay: '0.s', animationDuration: '0.6s' }}
//         ></div>
//       </div>
      
//       {/* Loading text */}
//       <p className="text-sm text-gray-600">Loading...</p>
//     </div>
//   );
// };

// export default Loader;

// import React from 'react';

// const Loader = () => {
//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen bg-white">
//       {/* Snake circular loader */}
//       <div className="relative w-24 h-24 mb-6">
//         <svg className="w-24 h-24 animate-spin" style={{ animationDuration: '1s' }}>
//           <circle
//             cx="48"
//             cy="48"
//             r="40"
//             stroke="#3b82f6"
//             strokeWidth="6"
//             fill="none"
//             strokeLinecap="round"
//             strokeDasharray="60 200"
//           />
//         </svg>
//       </div>
      
//       {/* Loading text */}
//       <p className="text-base text-gray-600">Loading...</p>
//     </div>
//   );
// };

// export default Loader;
