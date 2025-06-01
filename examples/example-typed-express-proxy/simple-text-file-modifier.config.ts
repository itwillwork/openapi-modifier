const config = {
    // add a warning at the top of the file
    addBefore: '/**\n* WARNING! This file was auto-generated\n**/\n\n',
    
    replace: [
        {
            searchValue: /Components\./g,
            replaceValue: 'PetstoreComponents.'
        },
        {
            searchValue: /Components\s/g,
            replaceValue: 'PetstoreComponents '
        },
        {
            searchValue: /Paths\./g,
            replaceValue: 'PetstorePaths.'
        },
        {
            searchValue: /Paths\s/g,
            replaceValue: 'PetstorePaths '
        }
    ]
};
  
export default config;
  