

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 perspective-[1200px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          // exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="w-[800px] bg-white rounded-2xl shadow-xl"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthLayout;



// import React from "react";
// import { Outlet } from "react-router-dom";

// const AuthLayout = () => {
//   return (
//     <>
//       <main>
//         <Outlet />
//       </main>
//     </>
//   );
// };

// export default AuthLayout;
