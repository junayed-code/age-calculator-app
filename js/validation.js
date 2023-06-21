"use strict";

class Validator {
  constructor(message, bReport) {
    this.message = message;
    this.bReport = bReport;
    this._hasMsg = !!this.message;
  }
}

class Required extends Validator {
  constructor(message = "This field is required", bReport = false) {
    super(message, bReport);
  }

  isValid(el) {
    return !el.value.trim() == "";
  }
}

class Min extends Validator {
  constructor(min = 0, message, bReport) {
    super(message, bReport);
    this.min = min;
  }

  isValid(el) {
    if (!this._hasMsg) this.message = `Must be a valid ${el.id}`;
    return el.value > this.min;
  }
}

class DateValidator extends Validator {
  today = new Date();

  constructor(message, bReport) {
    super(message, bReport);
  }

  _isLeapYear(year) {
    return (
      (year % 4 === 0 && year % 100 !== 0) ||
      (year % 100 === 0 && year % 400 === 0)
    );
  }

  _daysInMonth(month, year) {
    const monthsLastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month === 2 && this._isLeapYear(year)) {
      return 29;
    } else {
      return monthsLastDate[--month];
    }
  }

  _isValidDate(day, month, year) {
    // return false, if date is out of range.
    if ((month === 1 || month > 2) && day > this._daysInMonth(month)) {
      return false;
    } else if (month === 2) {
      // check year is leap year or not
      const leapYear = this._isLeapYear(year);

      // return false, if year is leap year and date is out of range.
      if ((leapYear && day > 29) || (!leapYear && day > 28)) {
        return false;
      }
    }

    return true;
  }
}

class DateYear extends DateValidator {
  constructor(message = "Must be in the past", bReport) {
    super(message, bReport);
  }

  isValid(el) {
    const year = this.today.getFullYear();
    return !(el.value > year);
  }
}

class DateMonth extends DateValidator {
  constructor(year, message, bReport) {
    super(message, bReport);
    this.year = year;
  }

  isValid(el) {
    const year = this.today.getFullYear();
    const month = this.today.getMonth() + 1;
    const yearVal = +this.year.value;

    const isInvalidMonth = el.value > 12;
    const isFutureMonth = yearVal === year && el.value > month;

    if (!this._hasMsg) {
      if (isInvalidMonth) this.message = `Must be a valid month`;
      else if (isFutureMonth) this.message = `Must be in the past`;
    }

    return !(isInvalidMonth || isFutureMonth);
  }
}

class DateDay extends DateValidator {
  constructor(month, year, message, bReport) {
    super(message, bReport);
    this.month = month;
    this.year = year;
  }

  isValid(el) {
    const year = this.today.getFullYear();
    const month = this.today.getMonth() + 1;
    const day = this.today.getDate();
    const yearVal = +this.year.value;
    const monthVal = +this.month.value;

    const isInvalidDate = !this._isValidDate(el.value, monthVal, yearVal);
    const isFutureDate =
      yearVal === year && monthVal === month && el.value > day;

    if (!this._hasMsg) {
      if (isInvalidDate) this.message = `Must be a valid day`;
      else if (isFutureDate) this.message = `Must be in the past`;
    }

    return !(isInvalidDate || isFutureDate);
  }
}

// Validation object
const validation = {};

// Validators object
const validators = (validation.vlt = {});

// Create Year validator object function
validators.DateYear = ({ errorMsg, bReport }) => {
  return new DateYear(errorMsg, bReport);
};

// Create Month validator object function
validators.DateMonth = ({ errorMsg, bReport, year }) => {
  if (!(year instanceof HTMLInputElement)) {
    throw new Error("year is not instance of HTMLInputElement");
  }
  return new DateMonth(year, errorMsg, bReport);
};

// Create Month validator object function
validators.DateDay = ({ errorMsg, bReport, month, year }) => {
  if (
    !(year instanceof HTMLInputElement) ||
    !(month instanceof HTMLInputElement)
  ) {
    throw new Error("month or year is not instance of HTMLInputElement");
  }
  return new DateDay(month, year, errorMsg, bReport);
};

// Create Required validator object function
validators.Required = ({ errorMsg, bReport }) => {
  return new Required(errorMsg, bReport);
};

validators.Min = ({ errorMsg, bReport, min }) => {
  return new Min(min, errorMsg, bReport);
};

// Check whether an input element validation is valid or not
validation.checkValidation = (target, validators) => {
  for (const validator of validators) {
    if (typeof validator === "function") {
      console.log(`Please call the '${validator.name}' function.`);
      return undefined;
    }

    if (!validator.isValid(target)) {
      target.setCustomValidity(validator.message);
      if (validator.bReport) return target.reportValidity();

      return target.checkValidity();
    }
  }
  return true;
};

validation.checkValidationAll = (validationItemsMap) => {
  let valid = true;

  validationItemsMap.forEach((validators, target) => {
    if (!(target instanceof HTMLInputElement)) return (valid = undefined);
    target.setCustomValidity("");

    const check = validation.checkValidation(target, validators);
    if (!check) valid = check;
  });

  return valid;
};
