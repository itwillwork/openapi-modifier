import { createTwoFilesPatch } from 'diff';
import YAML from 'yaml';
import { OpenAPIFileT } from '../openapi';

type SerializedDocument = { value: string } | { error: string };
export type OpenAPIDiffResult = { diff?: string; error?: string };

export class OpenAPIDiffer {
  private readonly before: SerializedDocument;

  constructor(document: OpenAPIFileT['document']) {
    // Capture text immediately because rules can mutate the document in place.
    this.before = this.serialize(document);
  }

  getDiff = (document: OpenAPIFileT['document']): OpenAPIDiffResult => {
    if ('error' in this.before) {
      return this.before;
    }

    const after = this.serialize(document);
    if ('error' in after) {
      return after;
    }
    if (this.before.value === after.value) {
      return {};
    }

    try {
      return { diff: createTwoFilesPatch('before.yaml', 'after.yaml', this.before.value, after.value, undefined, undefined, { context: 3 }) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  };

  private serialize = (document: OpenAPIFileT['document']): SerializedDocument => {
    try {
      return { value: YAML.stringify(document, { sortMapEntries: true }) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  };
}
