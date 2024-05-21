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

export default function Transfer() {
  const [chain, setChain] = useState<string>("EOS");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("0.0001");
  const [asset, setAsset] = useState<string>("EOS");
  const [memo, setMemo] = useState<string>("");
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
          value={to}
          type="text"
          onInput={(e) => setTo(e.currentTarget.value)}
        />
        <HoverInfo
          content={`The quantity of tokens you want to transfer to the other account.`}
          header={`Quantity of asset to transfer`}
        />
        <Input
          placeholder="1.0000"
          value={quantity}
          type="number"
          min="0.0001"
          step="0.0001"
          onInput={(e) => {
            let value = parseFloat(e.currentTarget.value);
            if (!isNaN(value)) {
              setQuantity(e.currentTarget.value);
            }
          }}
          onBlur={(e) => {
            const value = parseFloat(e.currentTarget.value);
            setQuantity(value < 0.0001 ? "0.0001" : value.toFixed(4));
          }}
        />
        <HoverInfo
          content={`The asset which you intend to transfer to the other account.`}
          header={`Asset to transfer`}
        />
        <Input
          placeholder="EOS"
          value={asset}
          type="text"
          onInput={(e) => setAsset(e.currentTarget.value)}
        />
        <HoverInfo
          content="A message to associate with the transfer, readable by the recipient."
          header="Optional transfer memo"
        />
        <Input
          placeholder=""
          value={memo}
          type="text"
          onInput={(e) => setMemo(e.currentTarget.value)}
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
                  to: to,
                  quantity: `${quantity} ${asset}`,
                  memo: memo,
                },
              },
            ]}
            operationName="transfer"
            chain={chain}
            dismissCallback={() => setOpenDeeplink(false)}
            headerText={`Ready to perform the requested transfer!`}
          />
        ) : null}
      </div>
    </div>
  );
}
