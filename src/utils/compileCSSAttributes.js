const compileCSSAttributes = (pseudoClasses) => {
    const {
        styleSheets: documentStyles = {}
    } = document;

    const documentCSSList = {};

    let selectorName;
    let cssContent;
    let pseudoFilter;
    let matched;
    let attributeObject;

    // Iterate through list of stylesheets.
    Object.values(documentStyles).forEach((stylesheet) => {
        try {
            const {
                cssRules
            } = stylesheet;

            // Iterate through list of rules.
            Object.values(cssRules).forEach((cssRule) => {
                // Iterate through our defined pseudo classes.
                matched = false;
                Object.values(pseudoClasses).forEach((pseudoClass) => {
                    try {
                        const {
                            axureName,
                            keyName
                        } = pseudoClass;

                        if (!matched && RegExp(axureName).test(cssRule.selectorText)) {
                            matched = true;
                            // Extract our "pure" selector name.
                            if (axureName.length) {
                                pseudoFilter = new RegExp(`\\.${axureName}`);
                                selectorName = cssRule.selectorText.replace(pseudoFilter, '').trim();
                            } else {
                                selectorName = cssRule.selectorText.trim();
                            }

                            cssContent = cssRule.cssText.replace(/^.*{/, '').replace('}', '').trim();

                            // Check if the selector exists yet.
                            if (!(selectorName in documentCSSList)) {
                                documentCSSList[selectorName] = {};
                            }

                            // Update our master CSS attributes list.
                            attributeObject = {};

                            // Convert our CSS list into an object.
                            cssContent.split(';').forEach((attribute) => {
                                if (attribute.length) {
                                    attributeObject[attribute.split(':')[0].trim()] = attribute.split(':')[1].trim();
                                }
                            });
                            documentCSSList[selectorName][keyName] = attributeObject;
                        }
                    } catch (err) {
                        // Probably missing a key in the object.
                    }
                });
            });
        } catch (err) {
            // Probably missing a key in the object.
        }
    });

    console.log('document CSS:', documentCSSList);
    return documentCSSList;
};

export default compileCSSAttributes;
