import { useGameUI } from "@/context/game-ui";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@iconify/react";
import { useToast } from "@/context/toast";
import { useShortenUrl } from "@/lib/networks";
import { useCallback, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function Share() {
  const { setIsShareModalOpen } = useGameUI();
  const { show, warn } = useToast();

  const fullUrl = useMemo(() => {
    return window.location.toString();
  }, []);

  const { data, isLoading } = useShortenUrl(fullUrl);

  const copy = useCallback(async () => {
    if (isLoading) return;

    try {
      await navigator.clipboard.writeText(data?.shorturl ?? fullUrl);
      show("Link copied to clipboard");
    } catch (err) {
      warn("Failed to copy link");
    }
  }, [fullUrl, isLoading, data]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/25 drop-shadow-md flex items-center justify-center font-mono text-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-gray-500 rounded-3xl overflow-hidden max-w-xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.1}}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h1 className="w-full bg-gray-600 p-4 text-center text-2xl font-mono">
          Share Link
        </h1>
        <div className="p-4 w-full">
          <p className="font-mono text-sm text-gray-300">
            Use this link to share and give others access to the same list of
            names.
          </p>
          <div className="mt-4 flex w-full">
            {isLoading && <Skeleton className="h-10 w-full" />}
            {!isLoading && (
              <>
                <div className="p-2 bg-gray-700 rounded-l-xl shrink-0">
                  Link
                </div>
                <input
                  value={data?.shorturl}
                  contentEditable={false}
                  className="focus:outline-none grow bg-gray-600 px-2"
                  onFocus={copy}
                />
                <button
                  className="flex items-center gap-1.5 shrink-0 rounded-r-2xl border border-gray-600 px-3 hover:bg-gray-700 transition-colors"
                  onClick={copy}
                >
                  <Icon icon="solar:copy-broken" />
                  Copy
                </button>
              </>
            )}
          </div>
          <div className="w-full flex justify-end px-4 mt-7">
            <button
              className="bg-gray-600 text-gray-300 px-4 py-2 rounded-full hover:bg-gray-700 hover:drop-shadow-md transition-colors"
              onClick={() => {
                setIsShareModalOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ShareModal() {
  const { isShareModalOpen } = useGameUI();
  return (
    <AnimatePresence initial={false}>
      {isShareModalOpen && <Share />}
    </AnimatePresence>
  );
}
