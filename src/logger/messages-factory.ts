export const messagesFactory = {
    ruleNotApply: {
        withReason: (reason: string) => {
            return `The rule does not apply, for the reason: ${reason}`;
        },
        requiredConfigField: (field: string) => {
            return `The rule does not apply, you must specify the "${field}" field of the rule configuration`;
        }
    },
    configField: {
        notUsaged: (field: string, description?: string) => {
            return `The "${field}" field of the configuration is not used${description ? `: ${description}` : '.'}`;
        }
    }
}
