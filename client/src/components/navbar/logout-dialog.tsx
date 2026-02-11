// import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { DialogContent,DialogDescription } from "@/components/ui/dialog";
// import { Loader } from "lucide-react";
// import { Button } from "../ui/button";
// import { useTransition } from "react";
// import { useAppDispatch } from "@/app/hook";
// import { logout } from "@/features/auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import { AUTH_ROUTES } from "@/routes/common/routePath";

// interface LogoutDialogProps {
//     isOpen: boolean;
//     setIsOpen: (value: boolean) => void;
// }

// const LogoutDialog = ({ isOpen, setIsOpen }: LogoutDialogProps) => {
//     const [isPending, startTransition] = useTransition();
//     const dispatch = useAppDispatch();
//     const navigate = useNavigate();

//     const handleLogout = () => {
//       startTransition(() => {
//         setIsOpen(false);
//         dispatch(logout());
//         navigate(AUTH_ROUTES.SIGN_IN);
//       });
//     };
//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Are you sure you want to end your session?</DialogTitle>
//             <DialogDescription>
//                   Logging out will securely end your current session. You will need to re-enter your credentials to access your account again.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button className="text-white !bg-red-500" disabled={isPending} type="button" onClick={handleLogout}>
//               {isPending && <Loader className="animate-spin" />}
//               Yes
//             </Button>
//             <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     )
// }

// export default LogoutDialog

import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition, useState, useEffect } from "react";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LogoutDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const LogoutDialog = ({ isOpen, setIsOpen }: LogoutDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [dontAskAgain, setDontAskAgain] = useState<boolean>(
    localStorage.getItem("skipLogoutConfirm") === "true"
  );
  const [showGoodbye, setShowGoodbye] = useState(false);

  const handleLogout = () => {
    startTransition(() => {
      if (dontAskAgain) {
        localStorage.setItem("skipLogoutConfirm", "true");
      } else {
        localStorage.removeItem("skipLogoutConfirm");
      }

      // Show goodbye message before redirect
      setShowGoodbye(true);

      setTimeout(() => {
        setIsOpen(false);
        dispatch(logout());
        navigate(AUTH_ROUTES.SIGN_IN);
      }, 1200); // small delay to show goodbye message
    });
  };

  // Keyboard shortcut: Enter = Yes, Esc = Cancel
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleLogout();
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <Dialog open={isOpen && !showGoodbye} onOpenChange={setIsOpen}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Are you sure you want to end your session?</DialogTitle>
          <DialogDescription>
            Logging out will securely end your current session. You will need to
            re-enter your credentials to access your account again.
          </DialogDescription>
        </DialogHeader>

        {/* Don't ask me again toggle */}
        <div className="flex items-center justify-between rounded-md border p-3 bg-muted/30">
          <div className="flex flex-col">
            <Label htmlFor="dont-ask" className="font-medium">
              Skip confirmation next time
            </Label>
            <span className="text-sm text-muted-foreground">
              You’ll be logged out instantly when you click logout.
            </span>
          </div>
          <Switch
            id="dont-ask"
            checked={dontAskAgain}
            onCheckedChange={setDontAskAgain}
          />
        </div>

        <DialogFooter>
          <Button
            className="text-white !bg-red-500"
            disabled={isPending}
            type="button"
            onClick={handleLogout}
          >
            {isPending && <Loader className="animate-spin mr-2" />}
            Yes
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
