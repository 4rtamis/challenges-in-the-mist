import { z } from 'zod'

/** =========================
 *  Enums
 *  ========================= */

export const MightLevelEnum = z
    .enum(['origin', 'adventure', 'greatness'])
    .meta({
        description:
            "Relative scale of a Challenge's Might or influence in the fiction.",
        examples: ['origin', 'adventure', 'greatness'],
    })
export type MightLevel = z.infer<typeof MightLevelEnum>

export const PublicationTypeEnum = z
    .enum(['official', 'third_party', 'cauldron', 'homebrew'])
    .meta({
        description:
            'Where this content comes from. Use to help downstream tools filter sources.',
        examples: ['official', 'cauldron'],
    })
export type PublicationType = z.infer<typeof PublicationTypeEnum>

/** =========================
 *  Subschemas
 *  ========================= */

export const MightSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Might name is required')
            .meta({
                description:
                    'A short label for the aspect in which this Challenge Mighty.',
                examples: ['Horse-sized', 'Cunning spirit', 'Organized crime'],
            }),
        level: MightLevelEnum.default('adventure').meta({
            description:
                "Level of this Might. Use to decide when a Hero's action could be Favored of Imperiled.",
            examples: ['origin', 'adventure', 'greatness'],
        }),
        vulnerability: z
            .string()
            .nullable()
            .optional()
            .meta({
                description:
                    'Optional narrative situations in which the Might in this aspect it nullified and considered Origin.',
                examples: ['Silver weapons', 'Appeased by gifts'],
            }),
    })
    .meta({
        description:
            'Describes an aspect in which this Challenge is Mighty, the level of that Might, and any vulnerabilities.',
    })

export const LimitSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Limit name is required')
            .meta({
                description:
                    'Action to undertake in order to overcome the Challenge.',
                examples: ['Avoid', 'Harm', 'Subdue'],
            }),
        level: z.coerce
            .number()
            .int()
            .min(1)
            .max(6)
            .default(1)
            .meta({
                description:
                    'Tier that relevant statuses need to reach in order to overcome the Challenge.',
                examples: [3, 4],
            }),
        is_immune: z
            .boolean()
            .optional()
            .default(false)
            .meta({
                description:
                    "If true, the Challenge ignores statuses targeting this Limit's vector.",
                examples: [false],
            }),
        is_progress: z
            .boolean()
            .optional()
            .default(false)
            .meta({
                description:
                    'If true, this Limit acts like a progress track that builds up towards a special outcome (see `on_max`).',
                examples: [true],
            }),
        on_max: z
            .string()
            .nullable()
            .optional()
            .meta({
                description:
                    'Special Feature triggered as the outcome of a progress Limit (see `is_progress`). Supports inline Markdown.',
                examples: [
                    'Everyone in the community becomes {distrustful-3} of one another.',
                    'Deliver one of the **Invoke Detities** Consequences to the entire village.',
                ],
            }),
    })
    .meta({
        description:
            'Describes a certain way to overcome (or not) a Challenge by giving it the right type and tier of status.',
    })

export const ThreatSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Threat name is required')
            .meta({
                description:
                    'Action that the Challenge is begining to take, prompting the Hero to take action to avoid or prevent the Threat from materializing.',
                examples: ['Assert authority', 'Ambush', 'Conjure'],
            }),
        description: z
            .string()
            .trim()
            .min(1, 'Threat description is required')
            .max(100, 'Threat description must be 100 characters or fewer')
            .meta({
                description:
                    'Concise text that elaborates how this Threat looks or escalates. Supports inline Markdown.',
                examples: [
                    'Appear at the most inopportune time, making things awkward',
                    'Lift its arms as the ground begins to shake',
                    'Show up, present a copy of the {signed infernal contract} and demand obedience',
                ],
            }),
        consequences: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'Consequence cannot be empty')
                    .meta({
                        description:
                            "Outcome of the Challenge's action if the Hero's action generates Consequences or if the Threat is ignored. Supports inline Markdown.",
                        examples: [
                            'Give {nervous-2} to a bystander.',
                            'Raise the alarm (**Exposure**).',
                            'Time passes as the ferry creeps forward ({time-passes-1}).',
                        ],
                    })
            )
            .min(1, 'At least one Consequence is required')
            .meta({
                description:
                    'List of concrete, referenceable outcomes the Threat can deliver. Supports inline Markdown.',
            }),
    })
    .meta({
        description:
            'A reusable action the Challenge can take, with its possible outcomes.',
    })

export const SpecialFeatureSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Special Feature name is required')
            .meta({
                description: 'Name of the Special Feature.',
                examples: ['Petty grudge', 'Dramatic feign', 'Guarded'],
            }),
        description: z
            .string()
            .trim()
            .min(1, 'Special Feature description is required')
            .meta({
                description:
                    'Text describing the Special Feature\'s trigger ("When this happens...") and effect ("... do this."). Supports inline Markdown.',
                examples: [
                    'If offended, gains {spiteful-3} and cannot be obliged until {appeased-3}.',
                    "The Narrator may choose to deliver the Challenge's COnsequence during Establish instead of in the Consequence phase.",
                    "Whenever someone who could be linked to the Plotting Courtier leans of the Heroes' actions or whereabouts (**Exposure**), the Plotting Courtier gains a tag for it.",
                ],
            }),
    })
    .meta({
        description:
            'Rule unique to the Challenge or an ability that cannot be expressed with Threats and Consequences, tags, statuses, Limits or Might.',
    })

export const MetaSchema = z
    .object({
        publication_type: PublicationTypeEnum.default('homebrew').meta({
            description:
                "Classifies the Challenge's source to aid cataloging and tooling.",
            examples: ['official', 'cauldron'],
        }),
        source: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Source title (book, supplement, PDF) where this Challenge appears.',
                examples: [
                    'Legend in the Mist - Core Book Volume II - The Narrator',
                    'Lantern in the Mist - Sample Challenges',
                ],
            }),
        authors: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'Author name cannot be empty')
                    .meta({
                        description: 'One credited author name.',
                        examples: ['Son of Oak', '4rtamis'],
                    })
            )
            .optional()
            .meta({
                description: 'List of credited authors or contributors.',
            }),
        page: z.coerce
            .number()
            .int()
            .min(1)
            .optional()
            .meta({
                description: 'Page number (if relevant to the source).',
                examples: [112, 126, 394],
            }),
    })
    .meta({
        description:
            "Attribution and cataloging fields for the Challenge's origin.",
    })

/** =========================
 *  Root schema
 *  ========================= */

export const LegendInTheMistChallengeSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Challenge name is required')
            .default('Untitled Challenge')
            .meta({
                description: 'The name/title of the Challenge.',
                examples: ['Avoided Acquaintance', 'Commoner', 'Boggart'],
            }),
        description: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Short Narrator-facing summary of what this Challenge is. Supports inline Markdown.',
                examples: [
                    'A starving predator prowls this wilderness and it will not balk at bony travellers to sustain itself. When it pounces, its {stealthy-} status hinders reaction and is then removed.',
                    'Infernal spirits from the lowest circles of Hell, bound to mortal service by signed contracts. When someone becomes entirely {agreable-} (their Limit is reached), they sign an agreement with the Devil and receive a {signed infernal contract}. The Devil can now start using **Fine Print** and the devastating **Compel** Consequences, which cannot ordinarily be resisted.',
                    '',
                ],
            }),
        rating: z.coerce
            .number()
            .int()
            .min(1)
            .max(5)
            .default(1)
            .meta({
                description:
                    "General indication of the Challenge's difficulty level (1-5).",
                examples: [1, 3, 5],
            }),
        roles: z
            .array(
                z
                    .string()
                    .trim()
                    .min(1, 'A role cannot be empty')
                    .meta({
                        description:
                            'Keyword that defines how this Challenge behaves in a scene.',
                        examples: ['Watcher', 'Aggressor', 'Obstacle'],
                    })
            )
            .optional()
            .meta({
                description:
                    "Define the Challenge's possible behaviors in a scene (see Legend in the Mist - Core Book Volume II - The Narrator, page 110).",
            }),
        tags_and_statuses: z
            .array(
                z
                    .string()
                    .trim()
                    .meta({
                        description:
                            'Story tags and statuses belonging to the Challenge upon entering the scene. Supports inline Markdown.',
                        examples: [
                            '{alert-1}',
                            'Three tags the imitated person possesses',
                            '{sword}, {dagger} or {bow}',
                        ],
                    })
            )
            .optional()
            .meta({
                description:
                    "Describe the Challenge's features and its condition upon entering the scene. Supports inline Markdown.",
            }),
        mights: z.array(MightSchema).optional().meta({
            description:
                'Describe the aspects in which this Challenge is Mighty, the levels of those Might, and any vulnerabilities.',
        }),
        limits: z.array(LimitSchema).optional().meta({
            description:
                'Define when the Challenge is overcome by using Detailed outcomes.',
        }),
        threats: z.array(ThreatSchema).optional().meta({
            description:
                'Typical actions of the Challenge structured in Threats and their possible related Consequences.',
        }),
        general_consequences: z
            .array(
                z.string().meta({
                    description:
                        "Action the Challenge might take when a Hero's action generates Consequences, regardless of Threat. Supports inline Markdown.",
                    examples: [
                        'You get lost in the revelry ({time-passes-1}).',
                        "Figure out someone's place of hiding (**Exposure**).",
                        'Sniff around (remove two tiers from a sneaking status).',
                    ],
                })
            )
            .optional()
            .meta({
                description:
                    "Describe the actions the Challenge can generally take when a Hero's action generates Consequences. Supports inline Markdown.",
            }),
        special_features: z.array(SpecialFeatureSchema).optional().meta({
            description:
                'Rules unique to the Challenge or abilities that cannot be expressed with Threats and Consequences, tags, statuses, Limits or Might.',
        }),
        meta: MetaSchema.optional().meta({
            description:
                "Attribution and cataloging fields for the Challenge's origin.",
        }),
    })
    .meta({
        description:
            'Legend in the Mist - Challenge profile, used to represent NPCs and situations that pose a threat to the Heroes, their Quests, or their goals.',
    })

/** =========================
 *  Exported TS types
 *  ========================= */
export type Might = z.infer<typeof MightSchema>
export type Limit = z.infer<typeof LimitSchema>
export type Threat = z.infer<typeof ThreatSchema>
export type SpecialFeature = z.infer<typeof SpecialFeatureSchema>
export type ChallengeMeta = z.infer<typeof MetaSchema>
export type LegendInTheMistChallenge = z.infer<
    typeof LegendInTheMistChallengeSchema
>
