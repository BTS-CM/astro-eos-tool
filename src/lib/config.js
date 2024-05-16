let _blockchains = {
    EOS: {
        coreSymbol: "EOS",
        name: "EOSmainnet",
        chainId:
            "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        nodeList: [
            {
                url: "https://eos.greymass.com",
                location: "Unknown",
                region: "Unknown",
                country: "Unknown",
                operator: "Greymass",
                contact: "Greymass",
            },
        ],
    },
    BEOS: {
        coreSymbol: "BEOS",
        name: "BEOSmainnet",
        chainId:
            "cbef47b0b26d2b8407ec6a6f91284100ec32d288a39d4b4bbd49655f7c484112",
        nodeList: [
            {
                url: "https://api.beos.world",
                location: "Unknown",
                region: "Unknown",
                country: "Unknown",
                operator: "BEOS",
                contact: "BEOS",
            },
        ],
    },
    TLOS: {
        coreSymbol: "TLOS",
        name: "Telos",
        chainId:
            "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
        nodeList: [
            {
                url: "https://api.theteloscope.io",
                location: "Unknown",
                region: "Unknown",
                country: "Unknown",
                operator: "Greymass",
                contact: "Greymass",
            },
        ],
    },
};

Object.keys(_blockchains).forEach((key) => {
    _blockchains[key].identifier = key;
});

export const blockchains = _blockchains;
