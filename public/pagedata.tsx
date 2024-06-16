import { Key } from '@/app/context';

export const keyboardData: Key[][] = [
    [
        { key: 'q', color: 'none' },
        { key: 'w', color: 'none' },
        { key: 'e', color: 'none' },
        { key: 'r', color: 'none' },
        { key: 't', color: 'none' },
        { key: 'y', color: 'none' },
        { key: 'u', color: 'none' },
        { key: 'i', color: 'none' },
        { key: 'o', color: 'none' },
        { key: 'p', color: 'none' },
    ],
    [
        { key: 'a', color: 'none' },
        { key: 's', color: 'none' },
        { key: 'd', color: 'none' },
        { key: 'f', color: 'none' },
        { key: 'g', color: 'none' },
        { key: 'h', color: 'none' },
        { key: 'j', color: 'none' },
        { key: 'k', color: 'none' },
        { key: 'l', color: 'none' },
    ],
    [
        { key: 'enter', color: 'none', class: 'w-16 text-base' },
        { key: 'z', color: 'none' },
        { key: 'x', color: 'none' },
        { key: 'c', color: 'none' },
        { key: 'v', color: 'none' },
        { key: 'b', color: 'none' },
        { key: 'n', color: 'none' },
        { key: 'm', color: 'none' },
        { key: 'backspace', color: 'none', class: 'w-16' },
    ],
];

// SAMPLE GAME HISTORY

/*
[
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "BITCH",
        "stopwatch": "00:00:04.620",
        "won": true,
        "id": "Hzqk9UKyFzljE"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "CLUMP",
        "stopwatch": "00:00:07.470",
        "won": true,
        "id": "8dVck7GyGcpf0O"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "BRAID",
        "stopwatch": "00:00:04.320",
        "won": true,
        "id": "XJjzq1B4mitcUiW"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "AMONG",
        "stopwatch": "00:00:15.300",
        "won": true,
        "id": "hqofagNtKXJQG"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "THIEF",
        "stopwatch": "00:00:06.870",
        "won": true,
        "id": "7WlB15rnJLTCx"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "CROWD",
        "stopwatch": "00:00:14.860",
        "won": true,
        "id": "wflyBTRRhl7N6AI9r"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "RAGES",
        "stopwatch": "00:00:01.300",
        "won": false,
        "id": "sG8I6rHVhW8WwjD"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "WRING",
        "stopwatch": "00:00:09.400",
        "won": true,
        "id": "y5qwtD3dE8wjOQxwW2"
    },
    {
        "guess": 4,
        "guesses": [
            "flame",
            "brick",
            "meals"
        ],
        "finalWord": "REALM",
        "stopwatch": "00:01:04.080",
        "won": true,
        "id": "5IWxpjFbPAZT0jb"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "CURBS",
        "stopwatch": "00:00:01.370",
        "won": false,
        "id": "gug4UZSCfAlUBHZAjyyf"
    },
    {
        "guess": 4,
        "guesses": [
            "flame",
            "brick",
            "podgy"
        ],
        "finalWord": "DARED",
        "stopwatch": "00:00:13.290",
        "won": false,
        "id": "K425AiZQyA5"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "SAUCY",
        "stopwatch": "00:00:15.250",
        "won": true,
        "id": "apbaCONLmGcMtYqstA"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "surer"
        ],
        "finalWord": "UTTER",
        "stopwatch": "00:01:02.120",
        "won": true,
        "id": "QjWBZLRFQ6b"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "STAFF",
        "stopwatch": "00:00:05.100",
        "won": true,
        "id": "jD1B8cNCgLUAO0SGY0CH5w"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "pools"
        ],
        "finalWord": "PLOWS",
        "stopwatch": "00:00:14.730",
        "won": false,
        "id": "gU9piMmzDslAlph8aOGcj"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "WADES",
        "stopwatch": "00:00:10.610",
        "won": true,
        "id": "AjUf4zEO"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "caste"
        ],
        "finalWord": "CASTS",
        "stopwatch": "00:00:31.270",
        "won": true,
        "id": "knTIVq9uAzJoAGM"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "CADET",
        "stopwatch": "00:00:01.580",
        "won": false,
        "id": "GrEVqRgwe"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "CADET",
        "stopwatch": "00:00:04.940",
        "won": false,
        "id": "2onBTzvQHScIUlyyj4kv"
    },
    {
        "guess": 2,
        "guesses": [
            "flame"
        ],
        "finalWord": "CADET",
        "stopwatch": "00:00:06.010",
        "won": true,
        "id": "e5o9CYgszq6"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "EIGHT",
        "stopwatch": "00:00:01.470",
        "won": false,
        "id": "S5X90QECe0D1T5ggeil"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "GUIDE",
        "stopwatch": "00:00:06.410",
        "won": true,
        "id": "o98U4ihI4jVKWOf"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "ABYSS",
        "stopwatch": "00:00:02.270",
        "won": false,
        "id": "gEnJBmG3Y"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "WIRED",
        "stopwatch": "00:00:06.330",
        "won": false,
        "id": "BnXT5X7ahx73TDAIJ7jOD"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "RUNGS",
        "stopwatch": "00:00:03.140",
        "won": false,
        "id": "N2dDMCf0ahIisbPB"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "CURED",
        "stopwatch": "00:00:01.300",
        "won": false,
        "id": "YDpJ0A0X2"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "ALGAE",
        "stopwatch": "00:00:16.180",
        "won": true,
        "id": "OxT5QAGpMb"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "paned"
        ],
        "finalWord": "PANDA",
        "stopwatch": "00:00:08.240",
        "won": true,
        "id": "4TsvcMULqGl5GnNg"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "DRUMS",
        "stopwatch": "00:00:03.360",
        "won": true,
        "id": "f4uQawHLCnJy2"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "FINAL",
        "stopwatch": "00:00:06.570",
        "won": true,
        "id": "gxSXbKWvlu"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "CHICK",
        "stopwatch": "00:00:05.110",
        "won": true,
        "id": "l2vx5TgTre"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "fifes"
        ],
        "finalWord": "FIVES",
        "stopwatch": "00:00:09.140",
        "won": true,
        "id": "zTp4CnwDyQwk0s"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "GRAFT",
        "stopwatch": "00:00:04.420",
        "won": true,
        "id": "iZDip6kcFlavsegV7"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "widen"
        ],
        "finalWord": "DIVED",
        "stopwatch": "00:00:12.040",
        "won": true,
        "id": "NxE9hmaCcfKW"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "COCKS",
        "stopwatch": "00:00:04.800",
        "won": true,
        "id": "Or2i274SOC2ZQi"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "ADORE",
        "stopwatch": "00:00:06.010",
        "won": true,
        "id": "RYN3m1Q9eFGdb"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "SIGHT",
        "stopwatch": "00:00:05.910",
        "won": true,
        "id": "hkwTLbXq"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "manor"
        ],
        "finalWord": "RAYON",
        "stopwatch": "00:00:46.900",
        "won": true,
        "id": "dLb6zQjJEOnkYNScIFVH8Q"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "warns"
        ],
        "finalWord": "RAVEN",
        "stopwatch": "00:00:49.490",
        "won": false,
        "id": "a1kUmf5qp2"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "SMITE",
        "stopwatch": "00:00:07.760",
        "won": true,
        "id": "wQb4yUCBnIoX"
    },
    {
        "guess": 4,
        "guesses": [
            "flame",
            "brick",
            "podgy"
        ],
        "finalWord": "LENDS",
        "stopwatch": "00:00:41.520",
        "won": false,
        "id": "8yjpjdsS2DlaiMhG"
    },
    {
        "guess": 4,
        "guesses": [
            "flame",
            "brick",
            "podgy"
        ],
        "finalWord": "VOWED",
        "stopwatch": "00:00:54.670",
        "won": false,
        "id": "cGVAksI7mA4Ng"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "arrow"
        ],
        "finalWord": "ARBOR",
        "stopwatch": "00:00:13.220",
        "won": true,
        "id": "iA5pArRE1uiHqL2vKi"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "BONES",
        "stopwatch": "00:00:07.760",
        "won": true,
        "id": "W0UCGqzjQLu1"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "veers"
        ],
        "finalWord": "JEERS",
        "stopwatch": "00:00:17.740",
        "won": true,
        "id": "Cu3h9JmISPDlM"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "BUYER",
        "stopwatch": "00:00:16.570",
        "won": true,
        "id": "OCpCuMtqDHJ2U"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "ATTIC",
        "stopwatch": "00:00:30.260",
        "won": false,
        "id": "iWESdczKblRfDdt0"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "EXITS",
        "stopwatch": "00:00:54.250",
        "won": false,
        "id": "VQ05TDCPo"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "trade"
        ],
        "finalWord": "TREAD",
        "stopwatch": "00:00:06.280",
        "won": true,
        "id": "7xuibxU5KYbT"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "ATTIC",
        "stopwatch": "00:00:12.580",
        "won": true,
        "id": "t07Q9lYr2IiyLL"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "STINT",
        "stopwatch": "00:00:05.630",
        "won": true,
        "id": "rgt5b9GX3lk2tFrEzWX"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "devil"
        ],
        "finalWord": "WIELD",
        "stopwatch": "00:01:35.180",
        "won": false,
        "id": "WTJNCujkC"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "spans"
        ],
        "finalWord": "SNAPS",
        "stopwatch": "00:00:08.110",
        "won": true,
        "id": "pXC9tP25NdAeUS7vOc"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "PIGGY",
        "stopwatch": "00:00:24.780",
        "won": true,
        "id": "pVSMBQN41r"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "hotly"
        ],
        "finalWord": "TILTS",
        "stopwatch": "00:00:49.700",
        "won": false,
        "id": "6vPTqNHK10GFpOy"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "PATIO",
        "stopwatch": "00:01:59.010",
        "won": false,
        "id": "6ml3okvrhgTj"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "lowly"
        ],
        "finalWord": "LOYAL",
        "stopwatch": "00:00:28.560",
        "won": true,
        "id": "tIZmGyf4xSod5gZzYu"
    },
    {
        "guess": 4,
        "guesses": [
            "flame",
            "brick",
            "podgy"
        ],
        "finalWord": "YACHT",
        "stopwatch": "00:00:37.380",
        "won": false,
        "id": "Fh6Be54U3gA4r36uOO"
    },
    {
        "guess": 3,
        "guesses": [
            "flame",
            "brick"
        ],
        "finalWord": "HEATH",
        "stopwatch": "00:01:46.050",
        "won": false,
        "id": "hCqJr93jSUyFVLLvD"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "shunt",
            "podgy",
            "flame"
        ],
        "finalWord": "READY",
        "stopwatch": "00:01:46.820",
        "won": true,
        "id": "qC1tIDGGd9Gt"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "wicks"
        ],
        "finalWord": "CIVIC",
        "stopwatch": "00:00:44.510",
        "won": true,
        "id": "q2mfPFBUUj9Tsx13t"
    },
    {
        "guess": 3,
        "guesses": [
            "flame",
            "brick"
        ],
        "finalWord": "STOUT",
        "stopwatch": "00:02:04.280",
        "won": false,
        "id": "DPbsNm9Eje5idAfShLkI"
    },
    {
        "guess": 4,
        "guesses": [
            "flame",
            "place",
            "place"
        ],
        "finalWord": "PROWL",
        "stopwatch": "00:02:37.300",
        "won": false,
        "id": "Cuo6SEHX0bGThWUmLB2Nc"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "spill",
            "swift",
            "swing"
        ],
        "finalWord": "SWISH",
        "stopwatch": "00:00:41.170",
        "won": false,
        "id": "F3KdOb1LRYSwhRELj"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "place",
            "trace",
            "grade",
            "brake"
        ],
        "finalWord": "ERASE",
        "stopwatch": "00:00:38.320",
        "won": true,
        "id": "btZNPg3ZQ9nYZFKxFJD"
    },
    {
        "guess": 3,
        "guesses": [
            "flame",
            "feels"
        ],
        "finalWord": "MISTY",
        "stopwatch": "00:01:19.620",
        "won": false,
        "id": "IIZxH5PVtRJdgE"
    },
    {
        "guess": 3,
        "guesses": [
            "flame",
            "plaid"
        ],
        "finalWord": "HIGHS",
        "stopwatch": "00:00:33.390",
        "won": false,
        "id": "Syw3dOgTteqe3S70zP1"
    },
    {
        "guess": 4,
        "guesses": [
            "flame",
            "brick",
            "podgy"
        ],
        "finalWord": "OUTDO",
        "stopwatch": "00:02:56.500",
        "won": false,
        "id": "lpVjF3Cs2PCAkXGT"
    },
    {
        "guess": 2,
        "guesses": [
            "podgy"
        ],
        "finalWord": "STRUT",
        "stopwatch": "00:00:15.860",
        "won": false,
        "id": "PmXsYeoc66m"
    },
    {
        "guess": 1,
        "guesses": [],
        "finalWord": "LOCKS",
        "stopwatch": "00:00:48.980",
        "won": false,
        "id": "XQUhTctCAIJq"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "ditto"
        ],
        "finalWord": "outdo",
        "stopwatch": "00:01:01.980",
        "won": false,
        "id": "M3PB8OJYGcrsG85dGWnaU"
    },
    {
        "guess": 2,
        "guesses": [
            "podgy"
        ],
        "finalWord": "GRAND",
        "stopwatch": "00:00:14.200",
        "won": false,
        "id": "4ScgGPOjt8gl5akZA"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "ditto"
        ],
        "finalWord": "outdo",
        "stopwatch": "00:01:00.750",
        "won": true,
        "id": "Ql3hSbwPbLw2Ec"
    },
    {
        "guess": 6,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt",
            "ditto"
        ],
        "finalWord": "outdo",
        "stopwatch": "00:00:33.110",
        "won": true,
        "id": "HuULS7s6"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "outdo",
        "stopwatch": "00:00:20.290",
        "won": false,
        "id": "ykzoAIWzPU6AgjQGFFb8h"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "outdo",
        "stopwatch": "00:00:21.280",
        "won": false,
        "id": "WzgJNfWMF3R8XZRHaz3xk"
    },
    {
        "guess": 5,
        "guesses": [
            "flame",
            "brick",
            "podgy",
            "shunt"
        ],
        "finalWord": "outdo",
        "stopwatch": "00:02:06.440",
        "won": false,
        "id": "HKD6MI6oaFkx5iqyj1"
    },
    {
        "guess": 3,
        "guesses": [
            "flame",
            "brick"
        ],
        "finalWord": "LAKES",
        "stopwatch": "00:00:45.600",
        "won": false,
        "id": "jEApG1gDmee"
    },
    {
        "guess": 3,
        "guesses": [
            "flame",
            "brick"
        ],
        "finalWord": "outdo",
        "stopwatch": "00:00:48.380",
        "won": false,
        "id": "iCz7rg46KGkF854iGQ6H4i",
        "hardMode": true
    },
    {
        "guess": 3,
        "guesses": [
            "raise",
            "place"
        ],
        "finalWord": "ENACT",
        "stopwatch": "00:00:11.220",
        "won": true,
        "id": "mV7dORI4SZYlM",
        "hardMode": true
    }
]
*/
