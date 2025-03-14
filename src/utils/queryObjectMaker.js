function uploadQueryMaker(detailsObject) {
    const objectkeys = Object.keys(detailsObject).join(', ')
    const objectValues = Object.values(detailsObject)
    const objectPlaceHolders = objectValues.map((_, index) => `$${index + 1}`).join(", ")
    return {
        queryColumns: objectkeys,
        queryPlaceHolders: objectPlaceHolders,
        queryValues: objectValues
    }
}
export default uploadQueryMaker