
window.addEventListener("load", function() {
    console.log("init free time");
    document.getElementById("add-time-block-button").addEventListener("click", addTimeBlock);
});

function addTimeBlock() {
    this.blur();
    console.log("Adding Time Block");
}