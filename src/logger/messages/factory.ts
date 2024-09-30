import {RuleMetaT} from "../../core/rules/processor-models";

const getGitHubRuleConfigReadMeLink = (ruleName: string) => {
    return `https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/${ruleName}/README.md#config`
}

const getGitHubRuleReadMeLink = (ruleName: string) => {
    return `https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/${ruleName}/README.md`
}

export const messagesFactory = {
    ruleNotApply: {
        withReason: (ruleMeta: RuleMetaT, reason: string) => {
            return `The rule "${ruleMeta.ruleName}" does not apply, for the reason: ${reason}. See rule docs: ${getGitHubRuleReadMeLink(ruleMeta.ruleName)}`;
        },
        requiredConfigField: (ruleMeta: RuleMetaT, field: string) => {
            return `The rule "${ruleMeta.ruleName}" does not apply, you must specify the "${field}" field of the rule configuration. See rule config docs: ${getGitHubRuleConfigReadMeLink(ruleMeta.ruleName)}`;
        }
    },
    deprecated: {
        endpoint: (method: string, path: string, description?: string | null | undefined) => {
            return `Description of the deprecated endpoint ${method} - ${path}: "${description || ''}"`;
        },
        endpointParameter: (method: string, path: string, parameterName: string, parameterIn: string, description?: string | null | undefined) => {
            return `Description of the deprecated endpoint ${method} - ${path} parameter ${parameterIn} "${parameterName}": "${description || ''}"`;
        },
        fieldByRef: (propertyKey: string, description?: string | null | undefined) => {
            return `Description of the deprecated field by ref "${propertyKey}": "${description || ''}"`;
        },
        field: (propertyKey: string, description?: string | null | undefined) => {
            return `Description of the deprecated field "${propertyKey}": "${description || ''}"`;
        },
        component: (componentName: string, description?: string | null | undefined) => {
            return `Description of the deprecated component "${componentName}": "${description || ''}"`;
        },
    },
    configField: {
        notUsaged: (field: string, description?: string) => {
            return `The "${field}" field of the configuration is not used${description ? `: ${description}` : '.'}`;
        }
    }
}
