import { motion } from 'framer-motion';

const sizeMap = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
};

export default function DecorativeFish({
  variant = 'blue',
  size = 'md',
  className = '',
  animate = true,
}) {
  const fishSrc = '/mowby-assets/fishy.png';
  const Wrapper = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        animate: { y: [0, -10, 0], x: [0, 5, 0] },
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }
    : {};

  return (
    <Wrapper
      data-fish-variant={variant}
      className={`${sizeMap[size]} shrink-0 inline-flex items-center justify-center ${className}`}
      {...motionProps}
    >
      <img
        src={fishSrc}
        alt=""
        aria-hidden
        draggable={false}
        className="max-h-full max-w-full h-full w-full object-contain object-center select-none pointer-events-none"
      />
    </Wrapper>
  );
}
