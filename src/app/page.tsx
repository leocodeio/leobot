import dynamic from "next/dynamic";

const LeobotLanding = dynamic(() => import("~/components/leobot-landing"), {
  ssr: false,
});

export default function Home() {
  return <LeobotLanding />;
}
