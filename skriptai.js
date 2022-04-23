class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    currentOperandIsEmpty() {
        if (this.currentOperand === '') {
            return true
        }
        return false
    }
    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }
    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }
    compute() {
        let kintamasis
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case '+':
                kintamasis = prev + current
                break
            case '−':
                kintamasis = prev - current
                break
            case '×':
                kintamasis = prev * current
                break
            case '÷':
                if (current === 0)
                    kintamasis = 'Dalyba is 0 negalima'
                else
                    kintamasis = prev / current
                break
            case '^':
                kintamasis = Math.pow(prev, current)
                break
            case '%':
                kintamasis = ((prev % current) + current) % current
                break
            case 'x√':
                kintamasis = Math.pow(prev, 1/current)
                break
            default:
                break
        }
        this.addHistory(kintamasis, this.operation, prev, current)
        this.currentOperand = kintamasis
        this.operation = undefined
        this.previousOperand = ''
    }
    computeSingleOperand(operation) {
        let kintamasis
        const current = parseFloat(this.currentOperand)
        if (isNaN(current)) return
        switch (operation) {
            case '√':
                kintamasis = Math.sqrt(current)
                if (isNaN(kintamasis)){
                    kintamasis = 'Invalid input'
                }
                break
        }
        this.addHistoryOneElem(kintamasis, operation, current)
        this.currentOperand = kintamasis
        this.operation = undefined
        this.previousOperand = ''
    }
    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if (stringNumber === 'Invalid input' || stringNumber === 'Dalyba is 0 negalima'){
            integerDisplay = stringNumber
        }
        else if (isNaN(integerDigits)) {
            integerDisplay = ''
        }
        else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            if (this.operation === 'x√'){
                this.previousOperandTextElement.innerText = `${this.operation} ${this.previousOperand} `
                //console.log(this.currentOperand + " " + this.operation + " " + this.previousOperand)
            } else {
                this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`
                //console.log(this.previousOperand + " " + this.operation + " " + this.currentOperand)
            }
            
        } else {
            this.previousOperandTextElement.innerText = ''
        }

    }

    addHistoryOneElem(result, operation, current) {
        var para = document.createElement("P");   
        para.innerText = current + " " + operation + " = " + result;
        para.class = "history-text"
        document.getElementById("innerHistory").appendChild(para);
    }

    addHistory(result, operation, current1, current2) {
        var para = document.createElement("P");   
        para.innerText = current1 + " " + operation + " " + current2 + " = " + result;
        para.class = "history-text"
        document.getElementById("innerHistory").appendChild(para);
    }
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const squareButton = document.querySelector('[data-square]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const historyButtons = document.querySelectorAll('[data-history]') 
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

squareButton.addEventListener('click', button => {
    if (!calculator.currentOperandIsEmpty()) {
        calculator.computeSingleOperand('√')
        calculator.updateDisplay()
    }
})

allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})

let calcVisible = true;

historyButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (calcVisible){
            document.getElementById("history").style.display = 'grid';
            document.getElementById("calculator").style.display = 'none';
            calcVisible = false;
        }
        else if (!calcVisible){
            document.getElementById("calculator").style.display = 'grid';
            document.getElementById("history").style.display = 'none';
            calcVisible = true
        }
    })
})