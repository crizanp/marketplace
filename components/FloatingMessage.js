import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";

const FloatingMessage = ({ message, type = "success", onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose && onClose();
        }, 3000); // Total duration matches animation time

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    const typeClasses = {
        success: {
            container: "bg-success-light text-success-dark border-success dark:bg-success-dark dark:text-white",
            icon: <FiCheckCircle className="text-success-dark dark:text-white" />,
        },
        warning: {
            container: "bg-warning-light text-warning-dark border-warning dark:bg-warning-dark dark:text-white",
            icon: <FiAlertCircle className="text-warning-dark dark:text-white" />,
        },
        failure: {
            container: "bg-failure-light text-failure-dark border-failure dark:bg-failure-dark dark:text-white",
            icon: <FiXCircle className="text-failure-dark dark:text-white" />,
        },
    };

    const { container, icon } = typeClasses[type] || typeClasses.success;

    return (
        <div
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 max-w-sm w-full p-4 rounded-lg border-l-4 shadow-xl animate-slide-down-up flex items-center space-x-3 ${container}`}
        >
            {/* Icon */}
            <div className="text-xl">{icon}</div>

            {/* Message */}
            <div className="flex-1 text-sm font-medium">{message}</div>

            {/* Close Button */}
            <button
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                onClick={() => {
                    setVisible(false);
                    onClose && onClose();
                }}
            >
                <AiOutlineClose className="text-lg" />
            </button>
        </div>
    );
};

export default FloatingMessage;
