import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      className="
        fixed top-5 right-5 z-50
        p-3 rounded-full
        backdrop-blur-xl
        bg-white/80 dark:bg-gray-900/70
        border border-gray-200/60 dark:border-gray-700/60
        shadow-lg hover:shadow-xl
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-brand-500
      "
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.25 }}
          >
            <Sun className="w-5 h-5 text-yellow-400" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
            transition={{ duration: 0.25 }}
          >
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};