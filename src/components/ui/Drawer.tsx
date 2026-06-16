import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Drawer({
  open,
  onOpenChange,
  title,
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" />
        <Dialog.Content asChild>
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            className="glass-panel fixed bottom-0 right-0 top-0 z-50 w-full max-w-xl overflow-y-auto p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <Dialog.Title className="text-xl font-bold">{title}</Dialog.Title>
              <Dialog.Close asChild>
                <Button size="icon" variant="ghost" aria-label="Close drawer">
                  <X className="h-5 w-5" />
                </Button>
              </Dialog.Close>
            </div>
            {children}
          </motion.aside>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
