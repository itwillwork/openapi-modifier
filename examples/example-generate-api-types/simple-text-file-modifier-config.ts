const config = {
    addBefore: '/**\n* WARNING! This file was auto-generated\n**/\n\n',
    replace: [
        {
            searchValue: 'declare namespace Components {',
            replaceValue: 'declare namespace ApiComponents {'
        },
        {
            searchValue: /\ Components\./g,
            replaceValue: ' ApiComponents.'
        },
        {
            searchValue: 'declare namespace Paths {',
            replaceValue: 'declare namespace ApiPaths {'
        },
    ]
};

export default config;