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
        //Add item to correct list
        addItemToList: function (type, newItem) {
            let list = null;
            let markup = "";
            let newMarkup = "";
            const position = "beforeend";


            if (type === "income") {
                list = document.querySelector('.incomes--items');
                markup = `
                <li class = "item incomes--item" id="income-%id%">
                    <div class="label incomes--label">%description%</div> 
                    <button class = "btn btn__incomes"><i class="fa fa-trash-alt"></i></button>
                    <div class="values incomes--values">
                        <div class="value incomes--value">%value%</div>
                    </div> 
                </li>
            `;
                newMarkup = markup.replace("%id%", newItem.id);
                newMarkup = newMarkup.replace("%description%", newItem.description);
                newMarkup = newMarkup.replace("%value%", newItem.value);
                list.insertAdjacentHTML(position, newMarkup);

            } else if (type === "expence") {
                list = document.querySelector('.expences--items');
                markup = `
                <li class="item expences--item" id="expence-%id%">
                    <div class="label expences--label">%description%</div>
                    <button class="btn btn__expences"><i class="fa fa-trash-alt btn--icon"></i></button>
                    <div class="values expences--values">
                        <div class="value expences--value">%value%</div>
                        <div class="percentage expences--percentage">7%</div>
                    </div>
                </li>
                `;
                
                newMarkup = markup.replace("%id%", newItem.id);
                newMarkup = newMarkup.replace("%description%", newItem.description);
                newMarkup = newMarkup.replace("%value%", newItem.value);
                list.insertAdjacentHTML(position, newMarkup);
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



    return {
        init: function () {
            //1. Get the field input data
            document.querySelector('.btn__add').addEventListener('click', function (event) {
                event.preventDefault();
                const inputs = uiC.getInputs();
                uiC.testing();
                //2. Add item to the budget controller
                const newItem = bC.addItem(inputs.type, inputs.description, inputs.value);

                //3. Add item to the UI
                uiC.addItemToList(inputs.type, newItem);


                //4. Calculate budget
                //5. Display the budget on the UI
                bC.testing();
            })
        }
    }

})(budgetController, UIController);

appController.init();