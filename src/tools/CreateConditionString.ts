import {SearchCondition, SearchConditionString} from "../types";
import isString from "lodash.isstring";
import isBoolean from "lodash.isboolean";
import isNumber from "lodash.isnumber";

/** Convert a search condition to a valid MySQL string. */
export function createConditionString(condition: SearchCondition | SearchConditionString): SearchConditionString {
    let conditionString: SearchConditionString = ''
    if (isString(condition)) {
        conditionString = condition
    } else if (isBoolean(condition)) {
        conditionString = condition.toString()
    } else {
        let firstCondition = true
        for (const key in condition) {
            if (condition.hasOwnProperty(key)) {
                const value = isNumber(condition[key]) || isBoolean(condition[key]) ? condition[key].toString() : `"${condition[key]}"`
                conditionString = conditionString
                    .concat(firstCondition ? '' : '  & ')
                    .concat(key)
                    .concat('=')
                    .concat(value)
                if (firstCondition) {
                    firstCondition = false
                }
            }
        }
    }
    return conditionString
}