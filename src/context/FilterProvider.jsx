/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import * as React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const FilterContext = React.createContext();

const filterReducer = (filterState, action) => {
    switch (action.type) {
        case "set": {
            const { newValue } = action
            return {
                show: newValue
            };
        }
        case "toggle":
            return {
                show: !filterState.show
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

const FilterProvider = ({ children }) => {
    const [filterState, setFilterState] = React.useReducer(filterReducer, {
        show: false
    });

    const value = { filterState, setFilterState };
    return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

FilterProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// hooks
const useFilter = () => {
    const context = React.useContext(FilterContext);
    if (context === undefined) throw new Error("filterContext must be used within a Provider");
    return context;
};

export { FilterProvider, useFilter };
