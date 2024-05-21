import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

import MenuRow from "@/components/react/menurow";

import {
  ArrowUpIcon,
  QuestionMarkCircledIcon,
  DoubleArrowUpIcon,
  ThickArrowUpIcon,
  PaperPlaneIcon,
  LockOpen2Icon,
  LockClosedIcon,
  HomeIcon,
  ThickArrowDownIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";

export default function Menu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <HamburgerMenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-3 p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder={"Search.."} />
          <CommandList>
            <CommandEmpty>Not found...</CommandEmpty>
            <CommandGroup heading={"EOS Astro NFT tool"}>
              <MenuRow url="/" text="Homepage" icon={<HomeIcon className="w-4 h-4 mr-3" />} />
              <MenuRow
                url="/buyrambytes"
                text="Buy RAM Bytes"
                icon={<ArrowUpIcon className="w-4 h-4 mr-3" />}
              />
              <MenuRow
                url="/buyram"
                text="Buy RAM with EOS"
                icon={<DoubleArrowUpIcon className="w-4 h-4 mr-3" />}
              />
              <MenuRow
                url="/stake"
                text="Stake CPU/NET"
                icon={<ThickArrowUpIcon className="w-4 h-4 mr-3" />}
              />
              <MenuRow
                url="/unstake"
                text="Unstake CPU/NET"
                icon={<ThickArrowDownIcon className="w-4 h-4 mr-3" />}
              />
              <MenuRow
                url="/transfer"
                text="Transfer"
                icon={<PaperPlaneIcon className="w-4 h-4 mr-3" />}
              />
              <MenuRow
                url="/wrap"
                text="Wrap RAM"
                icon={<LockClosedIcon className="w-4 h-4 mr-3" />}
              />
              <MenuRow
                url="/unwrap"
                text="Unwrap WRAM"
                icon={<LockOpen2Icon className="w-4 h-4 mr-3" />}
              />
              <MenuRow
                url="/trade"
                text="Where to trade"
                icon={<UpdateIcon className="w-4 h-4 mr-3" />}
              />
              <MenuRow
                url="/about"
                text="About"
                icon={<QuestionMarkCircledIcon className="w-4 h-4 mr-3" />}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
