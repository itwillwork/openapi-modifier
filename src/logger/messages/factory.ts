import {RuleMetaT} from "../../core/rules/processor-models";
import {tryExtractRefLastPath} from "../../rules/common/utils/refs";

const getGitHubRuleConfigReadMeLink = (ruleName: string) => {
    return `https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/${ruleName}/README.md#config`
}

const getGitHubRuleReadMeLink = (ruleName: string) => {
    return `https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/${ruleName}/README.md`
}

const getGitHubConfigReadMeLink = () => {
    return `https://github.com/itwillwork/openapi-modifier/tree/main?tab=readme-ov-file#%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D1%8B-%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B3%D1%83%D1%80%D0%B0%D1%86%D0%B8%D0%B8`
}

const getGitHubDescriptorWithAllOfReadMeLink = () => {
    return 'TODO'
}

const getGitHubDescriptorWithAnyOfReadMeLink = () => {
    return 'TODO'
}

const getGitHubDescriptorWithOneOfReadMeLink = () => {
    return 'TODO'
}

const getGitHubDescriptorWithRefReadMeLink = () => {
    return 'TODO'
}

export const messagesFactory = {
    failedRun: {
        emptyPipeline: `Empty pipeline! See config docs: ${getGitHubConfigReadMeLink()}`,
        failedRunPipelineItem: (item: any) => {
            return `Failed to process pipeline item "${JSON.stringify(item)}". See the error description above in the current log.`
        }
    },
    ruleNotApply: {
        failedToParseDescriptor: (ruleMeta: RuleMetaT, field: string) => {
            return `The rule "${ruleMeta.ruleName}" does not apply, failed to parse descriptor "${field}". See the error description above in the current log. Or see rule config docs: ${getGitHubRuleConfigReadMeLink(ruleMeta.ruleName)}`;
        },
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
    },
    failedToResolvePath: {
        conflictRef: (sourcePath: string, currentObject: { $ref: unknown }, lostPath: string) => {
            return `
                Failed to resolve path "${sourcePath}". 
                Conflict with "$ref": "${JSON.stringify(currentObject)}". 
                Try using a direct descriptor: "${typeof currentObject['$ref'] === "string" ? tryExtractRefLastPath(currentObject['$ref']) : ''}, with lost path: ${lostPath}".
                See docs about usage "$ref" in descriptors: ${getGitHubDescriptorWithRefReadMeLink()}
            `
        },
        conflictOneOf: (sourcePath: string, currentObject: {}, lostPath: string) => {
            return `
                Failed to resolve path "${sourcePath}". 
                Conflict with "oneOf": "${JSON.stringify(currentObject)}", with lost path: "${lostPath}". 
                See docs about usage "oneOf" in descriptors: ${getGitHubDescriptorWithOneOfReadMeLink()}
            `;
        },
        conflictAnyOf: (sourcePath: string, currentObject: {}, lostPath: string) => {
            return `
                Failed to resolve path "${sourcePath}". 
                Conflict with "anyOf": "${JSON.stringify(currentObject)}", with lost path: "${lostPath}". 
                See docs about usage "anyOf" in descriptors: ${getGitHubDescriptorWithAnyOfReadMeLink()}
            `;
        },
        conflictAllOf: (sourcePath: string, currentObject: {}, lostPath: string) => {
            return `
                Failed to resolve path "${sourcePath}". 
                Conflict with "allOf": "${JSON.stringify(currentObject)}", with lost path: "${lostPath}". 
                See docs about usage "allOf" in descriptors: ${getGitHubDescriptorWithAllOfReadMeLink()}
            `;
        },
    }
}
