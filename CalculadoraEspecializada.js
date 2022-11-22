"use strict";
class Stack {

    ds
    counter

    constructor() {
        this.ds = []
        this.counter = -1
    }

    push(elem) {
        this.counter++
        this.ds[this.counter] = new Number(elem)
    }

    pop() {
        if(this.counter >= 0) {
            var elem = new Number(this.ds[this.counter])
            this.ds[this.counter] = null
            this.counter--
            return elem
        }
    }

    get(index) {
        if(index <= this.counter)
            return new Number(this.ds[index])
    }

    getSize() {
        return this.counter + 1
    }

    reset() {
        this.ds = []
        this.counter = -1
    }
}

class CalculadoraRPN {
    
    stack
    pantalla
    entrada
    shft

    constructor() {
        this.stack = new Stack()
        this.pantalla = ""
        this.entrada = "0"
        this.shft = false
    }

    // Actualiza la pantalla grande con los distintos elementos pusheados
    paintScreen() {
        var i = 0
        this.pantalla = ""
        while (i < this.stack.getSize()) {
            this.pantalla += this.stack.get(i) + "\n"
            i++
        }
        document.getElementsByTagName("textarea")[0].textContent = this.pantalla
    }

    // Añade un dígito sobre el campo de entrada
    digitos(n) {
        if(this.entrada == "0")         // Si hay un 0, lo sustituye por el dígito introducido
            this.entrada = n
        else                            // Si hay otro número, concatena cifras
            this.entrada += "" + n

        document.getElementsByTagName("input")[0].value = this.entrada
    }

    // Añade si procede un punto al número en el input
    punto() {
        if(! this.haveDot(this.entrada))
            this.entrada += "."
            document.getElementsByTagName("input")[0].value = this.entrada
    }

    haveDot(n) {
        var separated = (n + "").split(".")
        if(separated[1] == null) return false;
        return true;
    }

    // Actualiza el valor del shift y lo materializa en pantalla
    shift() {
        this.shft = !this.shft
        if(this.shft)
            document.getElementsByTagName("input")[30].value = "↑*"
        else
            document.getElementsByTagName("input")[30].value = "↑"
    }

    // Introduce el número del campo entrada a la pila, y reinicia la entrada
    enter() {
        var operand = document.getElementsByTagName("input")[0].value

        this.entrada = "0"
        document.getElementsByTagName("input")[0]. value = this.entrada

        this.stack.push(new Number(operand))
        this.paintScreen()
    }

    suma() { this.binaryOperation("+") }

    resta() { this.binaryOperation("-") }

    multiplicacion() { this.binaryOperation("x") }

    division() { this.binaryOperation("÷") }

    potencia() { this.binaryOperation("^") }

    modulo() { this.binaryOperation("%") }

    binaryOperation(op) {
        if(this.stack.getSize() >= 2) {
            var op2 = new Number(this.stack.pop())
            var op1 = new Number(this.stack.pop())
            var res;

            if(op == "+") res = op1 + op2
            else if(op == "-") res = op1 - op2
            else if(op == "x") res = op1 * op2
            else if(op == "÷") res = op1 / op2
            else if(op == "^") res = op1 ** op2
            else if(op == "%") res = op1 % op2

            // Si se calcula algo que no se pueda, se impide que el dato erróneo prospere
            if(isNaN(res)) { this.stack.push(new Number(op1)) ; res = op2 }

            this.stack.push(new Number(res))
            this.paintScreen()
        }
    }

    // Carga el número e al campo de entrada
    e() {
        this.entrada = Math.E
        document.getElementsByTagName("input")[0].value = this.entrada
    }

    // Carga el número pi al campo de entrada
    pi() {
        this.entrada = Math.PI
        document.getElementsByTagName("input")[0].value = this.entrada
    }

    // Cambia el signo al operando en el campo de entrada
    masMenos() {
        this.entrada = new Number(this.entrada) * new Number(-1)
        document.getElementsByTagName("input")[0].value = this.entrada
    }

    // Borra el número en el campo de entrada
    borrarNumero() {
        this.entrada = "0"
        document.getElementsByTagName("input")[0].value = this.entrada
    }

    // Borra todo dato de la calculadora
    borrar() {
        this.stack.reset()
        this.pantalla = ""
        this.entrada = "0"
        document.getElementsByTagName("textarea")[0].textContent = this.pantalla
        document.getElementsByTagName("input")[0].value = this.entrada
    }

    // Borra el último número introducido en la pila
    borrarUltimo() {
        this.stack.pop()
        this.paintScreen()
    }

    factorial(n) {
        if(n == 0 || n == 1) return new Number(1);
        else try { return new Number(n) * this.factorial(n-1) } catch(err) { alert("(X) Error: " + err) }
    }

    fact() { this.opUnaria("fact") }

    potencia2() { this.opUnaria("pot2") }

    raiz() { this.opUnaria("raiz") }

    sinArc() { this.opUnaria("sinArc") }

    cosArc() { this.opUnaria("cosArc") }

    tanArc() { this.opUnaria("tanArc") }

    opUnaria(op) {
        if(this.stack.getSize() > 0) {
            var op1 = new Number(this.stack.pop())
            var res;

            if(op == "fact") res =  this.factorial(op1)
            else if(op == "pot2") res = Math.pow(op1, new Number(2))
            else if(op == "raiz") res = Math.sqrt(op1)
            else if(op == "sinArc") res = this.shft ? Math.asin(op1) : Math.sin(op1)
            else if(op == "cosArc") res = this.shft ? Math.acos(op1) : Math.cos(op1)
            else if(op == "tanArc") res = this.shft ? Math.atan(op1) : Math.tan(op1)

            // Redondeo en ciertas operaciones trigonométricas
            if(res == 1.2246467991473532e-16) res = 0

            // Si se calcula algo que no se pueda, se impide que el dato erróneo prospere
            if(isNaN(res)) res = op1

            this.stack.push(new Number(res))
            this.paintScreen()
        }
    }

    receiveKeyPressed(e) {
        if (e.key == "Escape") this.borrar();
        else if(e.key == "1") this.digitos(1);
        else if(e.key == "2") this.digitos(2);
        else if(e.key == "3") this.digitos(3);
        else if(e.key == "4") this.digitos(4);
        else if(e.key == "5") this.digitos(5);
        else if(e.key == "6") this.digitos(6);
        else if(e.key == "7") this.digitos(7);
        else if(e.key == "8") this.digitos(8);
        else if(e.key == "9") this.digitos(9);
        else if(e.key == "0") this.digitos(0);
        else if(e.key == ".") this.punto();
        else if(e.key == "+") this.suma();
        else if(e.key == "-") this.resta();
        else if(e.key == "*") this.multiplicacion();
        else if(e.key == "/") this.division();
        else if(e.key == "Control") this.shift();
        else if(e.key == "c" || e.key == "C") this.borrarNumero();
        else if(e.key == "s" || e.key == "S") this.masMenos();
        else if(e.key == "e" || e.key == "E") this.e();
        else if(e.key == "Enter") { this.enter(); e.preventDefault() }
        else if(e.key == "r" || e.key == "R") this.raiz();
        else if(e.key == "!") this.fact();
        else if(e.key == "p" || e.key == "P") this.pi();
        else if(e.key == "\"") this.potencia2();
        else if(e.key == "\'") this.potencia();
        else if(e.key == "m" || e.key == "M") this.modulo();
        else if(e.key == "d" || e.key == "D") this.borrarUltimo(); 
        else if(e.key == "i" || e.key == "I") this.sinArc();
        else if(e.key == "o" || e.key == "O") this.cosArc();
        else if(e.key == "a" || e.key == "A") this.tanArc();
    }

}

class CalculadoraEspecializada extends CalculadoraRPN {

    modo

    constructor() {
        super()
        this.modo = "DEC"
    }

    // Cambia el modo de representación de todos los números
    cambiarModo() {
        if(this.modo == "DEC") { this.modo = "HEX"; document.getElementsByTagName("input")[18].value = "HEX" }
        else if(this.modo == "HEX") { this.modo = "BIN"; document.getElementsByTagName("input")[18].value = "BIN" }
        else if(this.modo == "BIN") { this.modo = "OCT"; document.getElementsByTagName("input")[18].value = "OCT" }
        else if(this.modo == "OCT") { this.modo = "DEC"; document.getElementsByTagName("input")[18].value = "DEC" }

        this.paintScreen()
        this.borrarNumero()
    }

    // Método que necesita ser @Override ya que se tienen que mostrar los datos en función del modo, con la codificación oportuna
    paintScreen() {
        var i = 0
        this.pantalla = ""
        while (i < this.stack.getSize()) {
            this.pantalla += this.traducirDeDecimalAModo(this.modo, this.stack.get(i)) + "\n"
            i++
        }
        document.getElementsByTagName("textarea")[0].textContent = this.pantalla
    }

    // Convierte un número decimal a su equivalente en binario, octal o hexadecimal
    traducirDeDecimalAModo(mode, num) {
        if(mode == "DEC") return num
        else if(mode == "HEX") return num.toString(16)
        else if(mode == "BIN") return num.toString(2)
        else if(mode == "OCT") return num.toString(8)
    }

    // Método que necesita ser @Override ya que hay nuevos digitos en ciertos modos
    digitos(n) {
        // Nuevo capado de digitos en función del modo
        if(this.modo == "BIN" && (isNaN(n) || n > 1)) return;
        if(this.modo == "OCT" && (isNaN(n) || n > 7)) return;
        if(this.modo == "DEC" && (isNaN(n) || n > 9)) return;
        if(this.modo == "HEX" && n > 9) n = this.equivalenciaHexadecimal(n)

        super.digitos(n)
    }

    // Método para transformar la entrada de valores > 10 en las letras hexadecimales correspondientes
    equivalenciaHexadecimal(n) {
        if(n == 10) return "A"
        else if(n == 11) return "B"
        else if(n == 12) return "C"
        else if(n == 13) return "D"
        else if(n == 14) return "E"
        else if(n == 15) return "F"
    }

    // Método que necesita ser @Override ya que podemos estar trabajando en un modo pero internamente solo trabajamos en decimal
    enter() {
        var operand = document.getElementsByTagName("input")[0].value
        operand = this.traducirDeModoADecimal(this.modo, operand)

        this.entrada = "0"
        document.getElementsByTagName("input")[0]. value = this.entrada

        this.stack.push(new Number(operand))
        this.paintScreen()
    }

    // Traduce un número en cierta base a decimal
    traducirDeModoADecimal(mode, num) {
        if(mode == "DEC") return num
        else if(mode == "HEX") return this.haveDot(num) ? this.traducirDecimal(num) : parseInt(num, 16)
        else if(mode == "BIN") return this.haveDot(num) ? this.traducirDecimal(num) : parseInt(num, 2)
        else if(mode == "OCT") return this.haveDot(num) ? this.traducirDecimal(num) : parseInt(num, 8)
    }

    traducirDecimal(num) {
        var number = new Number(0)
        var parts = (num + "").split(".")
        var base = this.getBase()

        var i1 = 0
        while(i1 < (parts[0] + "").length) {
            var d = new Number(this.getNumericDigit((parts[0] + "").charAt(i1)))
            var exp = new Number((parts[0] + "").length - new Number(1) - new Number(i1))
            number += new Number(d * Math.pow(base, exp))
            i1++
        }

        var i2 = 0
        while(i2 < (parts[1] + "").length) {
            var d = new Number(this.getNumericDigit((parts[1] + "").charAt(i2)))
            var exp = new Number(-1) - new Number(i2)
            number += new Number(d * Math.pow(base, exp))
            i2++
        }

        return number
    }

    getBase() {
        if(this.modo == "DEC") return 10;
        else if(this.modo == "HEX") return 16;
        else if(this.modo == "BIN") return 2;
        else if(this.modo == "OCT") return 8;
    }

    getNumericDigit(digit) {
        if(! isNaN(digit)) return digit
        else if(digit == "a" || digit == "A") return 10
        else if(digit == "b" || digit == "B") return 11
        else if(digit == "c" || digit == "C") return 12
        else if(digit == "d" || digit == "D") return 13
        else if(digit == "e" || digit == "E") return 14
        else if(digit == "f" || digit == "F") return 15
    }

    // Método que necesita ser @Override ya que se han añadido más botones y al actualizarlo, se encuentra en otra posición
    shift() {
        this.shft = !this.shft
        if(this.shft)
            document.getElementsByTagName("input")[36].value = "↑*"
        else
            document.getElementsByTagName("input")[36].value = "↑"
    }

    // Método que necesita ser @Override ya que se representa en función del modo
    e() {
        this.entrada = this.traducirDeDecimalAModo(this.modo, Math.E)
        document.getElementsByTagName("input")[0].value = this.entrada
    }

    // Método que necesita ser @Override ya que se representa en función del modo
    pi() {
        this.entrada = this.traducirDeDecimalAModo(this.modo, Math.PI)
        document.getElementsByTagName("input")[0].value = this.entrada
    }

    receiveKeyPressed(e) {
        super.receiveKeyPressed(e);
        if (e.key == "?") this.cambiarModo();
        else if(e.key == "u" || e.key == "U") this.digitos(10);
        else if(e.key == "v" || e.key == "V") this.digitos(11);
        else if(e.key == "w" || e.key == "W") this.digitos(12);
        else if(e.key == "x" || e.key == "X") this.digitos(13);
        else if(e.key == "y" || e.key == "Y") this.digitos(14);
        else if(e.key == "z" || e.key == "Z") this.digitos(15);
    }

}

var CALC = new CalculadoraEspecializada();

document.addEventListener('keydown', (e) => CALC.receiveKeyPressed(e));
