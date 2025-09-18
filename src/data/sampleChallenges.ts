import { is } from "zod/v4/locales";

// A rich sample that exercises almost every editor/preview feature.
export function getSampleChallenge() {
  return {
    name: "Lantern-Warden of the Wilds",
    description:
      "An ancient wolf-spirit roams the borders of human lands at dusk, guiding beasts away from hunts with a spectral lantern that burns like moonfire. Those who meet the Warden may strike a {pact} for safe passage, but breaking such oaths carries dire consequences.",
    rating: 3,
    roles: ["Mystery", "Watcher"],
    limits: [
      // classic finite
      {
        name: "Harm",
        level: 4,
        is_immune: false,
        is_progress: false,
        on_max: null,
      },
      {
        name: "Bargain",
        level: 3,
        is_immune: false,
        is_progress: true,
        on_max:
          "{pact with the warden} becomes a story theme for the night and the Hero can wander the woods freely.",
      },
      // immune example
      {
        name: "Banish",
        level: 1,
        is_immune: true,
        is_progress: false,
        on_max: null,
      },
      // progress example
      {
        name: "Track",
        level: 5,
        is_immune: false,
        is_progress: true,
        on_max:
          "Hunters lose the trail and drift into the thickets ({disoriented-3}) and a **New Challenge**: The Mistbound Pack, manifests.",
      },
    ],
    special_features: [
      {
        name: "Moon-Lantern's Call",
        description:
          "When the lantern glows, beasts heed the Warden. PCs resisting its pull face {dazed-1} or **scratch a tag** representing their resolve.",
      },
      {
        name: "Pact of Steadfast Paths",
        description:
          "If the party honors the Warden's terms, gain {safe-passage-2} until daybreak. Breaking the pact inflicts {!oath-breaker}.",
      },
    ],
    tags_and_statuses: [
      // plain tag
      "{scent of old forests}",
      // status with value
      "{moonlit-shroud-2}",
      // mixed line
      "{watchful-1} or {unyielding-2}, depending on the hunters' resolve",
      // weakness
      "{!bound by oaths}",
    ],
    mights: [
      // origin level
      {
        name: "Spirit Nature",
        level: "origin",
        vulnerability: "cold iron bells",
      },
      // adventure level
      {
        name: "Lantern of the Mist",
        level: "adventure",
        vulnerability: "shattered light",
      },
      // greatness level
      { name: "Voices of the Pack", level: "greatness", vulnerability: null },
    ],
    threats: [
      {
        name: "Unravel the Hunt",
        description:
          "Scatter the hunters' lines and turn their hounds astray under drifting fog",
        consequences: [
          "Hounds falter and circle ({confused-2}); scratch a tag related to the hounds",
          "Lantern-glare blinds a marksman ({blinded-2}) until they douse their torch",
          "A lone hunter wanders to the brink of the ravine (**Ill Tidings** or {imperiled-3})",
        ],
      },
      {
        name: "Summon the Mistbound",
        description:
          "A chorus of spectral wolves pads through the haze, hemming intruders in",
        consequences: [
          "Echoing howls sap courage ({shaken-2})",
          "The way back vanishes behind bramble illusions: {lost-2}",
          "A spectral wolf steps forth—parley or be cornered (**New Challenge**: Spectral Wolf and {pressured-3})",
        ],
      },
    ],
    general_consequences: [
      "Cold moonlight bites at exposed skin ({numbed-1})",
      "The forest itself watches (**Exposure** or scratch a tag of stealth)",
    ],
    meta: {
      publication_type: "homebrew",
      source: "Lantern in the Mist - Sample Challenges",
      authors: ["4rtamis"],
      page: undefined,
    },
  };
}
