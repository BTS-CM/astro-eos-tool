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

export default function UnwrapComponent() {
  const [chain, setChain] = useState<string>("EOS");
  const [from, setFrom] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
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
          content="This is the account which will perform the unwrap action. Converting WRAM back into usable RAM."
          header="Account which will convert its WRAM back into usable RAM"
        />
        <Input
          placeholder="username"
          value={from}
          type="text"
          onInput={(e) => setFrom(e.currentTarget.value)}
        />
        <HoverInfo
          content={`Quantity of WRAM in your account's balance which will be converted back to usable RAM.`}
          header={`Quantity of WRAM to unwrap back to usable RAM`}
        />
        <Input
          placeholder="1"
          value={quantity}
          type="number"
          onInput={(e) => setQuantity(parseInt(e.currentTarget.value))}
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
                account: "eosio.token",
                name: "transfer",
                authorization: [
                  {
                    actor: from,
                    permission: "active",
                  },
                ],
                data: {
                  from: from,
                  to: "eosio.wram",
                  quantity: `${quantity} WRAM`,
                  memo: "",
                },
              },
            ]}
            operationName="transfer"
            chain={chain}
            dismissCallback={() => setOpenDeeplink(false)}
            headerText={`Ready to unwrap WRAM via transfer method!`}
          />
        ) : null}
      </div>
    </div>
  );
}
