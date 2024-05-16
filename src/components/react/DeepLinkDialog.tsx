import React, { useState, useEffect, useSyncExternalStore } from "react";
import { QRCode } from "react-qrcode-logo";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
 * Buttons link to the BeetEOS multiwallet
 */
export default function DeepLinkDialog({
  trxJSON,
  chain,
  operationName,
  dismissCallback,
  headerText,
}: DeepLinkDialogProps) {
  const [activeTab, setActiveTab] = useState<string | null>();
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

  const [qrAccordionOpen, setQRAccordionOpen] = useState<string>("qr");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

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
                {!activeTab ? (
                  <>
                    <br />
                    Select a method below to proceed.
                  </>
                ) : null}
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full w-full rounded-md">
          {!activeTab ? (
            <div className="grid sm:grid-cols-1 md:grid-cols-4 gap-2">
              <Button onClick={() => setActiveTab("object")}>View TRX Object</Button>
              <Button onClick={() => setActiveTab("deeplink")}>Raw Deeplink</Button>
              <Button onClick={() => setActiveTab("qrcode")}>QR Code</Button>
              <Button onClick={() => setActiveTab("localJSON")}>Local JSON file</Button>
            </div>
          ) : null}
          {activeTab && activeTab === "object" ? (
            <>
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
            </>
          ) : null}
          {activeTab && activeTab === "deeplink" ? (
            <>
              <Accordion type="single" collapsible className="w-full" defaultValue="deeplink">
                <AccordionItem value="deeplink">
                  <AccordionTrigger>Via raw deeplink - ready to proceed</AccordionTrigger>
                  <AccordionContent>
                    <ol className="ml-4">
                      <li>
                        Launch the BeetEOS wallet and navigate to 'Raw Link' in the menu, the wallet
                        has to remain unlocked for the duration of the broadcast.
                      </li>
                      <li>
                        From this page you can either allow all operations, or solely allow
                        operation '{operationName}' (then click save).
                      </li>
                      <li>
                        Once 'Ready for raw links' shows in BeetEOS, then you can click the button
                        below to proceed.
                      </li>
                      <li>
                        A prompt will display, verify the contents, optionally request a BeetEOS
                        receipt, and then broadcast the transaction onto the blockchain.
                      </li>
                      <li>
                        You won't receive a confirmation in this window, but your operation will be
                        processed within seconds on the blockchain.
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {deeplink ? (
                <a href={`rawbeeteos://api?chain=${chain}&request=${deeplink}`}>
                  <Button className="mt-4">Launch BeetEOS deeplink prompt</Button>
                </a>
              ) : null}
            </>
          ) : null}
          {activeTab && activeTab === "qrcode" ? (
            <>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue={qrAccordionOpen}
                value={qrAccordionOpen}
              >
                <AccordionItem value="qr">
                  <AccordionTrigger
                    className="pb-1 pt-1"
                    onClick={() => setQRAccordionOpen(qrAccordionOpen === "qr" ? "" : "qr")}
                  >
                    Via QR code - ready to proceed
                  </AccordionTrigger>
                  <AccordionContent className="mt-0 pt-0 mb-1 pb-0">
                    <ul className="ml-2 list-disc [&>li]:mt-2">
                      <li>
                        Launch the BeetEOS wallet and navigate to 'QR Code' in the menu, the wallet
                        has to remain unlocked for the duration of the broadcast.
                      </li>
                      <li>
                        From this page you can either allow all operations, or solely allow
                        operation '{operationName}' (then click save).
                      </li>
                      <li>
                        Once 'Ready for QR codes' shows in BeetEOS, then you can click the button
                        below to proceed.
                      </li>
                      <li>
                        A prompt will display, verify the contents, optionally request a BeetEOS
                        receipt, and then broadcast the transaction onto the blockchain.
                      </li>
                      <li>
                        You won't receive a confirmation in this window, but your operation will be
                        processed within seconds on the blockchain.
                      </li>
                    </ul>
                    <Button className="h-5 mt-1 mb-1" onClick={() => setQRAccordionOpen("")}>
                      Hide info
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                <div className="grid grid-cols-1 gap-1">
                  <Select value={qrECL} onValueChange={(e: any) => setQRECL(e)}>
                    <SelectTrigger>
                      <SelectValue>Error correction level: {qrECL}</SelectValue>
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
                      <SelectValue>Size: {qrSize}</SelectValue>
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
                      <SelectValue>Padding: {qrQZ}</SelectValue>
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
                      <SelectValue>Dot style: {qrStyle}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Dot style</SelectLabel>
                        <SelectItem value="dots">Dots</SelectItem>
                        <SelectItem value="squares">Squares</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Button onClick={() => setShowQRCode(true)}>Show QR code</Button>

                  <Dialog
                    open={showQRCode}
                    onOpenChange={(open) => {
                      setShowQRCode(open);
                    }}
                  >
                    <DialogContent className="sm:max-w-[800px] bg-white">
                      <DialogHeader>
                        <DialogTitle>QR code</DialogTitle>
                        <DialogDescription>
                          Scan this code within the BeetEOS wallet to broadcast the operation.
                        </DialogDescription>
                      </DialogHeader>
                      <div>
                        <QRCode
                          value={JSON.stringify({ actions: trxJSON })}
                          ecLevel={qrECL}
                          size={parseInt(qrSize, 10)}
                          quietZone={parseInt(qrQZ, 10)}
                          qrStyle={qrStyle}
                          bgColor={"#FFFFFF"}
                          fgColor={"#000000"}
                        />
                      </div>
                      <Button onClick={() => setShowQRCode(false)}>Back</Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </>
          ) : null}
          {activeTab && activeTab === "localJSON" ? (
            <>
              <Accordion type="single" collapsible className="w-full" defaultValue="localJSON">
                <AccordionItem value="localJSON">
                  <AccordionTrigger>Via local file upload - ready to proceed</AccordionTrigger>
                  <AccordionContent>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Label className="text-left"></Label>

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
                  <Button className="mt-2">Download JSON file</Button>
                </a>
              ) : null}
            </>
          ) : null}
          {activeTab ? (
            <Button
              onClick={() => {
                setActiveTab(null);
              }}
              variant="outline"
              className="mt-2 ml-2"
            >
              Go back
            </Button>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
