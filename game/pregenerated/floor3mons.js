const munchlax1 = {
  "name": "munchlax1",
  "proper_name": "Munchlax",
  "current_hp": 135,
  "stats":{
    "hp": 135,
    "attack": 85,
    "defense": 40,
    "special-attack": 40,
    "special-defense": 85,
    "speed": 5,
  },
  "statChanges": {
    "attack": 0,
    "defense": 0,
    "special-attack": 0,
    "special-defense": 0,
    "speed": 0,
  },
  "moves": [
    "crunch",
    "bulldoze",
    "defense-curl",
    "charm",
  ],
  "types": ["normal"],
  "height": 6,
  "weight": 1050,
  "sprites": {
    "idle": {
      url: `/sprites/munchlax-idl.gif`,
      length: 1000,
    },
    "attack": {
      url: `/sprites/munchlax-atk.gif`,
      length: 800,
    },
    "hit": {
      url: `/sprites/munchlax-hit.gif`,
      length: 880,
    },
  }
}

const munchlax2 = {
  "name": "munchlax2",
  "proper_name": "Munchlax",
  "current_hp": 135,
  "stats":{
    "hp": 135,
    "attack": 85,
    "defense": 40,
    "special-attack": 40,
    "special-defense": 85,
    "speed": 5,
  },
  "statChanges": {
    "attack": 0,
    "defense": 0,
    "special-attack": 0,
    "special-defense": 0,
    "speed": 0,
  },
  "moves": [
    "crunch",
    "bulldoze",
    "defense-curl",
    "charm",
  ],
  "types": ["dark"],
  "height": 6,
  "weight": 1050,
  "sprites": {
    "idle": {
      url: `/sprites/munchlax2-idl.gif`,
      length: 840,
    },
    "attack": {
      url: `/sprites/munchlax2-atk.gif`,
      length: 900,
    },
    "hit": {
      url: `/sprites/munchlax2-hit.gif`,
      length: 640,
    },
  }
}

const munchlax3 = {
  "name": "munchlax3",
  "proper_name": "Munchlax",
  "current_hp": 135,
  "stats":{
    "hp": 135,
    "attack": 85,
    "defense": 40,
    "special-attack": 40,
    "special-defense": 85,
    "speed": 5,
  },
  "statChanges": {
    "attack": 0,
    "defense": 0,
    "special-attack": 0,
    "special-defense": 0,
    "speed": 0,
  },
  "moves": [
    "fire-punch",
    "bulldoze",
    "defense-curl",
    "charm",
  ],
  "types": ["fire"],
  "height": 6,
  "weight": 1050,
  "sprites": {
    "idle": {
      url: `/sprites/munchlax3-idl.gif`,
      length: 1040,
    },
    "attack": {
      url: `/sprites/munchlax3-atk.gif`,
      length: 800,
    },
    "hit": {
      url: `/sprites/munchlax3-hit.gif`,
      length: 760,
    },
  }
}

const snorlax3 = {
  "name": "snorlax3",
  "proper_name": "Snorlax",
  "current_hp": 200,
  "stats": {
    "hp": 200,
    "attack": 130,
    "defense": 85,
    "special-attack": 65,
    "special-defense": 80,
    "speed": 100,
  },
  "statChanges": {
    "attack": 0,
    "defense": 0,
    "special-attack": 0,
    "special-defense": 0,
    "speed": 0,
  },
  "moves": [
    "gunk-shot",
    "wild-charge",
    "shadow-ball",
    "swords-dance",
  ],
  "types": ["normal"],
  "height": 21,
  "weight": 4600,
  "sprites": {
    "idle": {
      url: `/sprites/snorlax-idl.gif`,
      length: 920,
    },
    "attack": {
      url: `/sprites/snorlax-atk.gif`,
      length: 1120,
    },
    "hit": {
      url: `/sprites/snorlax-hit.gif`,
      length: 760,
    },
  }
}

module.exports = { munchlax1, munchlax2, munchlax3, snorlax3 }