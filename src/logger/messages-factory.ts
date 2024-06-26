export const messagesFactory = {
    ruleNotApply: {
        withReason: (reason: string) => {
            return `The rule does not apply, for the reason: ${reason}`;
        },
        requiredConfigField: (field: string) => {
            return `The rule does not apply, you must specify the "${field}" field of the rule configuration`;
        }
    }
}
