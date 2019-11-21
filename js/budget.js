const budgetController = (function () {
    console.log("Budget Controller invoked.");

    const Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    const Expence = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    const state = {
        allItems: {
            income: [],
            expence: []
        },
        totals: {
            income: 0,
            expence: 0
        },
        budget: 0
    }

    return {

        addItem: function (type, description, value) {
            let newItem, ID;

            //[1,2,3,4,5,6] = 7
            //[1,2,4,6,7] = 8;
            //next id
            
            if (state.allItems[type].length === 0) ID = 0;
            else ID = (state.allItems[type][(state.allItems[type].length - 1)].id) + 1;

            if (type === "income") {
                newItem = new Income(ID, description, value);
            } else if (type === "expence") {
                newItem = new Expence(ID, description, value);
            }
            state.allItems[type].push(newItem);

            return newItem;
        },

        testing: function () {
            console.log("Testing Budget Controller ...");
            console.log(state);
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
            console.log("Getting inputs: " + this.getInputs());
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
        //2. Add item to the budget controller
        const newItem = bC.addItem(inputs.type, inputs.description, inputs.value);


        //3. Add item to the UI
        //4. Calculate budget
        //5. Display the budget on the UI
        bC.testing();
    })

})(budgetController, UIController);