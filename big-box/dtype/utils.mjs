import { SPACE_REGEX } from '../resources'

export const removeSpaces = function (string) {
    return string.replace(SPACE_REGEX, "")
}
