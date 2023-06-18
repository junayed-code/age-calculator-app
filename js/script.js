"use strict";

const form = document.querySelector("form.form");
const inputDay = form.querySelector("#day");
const inputMonth = form.querySelector("#month");
const inputYear = form.querySelector("#year");
const allInputFields = form.querySelectorAll(".form__input");
const resultFields = document.querySelectorAll(".result__value span");

class App {
  constructor() {
    this.today = new Date();
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth() + 1;
    this.day = this.today.getDate();

    form.addEventListener("keydown", (e) => {
      const allowKeys = [
        "Backspace",
        "Tab",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
      ];

      if (e.target.tagName === "INPUT" && e.target.type === "number") {
        if (isNaN(e.key) && !allowKeys.includes(e.key)) {
          e.preventDefault();
        }
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (this.validateInputs()) {
        const age = this.diffDate(
          +inputDay.value,
          +inputMonth.value,
          +inputYear.value
        );

        this.displayResult(age);
      }
    });
  }

  isLeapYear(year) {
    return (
      (year % 4 === 0 && year % 100 !== 0) ||
      (year % 100 === 0 && year % 400 === 0)
    );
  }

  daysInMonth(month, year) {
    const monthsLastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month === 2 && this.isLeapYear(year)) {
      return 29;
    } else {
      return monthsLastDate[--month];
    }
  }

  validateInputs() {
    const dayValue = +inputDay.value,
      monthValue = +inputMonth.value,
      yearValue = +inputYear.value;

    // remove all error alert
    allInputFields.forEach((field) => {
      field.nextElementSibling.textContent = "";
      field.parentElement.classList.remove(`form__group--error`);
    });

    // check if any field is empty or check field value less than 1
    let valid = true;
    allInputFields.forEach((el) => {
      if (el.value === "") {
        this.inputFieldInvalidAlert(el, `This field is required`);
        valid = false;
      } else if (el.value < 1) {
        this.inputFieldInvalidAlert(el, `Must be a valid ${el.id}`);
        valid = false;
      }
    });
    if (!valid) return false;

    // if the year is in the future
    if (yearValue > this.year) {
      this.inputFieldInvalidAlert(inputYear, `Must be in the past`);
      return false;
    }

    // if the month number is not between 1-12
    if (monthValue > 12) {
      this.inputFieldInvalidAlert(inputMonth, `Must be a valid month`);
      return false;
    }

    // if the date is invalid
    if (!this.isValidDate(dayValue, monthValue, yearValue)) {
      this.inputFieldInvalidAlert(inputDay, `Must be a valid day`);
      return false;
    }

    // if the month is in the future
    if (yearValue === this.year && monthValue > this.month) {
      this.inputFieldInvalidAlert(inputMonth, `Must be in the past`);
      return false;
    }

    // if the date is in the future
    if (
      yearValue === this.year &&
      monthValue === this.month &&
      dayValue > this.day
    ) {
      this.inputFieldInvalidAlert(inputDay, `Must be in the past`);
      return false;
    }

    return true;
  }

  inputFieldInvalidAlert(inputField, msg) {
    inputField.nextElementSibling.textContent = msg;

    allInputFields.forEach((el) => {
      el.parentElement.classList.add("form__group--error");
    });
  }

  displayResult(result = {}) {
    resultFields.forEach((field) => {
      field.textContent = result[field.dataset.resultField];
    });
  }

  diffDate(d, m, y) {
    const pastDate = new Date(y, m - 1, d);
    const differenceDate = new Date(this.today - pastDate);

    const years = differenceDate.getUTCFullYear() - 1970,
      months = differenceDate.getUTCMonth(),
      days = differenceDate.getUTCDate() - 1;

    return { years, months, days };
  }

  isValidDate(day, month, year) {
    // return false, if date is out of range.
    if ((month === 1 || month > 2) && day > this.daysInMonth(month)) {
      return false;
    } else if (month === 2) {
      // check year is leap year or not
      const leapYear = this.isLeapYear(year);

      // return false, if year is leap year and date is out of range.
      if ((leapYear && day > 29) || (!leapYear && day > 28)) {
        return false;
      }
    }

    return true;
  }
}

// app initialize
const _app = new App();
