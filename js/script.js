"use strict";

const form = document.querySelector("form.form");
const inputDay = form.querySelector("#day");
const inputMonth = form.querySelector("#month");
const inputYear = form.querySelector("#year");
const allInputFields = form.querySelectorAll(".form__input");
const resultFields = document.querySelectorAll(".result__value span");
const { vlt } = validation; // validation object

// Required validator options
const vltOptionsRe = {
  // errorMsg: "This field is required",
  // bReport: false,
};
// Minimum validator options
const vltOptionsMin = {
  min: 0,
};

// Year validator options
const vltOptionsYear = {};

// Month validator options
const vltOptionsMonth = {
  year: inputYear,
};
// Day validator options
const vltOptionsDay = {
  year: inputYear,
  month: inputMonth,
};

// Validation Items
const validationItemsMap = new Map();

// Set validation into the input element
validationItemsMap.set(inputDay, [
  vlt.Required(vltOptionsRe),
  vlt.DateDay(vltOptionsDay),
  vlt.Min(vltOptionsMin),
]);

validationItemsMap.set(inputMonth, [
  vlt.Required(vltOptionsRe),
  vlt.DateMonth(vltOptionsMonth),
  vlt.Min(vltOptionsMin),
]);

validationItemsMap.set(inputYear, [
  vlt.Required(vltOptionsRe),
  vlt.DateYear(vltOptionsYear),
  vlt.Min(vltOptionsMin),
]);

class App {
  constructor() {
    // Event Listeners
    form.addEventListener("keydown", this.#formKeyDown);
    form.addEventListener("submit", this.#formSubmit.bind(this));
    inputDay.addEventListener("invalid", this.#inputFieldInvalidAlert);
    inputMonth.addEventListener("invalid", this.#inputFieldInvalidAlert);
    inputYear.addEventListener("invalid", this.#inputFieldInvalidAlert);
  }

  #formSubmit(e) {
    e.preventDefault();

    // remove all error alert
    allInputFields.forEach((field) => {
      field.nextElementSibling.textContent = "";
      field.parentElement.classList.remove(`form__group--error`);
    });

    // prettier-ignore
    const formValidation = 
      validation.checkValidationAll(validationItemsMap);

    if (formValidation) {
      // Calculate Age
      const age = this.calcDifferenceOfDate(
        +inputDay.value,
        +inputMonth.value,
        +inputYear.value
      );

      // Display age value
      this.#displayResult(age);
    }
  }

  #formKeyDown(e) {
    // prettier-ignore
    const allowKeys =
    [...("0123456789"), "Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight"];

    if (e.target.tagName === "INPUT" && e.target.type === "number") {
      if (!allowKeys.includes(e.key)) {
        e.preventDefault();
      }
    }
  }

  #inputFieldInvalidAlert(e) {
    e.target.nextElementSibling.textContent = e.target.validationMessage;

    allInputFields.forEach((el) => {
      el.parentElement.classList.add("form__group--error");
    });
  }

  #displayResult(result) {
    resultFields.forEach((field) => {
      field.textContent = result[field.dataset.resultField];
    });
  }

  calcDifferenceOfDate(day, month, year) {
    const pastDate = new Date(year, month - 1, day);
    const differenceOfDate = new Date(Date.now() - pastDate);

    const years = differenceOfDate.getUTCFullYear() - 1970,
      months = differenceOfDate.getUTCMonth(),
      days = differenceOfDate.getUTCDate() - 1;

    return { years, months, days };
  }
}

// app initialize
const _app = new App();
