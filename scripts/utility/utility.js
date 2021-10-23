
export let logicalBtnClick = (logicalBtn) => {
    logicalBtn.animate();
    logicalBtn.controller.buyItem(logicalBtn.model, 1, function(result) {
        if (result) {
            logicalBtn.update();
        }
    });
};