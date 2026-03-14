import type { CityOfMistDanger } from './model'

export function getSampleCityOfMistDanger(): CityOfMistDanger {
    return {
        name: 'Raphael Marceau',
        description:
            "A compassionate literature teacher and Rift of the Fates who refuses to let his students be trapped by prophecy, class, or expectation. Raphael reads the threads of destiny like lines on a chalkboard: he can reveal likely futures, snip a doomed path before it manifests, or knot two lives together so that one student's courage changes another's fate. He rarely acts with cruelty, but when someone threatens his pupils' freedom, he becomes a relentless guardian who manipulates chance, timing, and consequence to steer the scene toward a different ending.",
        rating: 4,
        soft_moves: [
            "Read the threads of destiny in the scene and hint at someone's next move.",
            "Foresee the grade of a student's next test if they choose to play video games instead of studying.",
            'Move one meter to the left right before a metallic object falls from a crane, as if he knew it was coming.',
        ],
        hard_moves: [
            'Sever a beneficial thread of destiny, burning a tag related to luck, preparation, or support.',
            'Tie a target to an unwanted outcome, giving them a status such as {doomed-3}, {hesitant-2}, or {misdirected-3}.',
            'Reveal the one terrible future a target fears most and give them {shaken-3}.',
            'Get away using a twist of fate (**Deny Them Something They Want**).',
        ],
        spectrums: [
            {
                name: 'hurt',
                maximum: 3,
                is_immune: true,
            },
            {
                name: 'outsmart',
                maximum: 4,
                is_immune: true,
            },
            {
                name: 'overwhelm',
                maximum: 5,
                is_immune: true,
            },
        ],
        custom_moves: [
            {
                name: 'Nobody Can Cheat Fate',
                description:
                    'When Raphael enters the scene, he is immune on his {hurt:} and {outsmart:} spectrums. The players first need to max out his {overwhelm:5} spectrum so that he cannot act fast enough to take every destiny thread into account. Once they do, the spectrums become {hurt:3} and {outsmart:4}.',
            },
            {
                name: 'Cut the Inevitable',
                description:
                    'When Raphael acts to prevent a foretold event before it fully occurs, he may reduce a developing status, interrupt a countdown, or burn a tag representing certainty, momentum, or preparation.',
            },
            {
                name: 'Borrowed Tomorrow',
                description:
                    'When Raphael wishes to protect someone from immediate danger by shifting fate, he may give that person a positive story tag such as {not today} or {meant for more}. The first time this person would be harmed, they can burn the tag to avoid the harm, for example as part of a **Face Danger** move.',
            },
        ],
        meta: {
            publication_type: 'homebrew',
            source: 'Lantern in the Mist - Sample Dangers',
            authors: ['4rtamis'],
        },
    }
}
