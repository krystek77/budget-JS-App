const budgetController = (function () {
    console.log("Budget Controller invoked.");

    return {
        testing: function () {
            console.log("Testing Budget Controller ...");
        }
    }

})();

const UIController = (function () {
    console.log("UI Controller invoked.");


    return {
        //get the field input data
        getInputs: function () {
            return {
                value: document.querySelector('.form--value').value,
                description: document.querySelector('.form--description').value,
                type: document.querySelector('.form--select').value
            }
        },
        //testing UI Controller
        testing: function () {
            console.log("Testing UI Controller ...");
            console.log(this.getInputs());
        }
    }
})();
const appController = (function (bC, uiC) {
    console.log("Starting application.");

    //1. Get the field input data
    document.querySelector('.btn__add').addEventListener('click', function (event) {
        event.preventDefault();
        const inputs = uiC.getInputs();
        uiC.testing();

        // bC.testing();
    })
    //2. Add item to the budget controller
    //3. Add item to the UI
    //4. Calculate budget
    //5. Display the budget on the UI

})(budgetController, UIController);