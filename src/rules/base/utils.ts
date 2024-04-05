import {
	OpenAPIFileT
} from '../../openapi';


// TODO OperationObject
type SchemaCallbackT = (schema: any) => void;

// TODO remove any OpenAPIFileT
export const forEachSchemas = (openAPIFile: any, callback: SchemaCallbackT) => {
	// TODO add types
	const stack: Array<any> = [];

	// forEach - components.schemas[name]
	Object.keys(openAPIFile.document?.components?.schemas || {}).forEach(name => {
		stack.push(openAPIFile.document?.components?.schemas?.[name]);
	});

	Object.keys(openAPIFile.document?.paths || {}).forEach(pathName => {
		Object.keys(openAPIFile.document?.paths?.[pathName] || {}).forEach(method => {
			const methodSchema = openAPIFile.document?.paths?.[pathName]?.[method];

			// forEach - paths[name][method].parameters[].schema
			const parameters = methodSchema?.parameters || [];
			// TODO remove any
			parameters.forEach((parameter: any) => {
				stack.push(parameter?.schema);
			});

			// forEach - paths[name][method].responses[code].content[contentType].schema
			const responses = methodSchema?.responses || {};
			Object.keys(responses).forEach(code => {
				const responseSchema = responses[code];

				Object.keys(responseSchema?.content).forEach(contentType => {
					const responseContentSchema = responseSchema?.content?.[contentType]?.schema;

					stack.push(responseContentSchema);
				});
			});

			// forEach - paths[name][method].requestBody.content[contentType].schema
			const requestBody = methodSchema?.requestBody;
			Object.keys(requestBody?.content || {}).forEach(contentType => {
				const requestBodyContentSchema = requestBody?.content?.[contentType]?.schema;

				stack.push(requestBodyContentSchema);
			});
		});
	});

	// forEach - components.parameters[name].schema
	Object.keys(openAPIFile.document?.parameters || {}).forEach(name => {
		stack.push(openAPIFile.document?.parameters?.[name]?.schema);
	});

	// forEach - components.responses[name].content[contentType].schema
	Object.keys(openAPIFile.document?.responses || {}).forEach(name => {
		const responseSchema = openAPIFile.document?.responses?.[name];

		Object.keys(responseSchema?.content || {}).forEach(contentType => {
			const responseContentSchema = responseSchema?.content?.[contentType]?.schema;

			stack.push(responseContentSchema);
		});
	});


	// forEach - components.requestBodies[name].content[contentType].schema
	Object.keys(openAPIFile.document?.requestBodies || {}).forEach(name => {
		const requestBodySchema = openAPIFile.document?.requestBodies?.[name];

		Object.keys(requestBodySchema?.content || {}).forEach(contentType => {
			const responseContentSchema = requestBodySchema?.content?.[contentType]?.schema;

			stack.push(responseContentSchema);
		});
	});


	while (stack.length) {
		const item = stack.pop();

		if (item) {
			callback(item);
		}

		if (item.type === "array") {
			// TODO items
		}

		if (item.type === "object") {
			// TODO properties
		}


		if (item.type === "oneOf") {
			// TODO ??
		}

		// allOf ???
	}

}

// TODO remove any OperationObject
type OperationCallbackT = (operationSchema: any) => void;

export const forEachOperation = (openAPIFile: OpenAPIFileT, callback: OperationCallbackT) => {
	const paths = openAPIFile.document?.paths;

	Object.keys(paths || {}).forEach((pathKey) => {
		const path = paths?.[pathKey];

		Object.keys(path || {}).forEach((method) => {
			// @ts-expect-error bad OpenAPI types!
			const operation = path?.[method];

			callback(operation);
		});
	});
}