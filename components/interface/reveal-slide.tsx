import { motion } from "framer-motion";
interface RevealSlideProps {
  visible: boolean;
  direction: boolean;
  children?: React.ReactNode;
}

export function RevealSlide({
  visible,
  direction,
  children,
}: RevealSlideProps) {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction ? 100 : -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      ease: "linear",
      duration: 2,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration: 0.4,
        type: "tween",
        ease: "backOut",
      }}
      className={`${visible ? "" : "hidden"}`}
    >
      {children}
    </motion.div>
  );
}
