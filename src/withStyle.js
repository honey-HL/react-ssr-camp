import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics';

function withStyle(Comp, styles) {

    function newComp (props) {
        if (props.staticContext) {
            props.staticContext.css.push(styles._getCss())
        }
        return <Comp {...props}/>
    }
    hoistNonReactStatic(newComp, Comp);
    // newComp.loadData = Comp.loadData
    return newComp;
}

export default withStyle;