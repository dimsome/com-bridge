import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Landing() {
  return (
    <div className="flex flex-col items-center text-gray-900 mt-10 md:mt-20 lg:mt-40">
      <span className="max-w-3xl text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-primary-500">
          Coincidence of Miau:
      </span>
        <h1 className="max-w-3xl text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4 text-primary-500">
          Peer-to-Peer Bridging with Purrrrrrrfect Matching
      </h1>
      <p className="max-w-xl text-center text-primary-300">
          Get matched peer-to-peer for simpler, cheaper bridging
      </p>
      <p className="mb-16 font-semibold text-primary-300">Get started:</p>
      <ConnectButton />
      <h2 className="mt-20 mb-16 text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-neutral-900">
        How It Works
      </h2>
      <div className="flex flex-wrap gap-16 md:mx-10 mb-20 justify-center">
        <HowItWorksItem
          number={1}
          title="Create Order"
          description="Add a order to of wants. What token and which chain would you like to bridge to?"
        />
        <HowItWorksItem
          number={2}
          title="Take Order"
          description="Explore existing wants and match with your want. Start bridging instantly."
        />
        <HowItWorksItem
          number={3}
          title="Settle"
          description="Wait for the settlement. As a Maker, you just wait. As a Taker, the cross-chain message will settle the amounts"
        />
      </div>
    </div>
  );
}

type HowItWorksItemProps = {
  number: number;
  title: string;
  description: string;
};

function HowItWorksItem({ number, title, description }: HowItWorksItemProps) {
  return (
    <div className="max-w-[280px] w-full">
      <div className="flex justify-center items-center font-semibold">
        <span className="text-7xl text-primary-500 font-extrabold mr-4">
          {number}.
        </span>
        <h3 className="text-3xl font-extrabold text-center text-neutral-900">
          {title}{" "}
        </h3>
      </div>
      <p className="mt-4 text-center text-neutral-900">{description}</p>
    </div>
  );
}
