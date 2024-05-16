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

export default function BuyRamBytes() {
  const [chain, setChain] = useState<string>("EOS");
  const [payer, setPayer] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [bytes, setBytes] = useState<number>(1);
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
          content="An account can either pay for their own RAM bytes, or pay for RAM bytes on behalf of another account."
          header="Account paying for the RAM bytes"
        />
        <Input
          placeholder="username"
          value={payer}
          type="text"
          onInput={(e) => setPayer(e.currentTarget.value)}
        />
        <HoverInfo
          content="The account that will receive the RAM bytes."
          header="Account receiving the RAM bytes"
        />
        <Input
          placeholder="username"
          value={receiver}
          type="text"
          onInput={(e) => setReceiver(e.currentTarget.value)}
        />
        <HoverInfo content="The number of bytes to purchase." header="Number of bytes" />
        <Input
          placeholder="bytes"
          value={bytes}
          type="number"
          onInput={(e) => setBytes(parseInt(e.currentTarget.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setOpenDeeplink(true);
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
                account: "eosio",
                name: "buyrambytes",
                authorization: [
                  {
                    actor: payer,
                    permission: "active",
                  },
                ],
                data: {
                  payer: payer,
                  receiver: receiver,
                  bytes: bytes,
                },
              },
            ]}
            operationName="buyrambytes"
            chain={chain}
            dismissCallback={() => setOpenDeeplink(false)}
            headerText={`Ready to buy ram bytes!`}
          />
        ) : null}
      </div>
    </div>
  );
}
