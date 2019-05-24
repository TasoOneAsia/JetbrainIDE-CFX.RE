import {FilesBuilder} from "./files-builder";

export class ContentGenerate {

    private filesBuilder: FilesBuilder;

    private generateDocs: string = "";

    /**
     * @param filesBuilder
     */
    constructor(filesBuilder: FilesBuilder) {
        this.filesBuilder = filesBuilder;
    }

    /**
     * @param data
     */
    public generateTemplate = (data: JSON): void => {
        const template = (description: String, module: String, submodule: String, see: String, usage: String, param: String, _return: String, _function: String) => `
--@description ${description}
--@module ${module}
--@submodule ${submodule}
--@see ${see}
--@usage ${usage}
${param}
--@return ${_return}
${_function}
`;

        for (let category in data) for (let natives in data[category]) {

            let jsonNative: JSON = data[category][natives];
            let nativeName: String = this.nativeName(jsonNative, natives);
            let nativeParams: { luaDocs: String; params: String; paramsWithType: String } = this.nativeParams(jsonNative);

            this.generateDocs += template(this.nativeDescription(data), "NATIVE", category, jsonNative.name, this.nativeUsage(jsonNative, nativeParams.paramsWithType), nativeParams.luaDocs, jsonNative.results, "function " + nativeName + "(" + this.nativeParams(jsonNative).params + ") end");

            // TODO Fix issue update file don't update online with submodule value
            //console.log(this.generateDocs);

            this.filesBuilder.update(category, this.generateDocs)

        }
    };

    /**
     * `nativeName` is used to format and generate the name of the native return by the FiveM api
     *
     * @param data Request the result of the query to the API of the FiveM natives
     * @param natives Request the result of the query to the API of the FiveM natives data[category]
     *
     * @return String
     */
    private nativeName = (data: JSON, natives: String): String => {
        if (data.name !== undefined || natives !== undefined)
            return (data.name || natives).toLowerCase().replace('0x', 'n_0x').replace(/_([a-z])/g, (sub, bit) => bit.toUpperCase()).replace(/^([a-z])/, (sub, bit) => bit.toUpperCase());
    };

    /**
     * "nativeParams" Is used to generate the parameters of the native wish and its LUA documentation.
     *
     * @param data Request the result of the query to the API of the FiveM natives
     *
     * @return JSON<String luaDocs, String params>
     */
    private nativeParams = (data: JSON): { luaDocs: String, params: String, paramsWithType: String } => {

        /**
         * "luaDocs" Allows to save the generation of LUA documentation and return it
         *
         * "params" Allows to save the generation of the native parameters and to return it.
         */
        let luaDocs: String = "", params: String = "", paramsWithType: String = "";

        for (let i = 0; i <= data.params.length - 1; i++) {
            luaDocs += ((i != 0 ? "\n" : "") + "--@params " + data.params[i].name + " " + data.params[i].type);
            params += ((i != 0 ? "," : "") + data.params[i].name);
            paramsWithType += ((i != 0 ? "," : "") + data.params[i].type + " " + data.params[i].name);
        }

        return {luaDocs: luaDocs, params: params, paramsWithType: paramsWithType};
    };

    /**
     * `nativeDescription` Allows to check if a description exists on the native wish and therefore returned a different result according to the natives
     *
     * @param data Request the result of the query to the API of the FiveM natives
     *
     * @return String Returns the description of the native or a prefect text indicating the lack of official description
     */
    private nativeDescription = (data: JSON): String => {
        if (data.description !== undefined)
            return data.description;
        else
            return "This natives does not have an official description.";
    };

    /**
     * `nativeUsage` Allows to automatically generate the native's usage pattern with all the details necessary for an instant understanding
     *
     * @param data Request the result of the query to the API of the FiveM natives
     * @param nativeParams Results generated from the nativeParams() function of the class [[ContentGenerate]]
     *
     * @return String Returns the predefined pattern
     */
    private nativeUsage = (data: JSON, nativeParams: String): String => {
        const template = (result, native, params) => `${result} ${native}(${params});`;

        return template(data.results, data.name, nativeParams);
    }

}