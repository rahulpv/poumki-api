module.exports = function(str) {
    try {
        JSON.parse(JSON.stringify(str));
    } catch (e) {
        console.log(e)
        return false;
    }
    return true;

}
