import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import HoverInfo from "@/components/react/HoverInfo";
import { useState } from "react";
import DeepLinkDialog from "./DeepLinkDialog";

interface TransferProps {
  type: string;
}

export default function Staking({ type }: TransferProps) {
  const [chain, setChain] = useState<string>("EOS");
  const [from, setFrom] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");

  const [net, setNet] = useState<number>(1.0);
  const [cpu, setCPU] = useState<number>(3.0);

  const [openDeeplink, setOpenDeeplink] = useState<boolean>(false);

  return (
    <div className="grid grid-cols-1">
      <div className="col-span-1">
        <HoverInfo
          content="By default uses EOS, but may be able to support BEOS and TLOS too."
          header="Blockchain to use"
        />
        <Select value={chain} onValueChange={setChain}>
          <SelectTrigger>
            <SelectValue>{chain}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Blockchain</SelectLabel>
              <SelectItem value="EOS">EOS</SelectItem>
              <SelectItem value="TLOS">TLOS</SelectItem>
              <SelectItem value="BEOS">BEOS</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <HoverInfo
          content="An account can either pay for their own RAM, or pay for RAM on behalf of another account."
          header="Account sending the assets"
        />
        <Input
          placeholder="username"
          value={from}
          type="text"
          onInput={(e) => setFrom(e.currentTarget.value)}
        />
        <HoverInfo
          content="The account which will receive the assets you're transferring."
          header="Account receiving the assets"
        />
        <Input
          placeholder="username"
          value={receiver}
          type="text"
          onInput={(e) => setReceiver(e.currentTarget.value)}
        />
        <HoverInfo
          content={`The quantity of ${chain} to ${
            type === "stake" ? "stake to" : "unstake from"
          } NET`}
          header={`NET quantity to ${type}`}
        />
        <Input
          placeholder="1.0000"
          value={net}
          type="number"
          onInput={(e) => {
            let value = parseFloat(e.currentTarget.value);
            if (!isNaN(value)) {
              setNet(parseFloat(value.toFixed(4)));
            }
          }}
        />
        <HoverInfo
          content={`The quantity of ${chain} to ${
            type === "stake" ? "stake to" : "unstake from"
          } CPU`}
          header={`CPU quantity to ${type}`}
        />
        <Input
          placeholder="1.0000"
          value={cpu}
          type="number"
          onInput={(e) => {
            let value = parseFloat(e.currentTarget.value);
            if (!isNaN(value)) {
              setCPU(parseFloat(value.toFixed(4)));
            }
          }}
        />
        <Button className="mt-3" onClick={() => setOpenDeeplink(true)}>
          Submit
        </Button>
        {openDeeplink ? (
          <DeepLinkDialog
            trxJSON={[
              {
                account: "eosio.token",
                name: type === "stake" ? "delegatebw" : "undelegatebw",
                authorization: [
                  {
                    actor: from,
                    permission: "active",
                  },
                ],
                data: {
                  from: from,
                  receiver: receiver,
                  stake_net_quantity: `${net} ${chain}`,
                  stake_cpu_quantity: `${cpu} ${chain}`,
                  transfer: false,
                },
              },
            ]}
            operationName={type === "stake" ? "delegatebw" : "undelegatebw"}
            chain={chain}
            dismissCallback={() => setOpenDeeplink(false)}
            headerText={`Ready to ${type} CPU/NET resources!`}
          />
        ) : null}
      </div>
    </div>
  );
}