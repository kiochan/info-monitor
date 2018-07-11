var now;
if (performance) {
    now = performance.now.bind(performance);
}
else {
    now = Date.now.bind(Date);
}
module.exports = now;
//# sourceMappingURL=now.js.map