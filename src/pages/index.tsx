import { type NextPage } from "next";
import Link from "next/link";
import TaskModal from "../components/TaskModal";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <AnimateSharedLayout>
      <motion.div
        layout
        className="flex h-full flex-col items-center justify-around"
      >
        <motion.div layout>
          <Link href={"/task"}>
            <span
              className="rounded-full bg-white/10 px-10 py-3 font-semibold
            text-white no-underline transition hover:bg-white/20"
            >
              New Task
            </span>
          </Link>
        </motion.div>
        <TaskModal />
        <motion.div layout className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <AuthShowcase />
        </motion.div>
      </motion.div>
    </AnimateSharedLayout>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
