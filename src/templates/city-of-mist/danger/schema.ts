import { z } from 'zod'

/** =========================
 *  Enums
 *  ========================= */

export const PublicationTypeEnum = z
    .enum(['official', 'third_party', 'cauldron', 'homebrew'])
    .meta({
        description:
            'Where this content comes from. Use to help downstream tools filter sources.',
        examples: ['official', 'cauldron'],
    })

/** =========================
 *  Subschemas
 *  ========================= */

export const SpectrumSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Spectrum name is required')
            .meta({
                description:
                    'Action to undertake in order to overcome the Danger or to transform it meaningfully.',
                examples: ['hurt', 'outsmart', 'ticking', 'burn'],
            }),
        maximum: z.coerce
            .number()
            .int()
            .min(1)
            .max(6)
            .default(1)
            .meta({
                description:
                    'Tier that relevant statuses need to reach in order to overcome the Danger or to transform it meaningfully.',
                examples: [3, 4],
            }),
        is_immune: z
            .boolean()
            .optional()
            .default(false)
            .meta({
                description:
                    "If true, the Danger ignores statuses targeting this Spectrum's vector.",
                examples: [false],
            }),
    })
    .meta({
        description:
            'Tracks how much of a given type of status a Danger can take before it changes irrevocably.',
    })

export const CustomMoveSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Custom move name is required')
            .meta({
                description: 'Short title for the custom move.',
                examples: ['Ultimate Predator', 'Bodyguard', 'Made of Clay'],
            }),
        description: z
            .string()
            .trim()
            .min(1, 'Custom move description is required')
            .meta({
                description:
                    'Concise text that explains both the conditions that trigger the custom move and its outcomes.',
                examples: [
                    'When the Golem of Prague enters the scene, give it {hardened-skin-1}.',
                    "When you try to get into the castle of the Sleeping Beauty, you first take {entangled-3} or {nick-and-cuts-2}, MC's choice.",
                ],
            }),
    })
    .meta({
        description:
            'A custom and unique condition-plus-outcome rule tailored to a specific ability or circumstance regarding the Danger.',
    })

export const MetaSchema = z
    .object({
        publication_type: PublicationTypeEnum.default('homebrew').meta({
            description:
                "Classifies the Danger's source to aid cataloging and tooling.",
            examples: ['official', 'cauldron'],
        }),
        source: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Source title (book, supplement, PDF) where this Danger appears.',
                examples: [
                    'City of Mist: MC Toolkit',
                    'City of Mist: Shadows & Showdowns',
                    'Lantern in the Mist - Sample Dangers',
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

export const CityOfMistDangerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Danger name is required')
            .default('Untitled Danger')
            .meta({
                description: 'The name/title of the Danger.',
                examples: [
                    'Carlton Cooper',
                    'City Official',
                    'Automated Security System',
                ],
            }),

        description: z
            .string()
            .trim()
            .optional()
            .meta({
                description:
                    'Brief MC-facing summary of what this Danger is and how it threatens the crew. Supports inline Markdown.',
                examples: [
                    'Enforcers are based on the Hired Thugs Mundane Danger with the addition of the **Juiced Up** move, which represents their enhanced physical state.',
                    'The detective may be working against the crew, helping the crew, or she may be a rival of the crew. Adjust the {corrupt:} and {override-authority:} spectrums accordingly.',
                ],
            }),

        rating: z.coerce
            .number()
            .int()
            .min(0)
            .max(5)
            .default(1)
            .meta({
                description:
                    'General estimate of how dangerous this profile is (0-5).',
                examples: [0, 1, 3, 5],
            }),

        spectrums: z.array(SpectrumSchema).optional().meta({
            description:
                'Define how the Danger can be overcome, transformed, countdown toward an end, or ignore certain approaches.',
        }),

        soft_moves: z
            .array(
                z.string().trim().meta({
                    description:
                        'Predefined variations of the soft MC move Complicate Things. They describe an action the Danger can take to complicate things which changes the story without affecting the rules directly.',
                })
            )
            .optional()
            .meta({
                description:
                    'Describe the actions the Danger can take to complicate the scene without direct rules impact.',
            }),

        hard_moves: z
            .array(
                z.string().trim().meta({
                    description:
                        'Predefined variations of the hard MC moves which can be invoked when the MC makes a hard move using the Danger specifically.',
                })
            )
            .optional()
            .meta({
                description:
                    'Describe the actions the Danger can take which have direct mechanical impact.',
            }),

        custom_moves: z.array(CustomMoveSchema).optional().meta({
            description:
                'Condition-plus-outcome rules for special abilities or circumstances.',
        }),

        meta: MetaSchema.optional().meta({
            description:
                "Attribution and cataloging fields for the Danger's origin.",
        }),
    })
    .meta({
        description:
            'City of Mist - Danger profile, representing a threat, obstacle, victim, hazard, or group with spectrums and danger moves.',
    })

/** =========================
 *  Exported TS types
 *  ========================= */

export type PublicationType = z.infer<typeof PublicationTypeEnum>
export type Spectrum = z.infer<typeof SpectrumSchema>
export type CustomMove = z.infer<typeof CustomMoveSchema>
export type DangerMeta = z.infer<typeof MetaSchema>
export type CityOfMistDanger = z.infer<typeof CityOfMistDangerSchema>
