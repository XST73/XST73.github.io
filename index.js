new Vue({
  el: '#app',
  data: {
    equation: '0',
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
          this.isDecimalAdded = false
          this.isOperatorAdded = false
          this.isEqual = false
          if (character === '.') {
            this.equation += '' + character
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
          this.isDecimalAdded = true
          this.isOperatorAdded = true
        } else {
          this.isOperatorAdded = false
        }


        this.equation += '' + character
      }

      //Added Operator
      if (this.isOperator(character) && !this.isOperatorAdded) {
        this.equation += '' + character
        this.isDecimalAdded = false
        this.isOperatorAdded = true
        this.isEqual = false
      }
    },
    //when pressed '='
    calculate() {
      let result = this.equation.replace(new RegExp('×', 'g'), '*').replace(new RegExp('÷', 'g'), '/')
      // console.log(result)

      let ans = eval(result)
      this.equation = (ans < 1.0e9 ? parseFloat(ans.toFixed(9)) : ans.toExponential(3)).toString()
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

    //when pressed '←'
    backspace() {
      if (!this.isStarted || this.isEqual) {
        return
      }

      let toDelete = this.equation.substring(this.equation.length - 1, this.equation.length)
      //Delete dot
      if (this.isDecimalAdded && toDelete === '.') {
        this.isDecimalAdded = false
      }

      //Delete operator
      if (this.isOperatorAdded && ['+', '-', '×', '÷'].indexOf(toDelete) > -1) {
        this.isOperatorAdded = false
      }

      this.equation = this.equation.substring(0, this.equation.length - 1)

      if (this.equation === '') {
        this.equation = '0'
      }
    },
    //when pressed 'AC'
    clear() {
      this.equation = '0'
      this.isDecimalAdded = false
      this.isOperatorAdded = false
      this.isStarted = false
      this.isEqual = false
    }
  }
})