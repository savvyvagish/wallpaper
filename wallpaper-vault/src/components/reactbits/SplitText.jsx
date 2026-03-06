import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const SplitText = ({
  text = '',
  className = '',
  delay = 0,
  animationDuration = 0.5,
  staggerDelay = 0.05,
  threshold = 0.1,
  rootMargin = '0px',
  textAlign = 'center',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay / 1000,
      },
    },
  };

  const itemVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: animationDuration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ textAlign, display: 'inline-block', overflow: 'hidden' }}
      className={`split-text-container ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block whitespace-nowrap"
          style={{ marginRight: wordIndex === words.length - 1 ? 0 : '0.25em' }}
        >
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={itemVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

export default SplitText;
