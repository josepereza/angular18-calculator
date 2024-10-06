import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {

  display: string = '0';
  currentInput: string = '';
  previousInput: string = '';
  currentOperation: string | null = null;
  waitingForSecondOperand: boolean = false;

  buttons: string[][] = [
    ['C', '+/-', '%', '÷'],
    ['7', '8', '9', '⨉'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  getButtonClass(button: string): string {
    return button === '=' ? 'col-6' : 'col-3';
  }

  getButtonStyles(button: string): string {
    let classes = 'btn-calculator ';
    if (['÷', '⨉', '-', '+'].includes(button)) {
      classes += 'btn-info';
    } else if (button === '=') {
      classes += 'btn-primary';
    } else if (['C', '+/-', '%'].includes(button)) {
      classes += 'btn-light';
    } else {
      classes += 'btn-dark';
    }
    return classes;
  }

  onButtonClick(button: string): void {
    switch (button) {
      case 'C':
        this.clear();
        break;
      case '+/-':
        this.negate();
        break;
      case '%':
        this.percentage();
        break;
      case '=':
        this.calculate();
        break;
      case '÷':
      case '⨉':
      case '-':
      case '+':
        this.handleOperator(button);
        break;
      case '.':
        this.decimal();
        break;
      default:
        this.inputDigit(button);
    }
    this.updateDisplay();
  }

  clear(): void {
    this.display = '0';
    this.currentInput = '';
    this.previousInput = '';
    this.currentOperation = null;
    this.waitingForSecondOperand = false;
  }

  negate(): void {
    if (this.currentInput !== '') {
      this.currentInput = (parseFloat(this.currentInput) * -1).toString();
    }
  }

  percentage(): void {
    if (this.currentInput !== '') {
      this.currentInput = (parseFloat(this.currentInput) / 100).toString();
    }
  }

  inputDigit(digit: string): void {
    if (this.waitingForSecondOperand) {
      this.currentInput = digit;
      this.waitingForSecondOperand = false;
    } else {
      this.currentInput = this.currentInput === '0' ? digit : this.currentInput + digit;
    }
  }

  decimal(): void {
    if (!this.currentInput.includes('.')) {
      this.currentInput += this.currentInput === '' ? '0.' : '.';
    }
  }

  handleOperator(operator: string): void {
    if (this.currentOperation !== null && !this.waitingForSecondOperand) {
      this.calculate();
    }
    this.previousInput = this.currentInput !== '' ? this.currentInput : this.display;
    this.currentOperation = operator;
    this.waitingForSecondOperand = true;
  }

  calculate(): void {
    if (this.currentOperation === null || this.waitingForSecondOperand) {
      return;
    }

    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput);
    let result: number;

    switch (this.currentOperation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '⨉':
        result = prev * current;
        break;
      case '÷':
        if (current === 0) {
          this.display = 'Error';
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    this.currentInput = this.formatResult(result);
    this.currentOperation = null;
    this.waitingForSecondOperand = true;
  }

  formatResult(result: number): string {
    const maxDigits = 12;
    if (result.toString().length > maxDigits) {
      return result.toPrecision(maxDigits);
    }
    return result.toString();
  }

  updateDisplay(): void {
    this.display = this.currentInput || '0';
  }

}
