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
        this.percentage = -1;
    }

    Expence.prototype.calculatePercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expence.prototype.getPercentage = function () {
        return this.percentage;
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
        percentage: -1,
        errorMessage: {
            msgBoth: "Both fields have to be filled!",
            msgDesc: "Description have to filled.",
            msgVal: "Value have to grater than zero."
        }
    }

    return {
        //
        calculatePercentages: function () {
            state.allItems["expence"].forEach(function (item) {
                item.calculatePercentage(state.totals.income);
            })
        },
        //
        getPercentages: function () {
            const percentagesArr = state.allItems.expence.map(function (item) {
                return item.getPercentage();
            })
            return percentagesArr;
        },

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

        delteItem: function (type, id) {
            let index = 0;
            const idsArr = state.allItems[type].map(function (item, index, array) {
                return item.id;
            })
            if (idsArr.indexOf(id) > -1) {
                index = idsArr.indexOf(id);
                state.allItems[type].splice(index, 1);
            }
        },

        deleteItem2: function (type, id) {
            const index = state.allItems[type].findIndex(function (item) {
                return item.id === id;
            })
            state.allItems[type].splice(index, 1);
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
        addBtn: '.btn__add',
        budget: '.header--budget-value',
        incomes: '.summary--value__incomes',
        expences: '.summary--value__expences',
        percentage: '.header--percentage',
        content: '.content',
        expencePercentage: '.expences--percentage',
        dateContainer: '.header--description',
        dateFooterContainer: '.footer > .container'
    };

    /**
     * Format given number
     * 
     * 
     * @param {number} number 
     * @param {string} type  "income" or "expence"
     */
    const formatNumber = function (number, type) {
        //if income: 1000.123 -> + 1,000.12
        //if expence: 1000.245 -> - 1,000.25; 100,245 -> - 100.25
        //if expence 11234,235 -> - 11,234.26
        // etc.

        number = number.toFixed(2);
        const numberArr = number.split(".");
        let integerPart = numberArr[0];
        const decimalPart = numberArr[1];
        if (integerPart.length > 3) {
            // min. 4
            integerPart = integerPart.substring(0, integerPart.length - 3) + "," + integerPart.substring(integerPart.length - 3);

        }
        const formatedNumber = integerPart + "." + decimalPart;

        // const sign = (type === "income") ? "+" : "-";
        // console.log(type);
        // console.log(number);
        // console.log(numberArr);
        // console.log(formatedNumber);
        // console.log((type === "income" ? "+" : "-") + " " + formatedNumber);
        // console.log(sign + " " + formatedNumber);

        return (type === "income" ? "+" : "-") + " " + formatedNumber
    };

    return {

        //display budget on UI
        displayBudget: function (obj) {

            let type = "expence";

            if (obj.budget >= 0) {
                type = "income";
            }

            document.querySelector(DOMStrings.budget).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomes).textContent = formatNumber(obj.totalsIncome, "income");
            document.querySelector(DOMStrings.expences).textContent = formatNumber(obj.totalsExpence, "expence");
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentage).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.percentage).textContent = "---";
            }

        },

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
                newMarkup = newMarkup.replace("%value%", formatNumber(newItem.value, type));
                list.insertAdjacentHTML(position, newMarkup);

            } else if (type === "expence") {
                list = document.querySelector(DOMStrings.expencesList);
                markup = `
                <li class="item expences--item" id="expence-%id%">
                    <div class="label expences--label">%description%</div>
                    <button class="btn btn__expences"><i class="fa fa-trash-alt btn--icon"></i></button>
                    <div class="values expences--values">
                        <div class="value expences--value">%value%</div>
                        <div class="percentage expences--percentage">#7%#</div>
                    </div>
                </li>
                `;

                newMarkup = markup.replace("%id%", newItem.id);
                newMarkup = newMarkup.replace("%description%", newItem.description);
                newMarkup = newMarkup.replace("%value%", formatNumber(newItem.value, type));
                newMarkup = newMarkup.replace("#7%#", newItem.percentage);
                list.insertAdjacentHTML(position, newMarkup);
            }
        },

        //Remove item from UI
        removeItemFromList: function (element) {
            element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
        },
        //display percentages
        displayPercentages: function (percentages) {
            // console.log("Display the percentages");
            const percentageFields = document.querySelectorAll(DOMStrings.expencePercentage);
            // console.log(percentageFields);
            //Convert NodeList to Array
            //1. First way: const percentageFieldsArr = Array.prototype.slice.call(percentageFields);
            //2. Second way: const percentageFieldsArr = [...percentageFields];
            //3. Thrid way:
            const nodeListToArray = function (percentageFields, callback) {
                for (let index = 0; index < percentageFields.length; index++) {
                    callback(percentageFields[index], index)
                }
            }
            nodeListToArray(percentageFields, function (currentField, index) {
                if (percentages[index] > 0) {
                    currentField.textContent = percentages[index] + "%";
                } else {
                    currentField.textContent = "---";
                }
            })
            // console.log(document.querySelectorAll(DOMStrings.expencePercentage));


        },
        changeType: function (event) {
            console.log("Change border color...")
            const inputs = document.querySelectorAll(DOMStrings.inputType + ', ' + DOMStrings.inputDescription + ", " + DOMStrings.inputValue);
            console.log(inputs)
            const nodeListToArray = function (list, callback) {
                for (let index = 0; index < list.length; index++) {
                    callback(list[index]);
                }
            }
            nodeListToArray(inputs, function (input) {
                input.classList.toggle('red-focus');
            })

            const addBtn = document.querySelector(DOMStrings.addBtn);
            const type = document.querySelector(DOMStrings.inputType).value;

            if (type === 'expence') {
                addBtn.classList.add('red');
                addBtn.classList.remove('blue');
            } else {
                addBtn.classList.add('blue');
                addBtn.classList.remove('red');
            }
        },

        displayDate: function () {
            const dateContainer = document.querySelector(DOMStrings.dateContainer);
            const dateFooterContainer = document.querySelector(DOMStrings.dateFooterContainer);
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth(); //for example 10 - November

            const months = Object.freeze({
                "0": "January",
                "1": "February",
                "2": "March",
                "3": "April",
                "4": "May",
                "5": "June",
                "6": "July",
                "7": "August",
                "8": "September",
                "9": "October",
                "10": "November",
                "11": "December",
            })

            const text = `Available budget in ${months[month]}, ${year}`;
            dateContainer.innerHTML = text;
            dateFooterContainer.innerHTML = `${months[month]}, ${year}`;
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

    const updateBudget = function () {
        //1. Calculate budget
        bC.calculateBudget();
        //2. Return budget
        const budget = bC.returnBudget();
        //3. Display the budget on the UI
        uiC.displayBudget(budget);
    }

    return {
        init: function () {
            //1. Get the field input data
            const DOMStrings = uiC.getDOMStrings();
            //Display current month and year
            uiC.displayDate();


            const updatePercentages = function () {
                console.log("Update percentages of expences items");
                //1. Calculate percentages
                bC.calculatePercentages();
                //2. Get percentages
                const percentages = bC.getPercentages();
                console.log(percentages);
                //3. Update the percentage to UI
                uiC.displayPercentages(percentages);
            }

            //reset budget
            uiC.displayBudget({
                totalsIncome: 0,
                totalsExpence: 0,
                budget: 0,
                percentage: -1
            });

            document.querySelector(DOMStrings.addBtn).addEventListener('click', function (event) {
                event.preventDefault();
                const inputs = uiC.getInputs();
                uiC.testing();
                //2. Add item to the budget controller
                if (inputs.description !== "" && !isNaN(inputs.value) && inputs.value > 0) {

                    const newItem = bC.addItem(inputs.type, inputs.description, inputs.value);
                    //3. Add item to the UI
                    uiC.addItemToList(inputs.type, newItem);

                    uiC.clearFields();

                    //4. Calculate and update Budget
                    updateBudget();
                    //updatePercentage
                    updatePercentages();

                    // uiC.formatNumber(11023.125, inputs.type);

                    bC.testing();
                }

            })

            //Add event handler to delete button
            document.querySelector(DOMStrings.content).addEventListener('click', function (event) {

                const idItem = event.target.parentNode.parentNode.id;
                if (idItem) {
                    console.log(idItem);
                    //split id attribute to 2 parts: id and list name
                    const idItemArr = idItem.split("-");
                    const whichList = idItemArr[0]; //income or expence
                    const id = parseInt(idItemArr[1], 10);

                    //Delete specified item from our data structure
                    // bC.delteItem(whichList, id);
                    bC.deleteItem2(whichList, id);

                    //Delete specified item to UI
                    uiC.removeItemFromList(event.target);
                    //Recalculate budget
                    //Display recalculate budget
                    updateBudget();
                    //updatePercentage
                    updatePercentages();

                    // uiC.formatNumber(11023.125, inputs.type);

                    bC.testing();


                }
            })
            //Add change event to select element
            document.querySelector(DOMStrings.inputType).addEventListener('change', uiC.changeType);
        }
    }

})(budgetController, UIController);

appController.init();