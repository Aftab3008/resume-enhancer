import { deleteResume } from "@/lib/actions/resume.actions";
import { Resume } from "@prisma/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

function ResumeCard({ resume }: { resume: Resume }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(id: string) {
    try {
      setIsDeleting(true);
      const res = await deleteResume(id);
      if (res) {
        toast.success(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <motion.div
      className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg p-4 transition-colors">
        <div>
          <motion.h3 className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left">
            {resume.fileName}
          </motion.h3>
        </div>
      </div>

      <div className="flex gap-2 mt-4 md:mt-0">
        <Link href={`/resume-enhancer/${resume.id}`}>
          <motion.button
            className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-blue-500 hover:text-white text-black"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit
          </motion.button>
        </Link>
        <motion.button
          className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-red-500 hover:text-white text-black"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDelete(resume.id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p>Deleting..</p>
            </div>
          ) : (
            "Delete"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ResumeCard;
