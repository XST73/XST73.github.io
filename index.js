new Vue({
  el: '#app',
  data: {
    equation: '0',
    isDecimalAddedOriginal: false,
    isDecimalAdded: false,
    isOperatorAdded: false,
    isStarted: false,
    isEqual: false,
  },
  methods: {
    //check if the character is + - × ÷
    isOperator(character) {
      return ['+', '-', '×', '÷'].indexOf(character) > -1
    },
    //when pressed Operator or Numbers
    append(character) {
      //Start
      if (this.equation === '0' && !this.isOperator(character)) {
        if (character === '.') {
          this.equation += '' + character
          this,isDecimalAddedOriginal = this.isDecimalAdded
          this.isDecimalAdded = true
        } else {
          this.equation = '' + character
        }

        this.isStarted = true
        return
      }

      //If Number
      if (!this.isOperator(character)) {
        if (this.isEqual) {
          this.equation = '0'
          this.isDecimalAddedOriginal = false
          this.isDecimalAdded = false
          this.isOperatorAdded = false
          this.isEqual = false
          if (character === '.') {
            this.equation += '' + character
            this.isDecimalAddedOriginal = this.isDecimalAdded
            this.isDecimalAdded = true
          } else {
            this.equation = '' + character
          }
          return
        }


        if (character === '.' && this.isDecimalAdded) {
          return
        }

        if (character === '.') {
          this.isDecimalAddedOriginal = this.isDecimalAdded
          this.isDecimalAdded = true
          this.isOperatorAdded = true
        } else {
          this.isOperatorAdded = false
        }


        this.equation += '' + character
      }

      //Added Operator
      if (this.isOperator(character)) {
        if (this.isOperatorAdded && !this.isDecimalAdded) {
          this.backspace()
          this.equation += '' + character
          this.isDecimalAddedOriginal = this.isDecimalAdded
          this.isDecimalAdded = false
          this.isOperatorAdded = true
          this.isEqual = false
        } else if (!this.isOperatorAdded) {
          this.equation += '' + character
          this.isDecimalAddedOriginal = this.isDecimalAdded
          this.isDecimalAdded = false
          this.isOperatorAdded = true
          this.isEqual = false
        }

      }
    },
    //when pressed '='
    calculate() {
      let result = this.equation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
      // console.log(result)

      let ans = eval(result)
      this.equation = (ans < 1.0e9 ? parseFloat(ans.toFixed(9)) : ans.toExponential(3)).toString()
      this.isDecimalAddedOriginal = this.isDecimalAdded
      this.isDecimalAdded = false
      this.isOperatorAdded = false
      this.isEqual = true
    },
    /* //when pressed '+/-'
    calculateToggle() {
      if (this.isOperatorAdded || !this.isStarted) {
        return
      }

      this.equation = this.equation + '* -1'
      this.calculate()
    }, */
    //when pressed '%'
    calculatePercentage() {
      if (this.isOperatorAdded || !this.isStarted) {
        return
      }

      this.equation = this.equation + '* 0.01'
      this.calculate()
    },

    //When pressed '←'
    backspace() {
      if (this.isEqual) {
        return
      }

      let toDelete = this.equation.substring(this.equation.length - 1, this.equation.length)
      //Delete dot
      if (this.isDecimalAdded && toDelete === '.') {
        this.isDecimalAdded = false
        this.isOperatorAdded = false
      }

      //Delete operator
      if (this.isOperatorAdded && this.isOperator(toDelete)) {
        this.isOperatorAdded = false
        this.isDecimalAdded = this.isDecimalAddedOriginal
      }

      this.equation = this.equation.substring(0, this.equation.length - 1)

      //After deleting,the last character is operator
      let theLast = this.equation.substring(this.equation.length - 1, this.equation.length)
      if (this.isOperator(theLast)) {
        this.isOperatorAdded = true
      }

      if (this.equation === '') {
        this.equation = '0'
      }
    },
    //when pressed 'AC'
    clear() {
      this.equation = '0'
      this.isDecimalAddedOriginal = false
      this.isDecimalAdded = false
      this.isOperatorAdded = false
      this.isStarted = false
      this.isEqual = false
    }
  }
})