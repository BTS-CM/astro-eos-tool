import React, { useState, useEffect, useSyncExternalStore } from "react";
import { QRCode } from "react-qrcode-logo";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { copyToClipboard } from "@/lib/common.js";

import { generateDeepLink } from "@/lib/deeplink.ts";

interface DeepLinkDialogProps {
  trxJSON: object[];
  chain: string;
  operationName: string;
  dismissCallback: (open: boolean) => void; // Assuming it's a function that returns void, adjust if needed
  headerText: string;
}

/**
 * Launches a dialog prompt, generating a deep link for the given operation.
 * Buttons link to the Beet multiwallet
 */
export default function DeepLinkDialog({
  trxJSON,
  chain,
  operationName,
  dismissCallback,
  headerText,
}: DeepLinkDialogProps) {
  const [activeTab, setActiveTab] = useState<string | null>("object");
  const [deeplink, setDeeplink] = useState<any>("");

  useEffect(() => {
    async function createDeepLink() {
      let response;
      try {
        response = await generateDeepLink(chain, trxJSON);
      } catch (error) {
        console.log({ error });
      }

      if (response) {
        setDeeplink(response);
      }
    }

    if (operationName && trxJSON) {
      console.log({ trxJSON });
      createDeepLink();
    }
  }, [operationName, trxJSON]);

  const [downloadClicked, setDownloadClicked] = useState(false);
  const handleDownloadClick = () => {
    if (!downloadClicked) {
      setDownloadClicked(true);
      setTimeout(() => {
        setDownloadClicked(false);
      }, 10000);
    }
  };

  const [qrECL, setQRECL] = useState<"M" | "L" | "Q" | "H" | undefined>("M");
  const [qrSize, setQRSize] = useState<string>("250");
  const [qrQZ, setQRQZ] = useState<string>("10");
  const [qrStyle, setQRStyle] = useState<"dots" | "squares" | "fluid" | undefined>("dots");

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        dismissCallback(open);
      }}
    >
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle>{!deeplink ? "Generating deeplink..." : <>{headerText}</>}</DialogTitle>
          <DialogDescription>
            {deeplink ? (
              <>
                Your EOS operation is ready to broadcast!
                <br />
                Choose from the methods below to broadcast to your wallet of choice.
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        {activeTab ? (
          <>
            <hr className="mt-3" />
            <div className="grid grid-cols-1 gap-3">
              <Tabs
                defaultValue="object"
                className="w-full"
                key={deeplink ? "deeplinkLoaded" : "loading"}
              >
                <TabsList
                  key={`${activeTab ? activeTab : "loading"}_TabList`}
                  className="grid w-full grid-cols-4 gap-2"
                >
                  <TabsTrigger key="TRXTab" value="object" onClick={() => setActiveTab("object")}>
                    View TRX Object
                  </TabsTrigger>
                  <TabsTrigger
                    key="DLTab"
                    value="deeplink"
                    onClick={() => setActiveTab("deeplink")}
                  >
                    Raw Deeplink
                  </TabsTrigger>
                  <TabsTrigger
                    key="QRCodeTab"
                    value="qrcode"
                    onClick={() => setActiveTab("qrcode")}
                  >
                    QR Code
                  </TabsTrigger>
                  <TabsTrigger
                    key="JSONTab"
                    value="localJSON"
                    onClick={() => setActiveTab("localJSON")}
                  >
                    Local JSON file
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="object">
                  <div className="grid w-full gap-1.5 mb-3">
                    <Label className="text-left">Transaction object JSON</Label>
                    <span className="text-left text-sm">Operation type: {operationName}</span>
                    <Textarea
                      value={JSON.stringify(trxJSON, null, 4)}
                      className="min-h-[250px]"
                      id="trxJSON"
                      readOnly
                    />
                  </div>
                  <Button
                    onClick={() => {
                      copyToClipboard(JSON.stringify(trxJSON, null, 4));
                    }}
                  >
                    Copy operation JSON
                  </Button>
                </TabsContent>
                <TabsContent value="deeplink">
                  <Label className="text-left">
                    Using a deeplink to broadcast via the BeetEOS multiwallet
                  </Label>
                  <ol className="ml-4">
                    <li>
                      Launch the BeetEOS wallet and navigate to 'Raw Link' in the menu, the wallet
                      has to remain unlocked for the duration of the broadcast.
                    </li>
                    <li>
                      From this page you can either allow all operations, or solely allow operation
                      '{operationName}' (then click save).
                    </li>
                    <li>
                      Once 'Ready for raw links' shows in Beet, then you can click the button below
                      to proceed.
                    </li>
                    <li>
                      A prompt will display, verify the contents, optionally request a Beet receipt,
                      and then broadcast the transaction onto the blockchain.
                    </li>
                    <li>
                      You won't receive a confirmation in this window, but your operation will be
                      processed within seconds on the blockchain.
                    </li>
                  </ol>
                  {deeplink ? (
                    <a href={`rawbeeteos://api?chain=${chain}&request=${deeplink}`}>
                      <Button className="mt-4 ml-3">BeetEOS</Button>
                    </a>
                  ) : null}
                </TabsContent>
                <TabsContent value="qrcode">
                  <Label className="text-left">QR code for BeetEOS broadcast</Label>
                  <ol className="ml-4">
                    <li>
                      Launch the BeetEOS wallet and navigate to 'QR Code' in the menu, the wallet
                      has to remain unlocked for the duration of the broadcast.
                    </li>
                    <li>
                      From this page you can either allow all operations, or solely allow operation
                      '{operationName}' (then click save).
                    </li>
                    <li>
                      Once 'Ready for QR codes' shows in Beet, then you can click the button below
                      to proceed.
                    </li>
                    <li>
                      A prompt will display, verify the contents, optionally request a Beet receipt,
                      and then broadcast the transaction onto the blockchain.
                    </li>
                    <li>
                      You won't receive a confirmation in this window, but your operation will be
                      processed within seconds on the blockchain.
                    </li>
                  </ol>

                  <QRCode
                    value={JSON.stringify({ actions: trxJSON })}
                    ecLevel={qrECL}
                    size={parseInt(qrSize, 10)}
                    quietZone={parseInt(qrQZ, 10)}
                    qrStyle={qrStyle}
                    bgColor={"#FFFFFF"}
                    fgColor={"#000000"}
                  />

                  <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-1">
                    <Select value={qrECL} onValueChange={(e: any) => setQRECL(e)}>
                      <SelectTrigger>
                        <SelectValue>ECL</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Error correction level</SelectLabel>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="Q">Q</SelectItem>
                          <SelectItem value="H">H</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select value={qrSize} onValueChange={setQRSize}>
                      <SelectTrigger>
                        <SelectValue>Size</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>QR code size</SelectLabel>
                          <SelectItem value="150">150</SelectItem>
                          <SelectItem value="250">250</SelectItem>
                          <SelectItem value="300">300</SelectItem>
                          <SelectItem value="350">350</SelectItem>
                          <SelectItem value="385">385</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select value={qrQZ} onValueChange={setQRQZ}>
                      <SelectTrigger>
                        <SelectValue>Padding</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Padding</SelectLabel>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select value={qrStyle} onValueChange={(e: any) => setQRStyle(e)}>
                      <SelectTrigger>
                        <SelectValue>Dot style</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Dot style</SelectLabel>
                          <SelectItem value="dots">Dots</SelectItem>
                          <SelectItem value="squares">Squares</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="localJSON">
                  <Label className="text-left">Via local file upload - ready to proceed</Label>
                  <ol className="ml-4">
                    <li>Launch the BeetEOS wallet and navigate to 'Local' in the menu.</li>
                    <li>
                      At this page either allow all, or allow just operation '{operationName}'.
                    </li>
                    <li>
                      Once at the local upload page, click the button below to download the JSON
                      file to your computer.
                    </li>
                    <li>
                      From the Local JSON file page, upload the JSON file, a prompt should then
                      appear.
                    </li>
                    <li>
                      Thoroughly verify the prompt's contents before approving any operation, also
                      consider toggling the optional receipt for post broadcast analysis and
                      verification purposes.
                    </li>
                  </ol>
                  {deeplink && downloadClicked ? (
                    <Button className="mt-4" variant="outline" disabled>
                      Downloading...
                    </Button>
                  ) : null}
                  {deeplink && !downloadClicked ? (
                    <a
                      href={`data:text/json;charset=utf-8,${deeplink}`}
                      download={`${operationName}.json`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleDownloadClick}
                    >
                      <Button className="mt-4">Download JSON file</Button>
                    </a>
                  ) : null}
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
