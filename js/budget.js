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

    const calculateTotal = function (type) {
        let sum = 0;
        state.allItems[type].forEach(function (item) {
            sum += item.value;
        });
        state.totals[type] = sum;
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
        budget: 0,
        percentage: "---",
        errorMessage: {
            msgBoth: "Both fields have to be filled!",
            msgDesc: "Description have to filled.",
            msgVal: "Value have to grater than zero."
        }
    }

    return {
        //return budget
        returnBudget: function () {
            return {
                totalsIncome: state.totals.income,
                totalsExpence: state.totals.expence,
                budget: state.budget,
                percentage: state.percentage
            }
        },
        //calculate Budget
        calculateBudget: function () {

            // 1.Calculate incomes
            calculateTotal('income');
            // 2.Calculate expences
            calculateTotal('expence');
            // 3.Calculate budget
            state.budget = state.totals.income - state.totals.expence;
            // 4.Calculate percenatge of incomes that we spent
            if (state.totals.income > 0) {
                state.percentage = Math.round((state.totals.expence / state.totals.income) * 100);
            } else {
                state.percentage = "---";
            }
        },

        //check if all fields are filled
        isFieldFilled: function (description, value) {
            let isFieldFilled = true;

            if (description === "" && value === 0) {
                alert(state.errorMessage.msgBoth);
                isFieldFilled = false;
                return isFieldFilled;
            } else if (description != "" && value <= 0) {
                alert(state.errorMessage.msgVal);
                isFieldFilled = false;
                return isFieldFilled;
            } else if (description === "" && (value > 0 || value < 0)) {
                alert(state.errorMessage.msgDesc);
                isFieldFilled = false;
                return isFieldFilled;
            }
            return isFieldFilled;
        },

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

    const DOMStrings = {
        inputValue: '.form--value',
        inputDescription: '.form--description',
        inputType: '.form--select',
        incomesList: '.incomes--items',
        expencesList: '.expences--items',
        addBtn: '.btn__add'
    }

    return {
        //get selectors of elements
        getDOMStrings: function () {
            return DOMStrings;
        },

        //get the field input data
        getInputs: function () {
            return {
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
                description: document.querySelector(DOMStrings.inputDescription).value,
                type: document.querySelector(DOMStrings.inputType).value
            }
        },
        //clear fields
        clearFields: function () {
            document.querySelector(DOMStrings.inputValue).value = 0;
            document.querySelector(DOMStrings.inputDescription).value = "";
            document.querySelector(DOMStrings.inputDescription).focus();
        },

        //Add item to correct list
        addItemToList: function (type, newItem) {
            let list = null;
            let markup = "";
            let newMarkup = "";
            const position = "beforeend";


            if (type === "income") {
                list = document.querySelector(DOMStrings.incomesList);
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
                list = document.querySelector(DOMStrings.expencesList);
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

    const updateBudget = function () {
        //1. Calculate budget
        bC.calculateBudget();
        //2. Return budhet

        //3. Display the budget on the UI
    }

    return {
        init: function () {
            //1. Get the field input data
            const DOMStrings = uiC.getDOMStrings();

            document.querySelector(DOMStrings.addBtn).addEventListener('click', function (event) {
                event.preventDefault();
                const inputs = uiC.getInputs();
                uiC.testing();
                //2. Add item to the budget controller
                if (bC.isFieldFilled(inputs.description, inputs.value)) {
                    const newItem = bC.addItem(inputs.type, inputs.description, inputs.value);
                    //3. Add item to the UI
                    uiC.addItemToList(inputs.type, newItem);
                }
                uiC.clearFields();

                //4. Calculate and update Budget
                updateBudget();

                bC.testing();
            })
        }
    }

})(budgetController, UIController);

appController.init();