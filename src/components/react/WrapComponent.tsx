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

export default function WrapComponent() {
  const [chain, setChain] = useState<string>("EOS");
  const [from, setFrom] = useState<string>("");
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
        {chain !== "EOS" ? (
          <p>This feature is currently only supported by the EOS blockchain.</p>
        ) : null}
        {chain === "EOS" ? (
          <>
            <HoverInfo
              content="The account whose available RAM will be tokenized."
              header="Account with available RAM to tokenize"
            />
            <Input
              placeholder="username"
              value={from}
              type="text"
              onInput={(e) => setFrom(e.currentTarget.value)}
            />
            <HoverInfo
              content={`You can exchange your account's available RAM in return for tokenized RAM (WRAM). This WRAM can then be traded or sold on the market.`}
              header={`Quantity of RAM bytes to convert to WRAM`}
            />
            <Input
              placeholder="1"
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
                    name: "ramtransfer",
                    authorization: [
                      {
                        actor: from,
                        permission: "active",
                      },
                    ],
                    data: {
                      from: from,
                      to: "eosio.wram",
                      bytes: bytes,
                      memo: "",
                    },
                  },
                ]}
                operationName="ramtransfer"
                chain={chain}
                dismissCallback={() => setOpenDeeplink(false)}
                headerText={`Ready to wrap RAM via ramtransfer method!`}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
