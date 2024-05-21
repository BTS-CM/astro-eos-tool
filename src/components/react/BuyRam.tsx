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

export default function BuyRam() {
  const [chain, setChain] = useState<string>("EOS");
  const [payer, setPayer] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [quant, setQuant] = useState<string>("0.0001");
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
          header="Account paying for the RAM"
        />
        <Input
          placeholder="username"
          value={payer}
          type="text"
          onInput={(e) => setPayer(e.currentTarget.value)}
        />
        <HoverInfo
          content="The account that will receive the RAM."
          header="Account receiving the RAM"
        />
        <Input
          placeholder="username"
          value={receiver}
          type="text"
          onInput={(e) => setReceiver(e.currentTarget.value)}
        />
        <HoverInfo
          content={`The network will exchange all this ${chain} in return for RAM`}
          header={`Quantity of ${chain} to sell for RAM`}
        />
        <Input
          placeholder="1.0000"
          value={quant}
          type="number"
          min="0.0001"
          step="0.0001"
          onInput={(e) => {
            setQuant(e.currentTarget.value);
          }}
          onBlur={(e) => {
            const value = parseFloat(e.currentTarget.value);
            setQuant(value < 0.0001 ? "0.0001" : value.toFixed(4));
          }}
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
                name: "buyram",
                authorization: [
                  {
                    actor: payer,
                    permission: "active",
                  },
                ],
                data: {
                  payer: payer,
                  receiver: receiver,
                  quant: `${quant} EOS`,
                },
              },
            ]}
            operationName="buyram"
            chain={chain}
            dismissCallback={() => setOpenDeeplink(false)}
            headerText={`Ready to buy ram with EOS!`}
          />
        ) : null}
      </div>
    </div>
  );
}
