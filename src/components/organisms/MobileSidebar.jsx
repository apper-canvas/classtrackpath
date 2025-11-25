import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Navigation from "@/components/organisms/Navigation";

const MobileSidebar = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 glass-effect border-r border-white/20 z-50 lg:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-semibold gradient-text">ClassTrack</h2>
                  <p className="text-sm text-gray-500 mt-1">Navigation</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              <Navigation />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;