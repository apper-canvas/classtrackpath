import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-md"
      >
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-20 animate-pulse"></div>
        </div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-bold gradient-text"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold text-gray-900"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 leading-relaxed"
          >
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Home" className="w-4 h-4" />
              Back to Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            Need help? Check out our{" "}
            <button
              onClick={() => navigate("/students")}
              className="text-primary hover:underline"
            >
              Students page
            </button>{" "}
            or{" "}
            <button
              onClick={() => navigate("/grades")}
              className="text-primary hover:underline"
            >
              Grades section
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;