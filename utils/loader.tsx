import React from 'react'

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="loader mb-6"></div>
      <p className="text-sm text-gray-500 tracking-wide">Loading...</p>

      <style>{`
        .loader {
          width: 50px;
          padding: 8px;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #25b09b;
          --_m: 
            conic-gradient(#0000 10%,#000),
            linear-gradient(#000 0 0) content-box;
          -webkit-mask: var(--_m);
                  mask: var(--_m);
          -webkit-mask-composite: source-out;
                  mask-composite: subtract;
          animation: l3 1s infinite linear;
        }
        @keyframes l3 {
          to { transform: rotate(1turn); }
        }
      `}</style>
    </div>
  )
}

export default Loader
