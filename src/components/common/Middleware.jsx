import React from "react";
import { motion } from "framer-motion";
const Middleware = ({ title, img }) => {
  const variants = {
    initial: { y: "-100vh", opacity: 1 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100, // Lower stiffness for a gentler spring
        damping: 20, // Increased damping for less oscillation
      },
    },
    exit: { y: '-100vh', opacity: 1, transition: { duration: 1 }},
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-[100vh] fixed w-[100%] text-5xl font-bold top-0 text-white bg-black flex justify-center items-center z-[1000]"
    >
      {title}
      <img src={img} alt="" />
    </motion.div>
  );
};

export default Middleware;
